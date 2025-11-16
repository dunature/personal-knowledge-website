/**
 * 数据同步服务
 * 管理数据在本地缓存和 GitHub Gist 之间的同步
 */

import { gistService } from './gistService';
import { authService } from './authService';
import { cacheService, STORAGE_KEYS } from './cacheService';
import { validateGistData } from '@/utils/dataValidation';
import { toGistError } from '@/utils/errorHandler';
import type { GistData } from '@/types/gist';
import type { Resource } from '@/types/resource';
import type { BigQuestion, SubQuestion, TimelineAnswer } from '@/types/question';
import type { SyncStatus, SyncResult, PendingChange, SyncConfig } from '@/types/sync';

/**
 * 同步服务类
 */
class SyncService {
    private syncStatus: SyncStatus = 'idle';
    private statusListeners: Array<(status: SyncStatus) => void> = [];
    private syncTimer: ReturnType<typeof setTimeout> | null = null;
    private retryCount = 0;

    // 默认配置
    private config: SyncConfig = {
        autoSync: true,
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
        if (!this.config.autoSync) {
            return;
        }

        // 清除之前的定时器
        if (this.syncTimer) {
            clearTimeout(this.syncTimer);
        }

        // 设置新的定时器
        this.syncTimer = setTimeout(() => {
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

            // 如果在线，触发同步；如果离线，只保存到本地
            if (navigator.onLine) {
                this.triggerSync();
            } else {
                console.log('离线状态，变更已保存到本地，将在网络恢复后同步');
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
}

// 导出单例
export const syncService = new SyncService();
