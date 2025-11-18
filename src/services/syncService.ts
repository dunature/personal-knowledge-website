/**
 * 数据同步服务
 * 管理数据在本地缓存和 GitHub Gist 之间的同步
 */

import { gistService } from './gistService';
import { authService } from './authService';
import { cacheService, STORAGE_KEYS } from './cacheService';
import { dataComparator } from './dataComparator';
import { conflictResolver } from './conflictResolver';
import { validateGistData } from '@/utils/dataValidation';
import { toGistError } from '@/utils/errorHandler';
import type { GistData, GistMetadataExtended } from '@/types/gist';
import type { Resource } from '@/types/resource';
import type { BigQuestion, SubQuestion, TimelineAnswer } from '@/types/question';
import type {
    SyncStatus,
    SyncResult,
    PendingChange,
    SyncConfig,
    SyncCheckResult,
    PullSyncOptions,
    DataStatistics,
} from '@/types/sync';

/**
 * 同步服务类
 */
class SyncService {
    private syncStatus: SyncStatus = 'idle';
    private statusListeners: Array<(status: SyncStatus) => void> = [];
    private syncTimer: ReturnType<typeof setTimeout> | null = null;
    private retryCount = 0;

    // 缓存相关
    private lastCheckResult: { synced: boolean; reason?: string } | null = null;
    private lastCheckTime = 0;
    private readonly CACHE_DURATION = 30000; // 30秒缓存有效期

    // 默认配置
    private config: SyncConfig = {
        autoSync: false, // 禁用自动同步，改为手动同步
        debounceTime: 3000, // 3秒防抖
        maxRetries: 3,
        retryDelay: 5000, // 5秒重试延迟
    };

    /**
     * 上传数据到 Gist
     * @returns 同步结果
     */
    async syncToGist(): Promise<SyncResult> {
        try {
            // 检查网络状态
            if (!navigator.onLine) {
                console.log('离线状态，跳过同步');
                return {
                    success: false,
                    timestamp: new Date().toISOString(),
                    error: '当前处于离线状态',
                };
            }

            // 检查是否已认证
            if (!authService.isAuthenticated()) {
                throw new Error('未认证，无法同步');
            }

            // 获取 Token 和 Gist ID
            const token = await authService.getToken();
            const gistId = authService.getGistId();

            if (!token) {
                throw new Error('Token 不可用');
            }

            // 更新状态
            this.updateStatus('syncing');

            // 获取待同步变更
            const pendingChanges = await this.getPendingChanges();

            // 如果有待同步变更，使用增量同步
            let gistData: GistData;
            let changeStats = { added: 0, updated: 0, deleted: 0 };

            if (pendingChanges.length > 0) {
                // 增量同步：合并变更
                gistData = await this.mergeChanges(pendingChanges);
                changeStats = this.calculateChangeStats(pendingChanges);
            } else {
                // 完整同步：读取所有数据
                const resources = (await cacheService.getData<Resource[]>(STORAGE_KEYS.RESOURCES)) ?? [];
                const questions = (await cacheService.getData<BigQuestion[]>(STORAGE_KEYS.QUESTIONS)) ?? [];
                const subQuestions = (await cacheService.getData<SubQuestion[]>(STORAGE_KEYS.SUB_QUESTIONS)) ?? [];
                const answers = (await cacheService.getData<TimelineAnswer[]>(STORAGE_KEYS.ANSWERS)) ?? [];

                gistData = {
                    resources,
                    questions,
                    subQuestions,
                    answers,
                    metadata: {
                        version: '1.0.0',
                        lastSync: new Date().toISOString(),
                        owner: (await authService.getCurrentUser())?.username || 'unknown',
                    },
                };
            }

            // 上传到 Gist
            if (gistId) {
                // 更新现有 Gist
                await gistService.updateGist(gistId, gistData, token);
            } else {
                // 创建新 Gist
                const result = await gistService.createGist(gistData, token);
                authService.setGistId(result.id);
            }

            // 保存同步时间
            await cacheService.saveData(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

            // 清除待同步变更
            await cacheService.clearData(STORAGE_KEYS.PENDING_CHANGES);

            // 清除检查缓存，确保下次检查使用最新数据
            this.clearCheckCache();

            // 更新状态
            this.updateStatus('success');
            this.retryCount = 0;

            return {
                success: true,
                timestamp: new Date().toISOString(),
                changes: changeStats,
            };
        } catch (error) {
            const gistError = toGistError(error, { context: 'syncToGist' });
            console.error('同步到 Gist 失败:', gistError.toJSON());
            this.updateStatus('error');

            // 尝试重试（仅对可重试的错误）
            if (gistError.isRetryable && this.retryCount < this.config.maxRetries) {
                this.retryCount++;
                console.log(`将在 ${this.config.retryDelay}ms 后重试 (${this.retryCount}/${this.config.maxRetries})`);
                setTimeout(() => {
                    this.syncToGist();
                }, this.config.retryDelay);
            }

            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: gistError.getUserMessage(),
            };
        }
    }

    /**
     * 从 Gist 下载数据
     * @returns 同步结果
     */
    async syncFromGist(): Promise<SyncResult> {
        try {
            // 获取 Gist ID
            const gistId = authService.getGistId();
            if (!gistId) {
                throw new Error('Gist ID 不可用');
            }

            // 更新状态
            this.updateStatus('syncing');

            // 获取 Token（可选，公开 Gist 不需要）
            const token = await authService.getToken();

            // 从 Gist 下载数据
            const gistData = await gistService.getGist(gistId, token || undefined);

            // 验证数据
            if (!validateGistData(gistData)) {
                throw new Error('Gist 数据格式无效');
            }

            // 保存到缓存
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, gistData.resources);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, gistData.questions);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, gistData.subQuestions);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, gistData.answers);
            await cacheService.saveData(STORAGE_KEYS.METADATA, gistData.metadata);

            // 保存同步时间
            await cacheService.saveData(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

            // 更新状态
            this.updateStatus('success');
            this.retryCount = 0;

            return {
                success: true,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            const gistError = toGistError(error, { context: 'syncFromGist' });
            console.error('从 Gist 同步失败:', gistError.toJSON());
            this.updateStatus('error');

            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: gistError.getUserMessage(),
            };
        }
    }

    /**
     * 触发同步（带防抖）
     */
    triggerSync(): void {
        console.log('[SyncService] triggerSync 被调用，autoSync =', this.config.autoSync);

        if (!this.config.autoSync) {
            console.log('[SyncService] autoSync 为 false，不触发自动同步');
            return;
        }

        console.log('[SyncService] autoSync 为 true，将在', this.config.debounceTime, 'ms 后同步');

        // 清除之前的定时器
        if (this.syncTimer) {
            clearTimeout(this.syncTimer);
        }

        // 设置新的定时器
        this.syncTimer = setTimeout(() => {
            console.log('[SyncService] 防抖时间到，开始同步到 Gist');
            this.syncToGist();
        }, this.config.debounceTime);
    }

    /**
     * 立即同步（不防抖）
     */
    async syncNow(): Promise<SyncResult> {
        // 清除防抖定时器
        if (this.syncTimer) {
            clearTimeout(this.syncTimer);
            this.syncTimer = null;
        }

        return this.syncToGist();
    }

    /**
     * 获取当前同步状态
     */
    getSyncStatus(): SyncStatus {
        return this.syncStatus;
    }

    /**
     * 监听同步状态变化
     */
    onSyncStatusChange(callback: (status: SyncStatus) => void): () => void {
        this.statusListeners.push(callback);

        // 返回取消监听的函数
        return () => {
            this.statusListeners = this.statusListeners.filter((cb) => cb !== callback);
        };
    }

    /**
     * 更新同步状态
     */
    private updateStatus(status: SyncStatus): void {
        this.syncStatus = status;
        this.statusListeners.forEach((callback) => callback(status));

        // 保存状态到缓存
        cacheService.saveData(STORAGE_KEYS.SYNC_STATUS, status);
    }

    /**
     * 合并待同步变更到完整数据集
     * @param changes 待同步变更列表
     * @returns 合并后的完整数据
     */
    private async mergeChanges(changes: PendingChange[]): Promise<GistData> {
        // 从缓存读取当前数据
        const resources = (await cacheService.getData<Resource[]>(STORAGE_KEYS.RESOURCES)) ?? [];
        const questions = (await cacheService.getData<BigQuestion[]>(STORAGE_KEYS.QUESTIONS)) ?? [];
        const subQuestions = (await cacheService.getData<SubQuestion[]>(STORAGE_KEYS.SUB_QUESTIONS)) ?? [];
        const answers = (await cacheService.getData<TimelineAnswer[]>(STORAGE_KEYS.ANSWERS)) ?? [];

        // 应用变更
        for (const change of changes) {
            switch (change.entity) {
                case 'resource':
                    this.applyChangeToArray(resources, change);
                    break;
                case 'question':
                    this.applyChangeToArray(questions, change);
                    break;
                case 'subQuestion':
                    this.applyChangeToArray(subQuestions, change);
                    break;
                case 'answer':
                    this.applyChangeToArray(answers, change);
                    break;
            }
        }

        // 构建完整数据
        return {
            resources,
            questions,
            subQuestions,
            answers,
            metadata: {
                version: '1.0.0',
                lastSync: new Date().toISOString(),
                owner: (await authService.getCurrentUser())?.username || 'unknown',
            },
        };
    }

    /**
     * 应用变更到数组
     * @param array 目标数组
     * @param change 变更对象
     */
    private applyChangeToArray<T extends { id: string }>(array: T[], change: PendingChange): void {
        const index = array.findIndex((item) => item.id === change.id);

        switch (change.type) {
            case 'create':
                // 如果不存在，添加
                if (index === -1 && change.data) {
                    array.push(change.data);
                }
                break;
            case 'update':
                // 如果存在，更新
                if (index !== -1 && change.data) {
                    array[index] = change.data;
                }
                break;
            case 'delete':
                // 如果存在，删除
                if (index !== -1) {
                    array.splice(index, 1);
                }
                break;
        }
    }

    /**
     * 计算变更统计
     * @param changes 变更列表
     * @returns 变更统计
     */
    private calculateChangeStats(changes: PendingChange[]): {
        added: number;
        updated: number;
        deleted: number;
    } {
        return changes.reduce(
            (stats, change) => {
                switch (change.type) {
                    case 'create':
                        stats.added++;
                        break;
                    case 'update':
                        stats.updated++;
                        break;
                    case 'delete':
                        stats.deleted++;
                        break;
                }
                return stats;
            },
            { added: 0, updated: 0, deleted: 0 }
        );
    }

    /**
     * 添加待同步变更
     */
    async addPendingChange(change: PendingChange): Promise<void> {
        try {
            const pending =
                (await cacheService.getData<PendingChange[]>(STORAGE_KEYS.PENDING_CHANGES)) || [];

            // 优化：合并相同实体的变更
            const optimizedPending = this.optimizePendingChanges([...pending, change]);

            await cacheService.saveData(STORAGE_KEYS.PENDING_CHANGES, optimizedPending);

            console.log('[SyncService] 变更已记录到待同步列表:', {
                type: change.type,
                entity: change.entity,
                id: change.id,
                totalPending: optimizedPending.length,
                autoSync: this.config.autoSync
            });

            // 如果在线，触发同步；如果离线，只保存到本地
            if (navigator.onLine) {
                console.log('[SyncService] 在线状态，调用 triggerSync()');
                this.triggerSync();
            } else {
                console.log('[SyncService] 离线状态，变更已保存到本地，将在网络恢复后同步');
            }
        } catch (error) {
            console.error('添加待同步变更失败:', error);
        }
    }

    /**
     * 优化待同步变更列表
     * 合并相同实体的多次变更，只保留最终状态
     * @param changes 原始变更列表
     * @returns 优化后的变更列表
     */
    private optimizePendingChanges(changes: PendingChange[]): PendingChange[] {
        const changeMap = new Map<string, PendingChange>();

        for (const change of changes) {
            const key = `${change.entity}:${change.id}`;
            const existing = changeMap.get(key);

            if (!existing) {
                // 第一次出现，直接添加
                changeMap.set(key, change);
            } else {
                // 已存在，合并变更
                if (existing.type === 'create' && change.type === 'update') {
                    // create + update = create (使用最新数据)
                    changeMap.set(key, { ...existing, data: change.data, timestamp: change.timestamp });
                } else if (existing.type === 'create' && change.type === 'delete') {
                    // create + delete = 无操作（删除该变更）
                    changeMap.delete(key);
                } else if (existing.type === 'update' && change.type === 'update') {
                    // update + update = update (使用最新数据)
                    changeMap.set(key, { ...existing, data: change.data, timestamp: change.timestamp });
                } else if (existing.type === 'update' && change.type === 'delete') {
                    // update + delete = delete
                    changeMap.set(key, change);
                } else {
                    // 其他情况，使用最新的变更
                    changeMap.set(key, change);
                }
            }
        }

        return Array.from(changeMap.values());
    }

    /**
     * 获取待同步变更
     */
    async getPendingChanges(): Promise<PendingChange[]> {
        return (await cacheService.getData<PendingChange[]>(STORAGE_KEYS.PENDING_CHANGES)) || [];
    }

    /**
     * 清除特定实体的待同步变更
     * @param entity 实体类型
     * @param id 实体 ID
     */
    async clearPendingChange(entity: PendingChange['entity'], id: string): Promise<void> {
        try {
            const pending = await this.getPendingChanges();
            const filtered = pending.filter((change) => !(change.entity === entity && change.id === id));
            await cacheService.saveData(STORAGE_KEYS.PENDING_CHANGES, filtered);
        } catch (error) {
            console.error('清除待同步变更失败:', error);
        }
    }

    /**
     * 清除所有待同步变更
     */
    async clearAllPendingChanges(): Promise<void> {
        await cacheService.clearData(STORAGE_KEYS.PENDING_CHANGES);
    }

    /**
     * 获取待同步变更数量
     */
    async getPendingChangesCount(): Promise<number> {
        const changes = await this.getPendingChanges();
        return changes.length;
    }

    /**
     * 同步所有待同步变更（用于网络恢复后）
     * @returns 同步结果
     */
    async syncPendingChanges(): Promise<SyncResult> {
        try {
            // 检查网络状态
            if (!navigator.onLine) {
                return {
                    success: false,
                    timestamp: new Date().toISOString(),
                    error: '当前处于离线状态',
                };
            }

            // 获取待同步变更
            const pendingChanges = await this.getPendingChanges();

            if (pendingChanges.length === 0) {
                return {
                    success: true,
                    timestamp: new Date().toISOString(),
                    changes: { added: 0, updated: 0, deleted: 0 },
                };
            }

            console.log(`开始同步 ${pendingChanges.length} 个待同步变更`);

            // 执行同步
            return await this.syncToGist();
        } catch (error) {
            const gistError = toGistError(error, { context: 'syncPendingChanges' });
            console.error('同步待同步变更失败:', gistError.toJSON());
            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: gistError.getUserMessage(),
            };
        }
    }

    /**
     * 检查是否有待同步变更
     * @returns 是否有待同步变更
     */
    async hasPendingChanges(): Promise<boolean> {
        const count = await this.getPendingChangesCount();
        return count > 0;
    }

    /**
     * 获取最后同步时间
     */
    async getLastSyncTime(): Promise<string | null> {
        return cacheService.getData<string>(STORAGE_KEYS.LAST_SYNC);
    }

    /**
     * 更新配置
     */
    updateConfig(config: Partial<SyncConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * 获取配置
     */
    getConfig(): SyncConfig {
        return { ...this.config };
    }

    /**
     * 启用自动同步
     */
    enableAutoSync(): void {
        this.config.autoSync = true;
    }

    /**
     * 禁用自动同步
     */
    disableAutoSync(): void {
        this.config.autoSync = false;

        // 清除定时器
        if (this.syncTimer) {
            clearTimeout(this.syncTimer);
            this.syncTimer = null;
        }
    }

    /**
     * 重置同步状态
     */
    reset(): void {
        this.syncStatus = 'idle';
        this.retryCount = 0;

        if (this.syncTimer) {
            clearTimeout(this.syncTimer);
            this.syncTimer = null;
        }
    }

    /**
     * 从历史版本恢复数据
     * @param versionData 历史版本的数据
     * @returns 同步结果
     */
    async restoreFromVersion(versionData: GistData): Promise<SyncResult> {
        try {
            // 更新状态
            this.updateStatus('syncing');

            // 验证数据
            if (!validateGistData(versionData)) {
                throw new Error('版本数据格式无效');
            }

            // 保存到本地缓存
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, versionData.resources);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, versionData.questions);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, versionData.subQuestions);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, versionData.answers);
            await cacheService.saveData(STORAGE_KEYS.METADATA, versionData.metadata);

            // 清除待同步变更（因为我们恢复到了一个已知的状态）
            await this.clearAllPendingChanges();

            // 同步到 Gist（更新为恢复的版本）
            const result = await this.syncToGist();

            if (result.success) {
                this.updateStatus('success');
            } else {
                this.updateStatus('error');
            }

            return result;
        } catch (error) {
            const gistError = toGistError(error, { context: 'restoreFromVersion' });
            console.error('恢复版本失败:', gistError.toJSON());
            this.updateStatus('error');

            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: gistError.getUserMessage(),
            };
        }
    }

    /**
     * 执行初始同步（用于首次登录或新设备）
     * @param gistId Gist ID
     * @returns 同步结果
     */
    async performInitialSync(gistId: string): Promise<SyncResult> {
        try {
            this.updateStatus('syncing');

            // 获取 Token（可选，公开 Gist 不需要）
            const token = await authService.getToken();

            // 从 Gist 下载数据
            const remoteData = await gistService.getGist(gistId, token || undefined);

            // 验证数据
            if (!validateGistData(remoteData)) {
                throw new Error('Gist 数据格式无效');
            }

            // 检查本地是否有数据
            const localResources = await cacheService.getData<Resource[]>(STORAGE_KEYS.RESOURCES);
            const hasLocalData = localResources && localResources.length > 0;

            if (hasLocalData) {
                // 有本地数据，需要处理冲突
                throw new Error('LOCAL_DATA_EXISTS');
            }

            // 保存到本地缓存
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, remoteData.resources);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, remoteData.questions);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, remoteData.subQuestions);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, remoteData.answers);
            await cacheService.saveData(STORAGE_KEYS.METADATA, remoteData.metadata);

            // 保存同步时间
            await cacheService.saveData(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

            // 更新状态
            this.updateStatus('success');
            this.retryCount = 0;

            return {
                success: true,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            const gistError = toGistError(error, { context: 'performInitialSync' });
            console.error('初始同步失败:', gistError.toJSON());
            this.updateStatus('error');

            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: gistError.getUserMessage(),
            };
        }
    }

    /**
     * 判断应用启动时是否需要同步
     * @returns 是否需要同步
     */
    async shouldSyncOnStartup(): Promise<boolean> {
        // 检查是否配置了 Token 和 Gist ID
        if (!authService.isAuthenticated() || !authService.getGistId()) {
            return false;
        }

        // 检查网络状态
        if (!navigator.onLine) {
            return false;
        }

        // 检查上次同步时间
        const lastSync = await this.getLastSyncTime();
        if (!lastSync) {
            return true; // 从未同步过
        }

        const lastSyncTime = new Date(lastSync).getTime();
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        // 如果距离上次同步超过 5 分钟，则需要同步
        return now - lastSyncTime > fiveMinutes;
    }

    /**
     * 合并本地和云端数据
     * @param local 本地数据
     * @param remote 云端数据
     * @returns 合并后的数据
     */
    mergeLocalAndRemoteData(local: GistData, remote: GistData): GistData {
        // 使用 ID 去重合并
        const mergeById = <T extends { id: string }>(localItems: T[], remoteItems: T[]): T[] => {
            const map = new Map<string, T>();

            // 先添加远程数据
            remoteItems.forEach((item) => map.set(item.id, item));

            // 再添加本地数据（如果 ID 不存在）
            localItems.forEach((item) => {
                if (!map.has(item.id)) {
                    map.set(item.id, item);
                }
            });

            return Array.from(map.values());
        };

        return {
            resources: mergeById(local.resources, remote.resources),
            questions: mergeById(local.questions, remote.questions),
            subQuestions: mergeById(local.subQuestions, remote.subQuestions),
            answers: mergeById(local.answers, remote.answers),
            metadata: {
                ...remote.metadata,
                lastSync: new Date().toISOString(),
            },
        };
    }

    /**
     * 获取本地数据
     * @returns 本地数据
     */
    private async getLocalData(): Promise<GistData> {
        const resources = (await cacheService.getData<Resource[]>(STORAGE_KEYS.RESOURCES)) ?? [];
        const questions = (await cacheService.getData<BigQuestion[]>(STORAGE_KEYS.QUESTIONS)) ?? [];
        const subQuestions = (await cacheService.getData<SubQuestion[]>(STORAGE_KEYS.SUB_QUESTIONS)) ?? [];
        const answers = (await cacheService.getData<TimelineAnswer[]>(STORAGE_KEYS.ANSWERS)) ?? [];
        const storedMetadata = await cacheService.getData(STORAGE_KEYS.METADATA);
        const metadata = (storedMetadata as any) || {
            version: '1.0.0',
            lastSync: new Date().toISOString(),
            owner: 'unknown',
        };

        return {
            resources,
            questions,
            subQuestions,
            answers,
            metadata,
        };
    }

    /**
     * 获取 Gist 元数据（轻量级，不下载完整数据）
     * @param gistId Gist ID
     * @returns Gist 元数据
     */
    async getGistMetadata(gistId: string): Promise<GistMetadataExtended> {
        const token = await authService.getToken();

        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                Authorization: token ? `token ${token}` : '',
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error(`获取 Gist 元数据失败: ${response.statusText}`);
        }

        const metadata = await response.json();

        // 尝试从文件内容解析统计信息（如果需要）
        // 这里简化处理，实际可以解析 data.json 文件获取统计
        const statistics: DataStatistics = {
            resourceCount: 0,
            questionCount: 0,
            subQuestionCount: 0,
            answerCount: 0,
            lastModified: metadata.updated_at,
        };

        return {
            ...metadata,
            statistics,
        };
    }

    /**
     * 检查云端更新（轻量级）
     * @returns 检查结果
     */
    async checkForUpdates(): Promise<SyncCheckResult> {
        try {
            const gistId = authService.getGistId();
            if (!gistId) {
                return {
                    hasUpdates: false,
                    error: 'Gist ID 不可用',
                };
            }

            // 获取 Gist 元数据
            const metadata = await this.getGistMetadata(gistId);

            // 获取本地同步时间
            const localSyncTime = await this.getLastSyncTime();

            // 比较时间戳
            const remoteTime = new Date(metadata.updated_at).getTime();
            const localTime = localSyncTime ? new Date(localSyncTime).getTime() : 0;

            if (remoteTime <= localTime) {
                return { hasUpdates: false };
            }

            // 获取本地数据
            const localData = await this.getLocalData();

            // 下载完整云端数据以获取准确统计
            const token = await authService.getToken();
            const remoteData = await gistService.getGist(gistId, token || undefined);

            // 生成云端数据统计
            const remoteStats = dataComparator.generateStatistics(remoteData);

            // 生成对比结果
            const comparison = dataComparator.compare(localData, remoteStats);

            return {
                hasUpdates: true,
                comparison,
            };
        } catch (error) {
            console.error('检查更新失败:', error);
            return {
                hasUpdates: false,
                error: error instanceof Error ? error.message : '检查更新失败',
            };
        }
    }

    /**
     * 从云端拉取数据
     * @param options 拉取选项
     * @returns 同步结果
     */
    async pullFromCloud(options?: PullSyncOptions): Promise<SyncResult> {
        try {
            const gistId = authService.getGistId();
            if (!gistId) {
                throw new Error('Gist ID 不可用');
            }

            // 更新状态
            this.updateStatus('syncing');

            // 获取 Token
            const token = await authService.getToken();

            // 从 Gist 下载数据
            const remoteData = await gistService.getGist(gistId, token || undefined);

            // 验证数据
            if (!validateGistData(remoteData)) {
                throw new Error('Gist 数据格式无效');
            }

            // 检查是否有冲突
            if (!options?.force) {
                const pendingChanges = await this.getPendingChanges();
                const localData = await this.getLocalData();

                const conflictInfo = conflictResolver.detectConflict(
                    localData,
                    remoteData,
                    pendingChanges
                );

                if (conflictInfo.hasConflict) {
                    // 有冲突，根据策略处理
                    const strategy = options?.strategy || 'merge';
                    const resolvedData = await conflictResolver.resolve(
                        localData,
                        remoteData,
                        strategy
                    );

                    // 保存解决后的数据
                    await this.saveDataToLocal(resolvedData);

                    // 清除待同步变更
                    await this.clearAllPendingChanges();

                    this.updateStatus('success');

                    return {
                        success: true,
                        timestamp: new Date().toISOString(),
                    };
                }
            }

            // 没有冲突或强制同步，直接保存云端数据
            await this.saveDataToLocal(remoteData);

            // 清除待同步变更
            await this.clearAllPendingChanges();

            // 更新状态
            this.updateStatus('success');
            this.retryCount = 0;

            return {
                success: true,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            const gistError = toGistError(error, { context: 'pullFromCloud' });
            console.error('从云端拉取失败:', gistError.toJSON());
            this.updateStatus('error');

            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: gistError.getUserMessage(),
            };
        }
    }

    /**
     * 双向同步（先 Pull 后 Push）
     * @returns 同步结果
     */
    async bidirectionalSync(): Promise<SyncResult> {
        try {
            // 更新状态
            this.updateStatus('syncing');

            // 1. 先从云端拉取最新数据
            const pullResult = await this.pullFromCloud({ strategy: 'merge' });

            if (!pullResult.success) {
                return pullResult;
            }

            // 2. 检查是否有待同步变更
            const pendingChanges = await this.getPendingChanges();

            if (pendingChanges.length > 0) {
                // 3. 如果有待同步变更，推送到云端
                const pushResult = await this.syncToGist();
                return pushResult;
            }

            // 没有待同步变更，同步完成
            return pullResult;
        } catch (error) {
            const gistError = toGistError(error, { context: 'bidirectionalSync' });
            console.error('双向同步失败:', gistError.toJSON());
            this.updateStatus('error');

            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: gistError.getUserMessage(),
            };
        }
    }

    /**
     * 智能同步：先检查是否需要同步，再执行同步
     * @returns 同步结果，包含是否跳过的信息
     */
    async smartSync(): Promise<SyncResult & { skipped?: boolean; skipReason?: string }> {
        // 先检查是否已同步
        const checkResult = await this.isAlreadySynced();

        if (checkResult.synced) {
            // 数据已同步，跳过
            return {
                success: true,
                timestamp: new Date().toISOString(),
                skipped: true,
                skipReason: 'already_synced',
            };
        }

        // 根据不同原因处理
        if (checkResult.reason === 'offline') {
            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: '当前处于离线状态，无法同步',
                skipped: true,
                skipReason: 'offline',
            };
        }

        // 数据不一致，执行正常同步
        return await this.syncNow();
    }

    /**
     * 检查数据是否已同步（快速检查）
     * @returns 检查结果
     */
    async isAlreadySynced(): Promise<{
        synced: boolean;
        reason?: string;
    }> {
        // 0. 检查缓存（30秒内的检查结果直接返回）
        const now = Date.now();
        if (this.lastCheckResult && now - this.lastCheckTime < this.CACHE_DURATION) {
            console.log('[SyncService] 使用缓存的检查结果');
            return this.lastCheckResult;
        }

        // 1. 检查网络状态
        if (!navigator.onLine) {
            const result = { synced: false, reason: 'offline' };
            this.updateCheckCache(result);
            return result;
        }

        // 2. 检查认证状态
        if (!authService.isAuthenticated() || !authService.getGistId()) {
            const result = { synced: false, reason: 'not_authenticated' };
            this.updateCheckCache(result);
            return result;
        }

        // 3. 检查是否有待同步变更
        const pendingCount = await this.getPendingChangesCount();
        if (pendingCount > 0) {
            const result = { synced: false, reason: 'has_pending_changes' };
            this.updateCheckCache(result);
            return result;
        }

        // 4. Level 1: 时间戳检查
        const lastSyncTime = await this.getLastSyncTime();
        if (!lastSyncTime) {
            const result = { synced: false, reason: 'never_synced' };
            this.updateCheckCache(result);
            return result;
        }

        // 5. Level 2: 获取云端元数据并比较统计信息
        try {
            const gistId = authService.getGistId()!;

            // 优先使用轻量级元数据 API
            const metadata = await this.getGistMetadata(gistId);

            // 比较更新时间
            const remoteTime = new Date(metadata.updated_at).getTime();
            const localTime = new Date(lastSyncTime).getTime();

            if (remoteTime > localTime) {
                const result = { synced: false, reason: 'remote_newer' };
                this.updateCheckCache(result);
                return result;
            }

            // 获取本地数据统计
            const localData = await this.getLocalData();
            const localStats = dataComparator.generateStatistics(localData);

            // 获取云端数据（需要完整数据来比较）
            const token = await authService.getToken();
            const remoteData = await gistService.getGist(gistId, token || undefined);
            const remoteStats = dataComparator.generateStatistics(remoteData);

            // 比较统计信息
            const isIdentical = dataComparator.quickCheck(localStats, remoteStats);

            const result = isIdentical
                ? { synced: true }
                : { synced: false, reason: 'data_differs' };

            this.updateCheckCache(result);
            return result;
        } catch (error) {
            console.error('检查同步状态失败:', error);
            // 检查失败不缓存结果
            return { synced: false, reason: 'check_failed' };
        }
    }

    /**
     * 更新检查结果缓存
     * @param result 检查结果
     */
    private updateCheckCache(result: { synced: boolean; reason?: string }): void {
        this.lastCheckResult = result;
        this.lastCheckTime = Date.now();
    }

    /**
     * 清除检查结果缓存
     */
    private clearCheckCache(): void {
        this.lastCheckResult = null;
        this.lastCheckTime = 0;
    }

    /**
     * 保存数据到本地
     * @param data Gist 数据
     */
    private async saveDataToLocal(data: GistData): Promise<void> {
        await cacheService.saveData(STORAGE_KEYS.RESOURCES, data.resources);
        await cacheService.saveData(STORAGE_KEYS.QUESTIONS, data.questions);
        await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, data.subQuestions);
        await cacheService.saveData(STORAGE_KEYS.ANSWERS, data.answers);
        await cacheService.saveData(STORAGE_KEYS.METADATA, data.metadata);
        await cacheService.saveData(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    }
}

// 导出单例
export const syncService = new SyncService();
