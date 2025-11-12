/**
 * 数据同步服务
 * 管理数据在本地缓存和 GitHub Gist 之间的同步
 */

import { gistService } from './gistService';
import { authService } from './authService';
import { cacheService, STORAGE_KEYS } from './cacheService';
import { validateGistData } from '@/utils/dataValidation';
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

            // 从缓存读取数据
            const resources = (await cacheService.getData<Resource[]>(STORAGE_KEYS.RESOURCES)) ?? [];
            const questions = (await cacheService.getData<BigQuestion[]>(STORAGE_KEYS.QUESTIONS)) ?? [];
            const subQuestions = (await cacheService.getData<SubQuestion[]>(STORAGE_KEYS.SUB_QUESTIONS)) ?? [];
            const answers = (await cacheService.getData<TimelineAnswer[]>(STORAGE_KEYS.ANSWERS)) ?? [];

            // 构建 Gist 数据
            const gistData: GistData = {
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
            };
        } catch (error) {
            console.error('同步到 Gist 失败:', error);
            this.updateStatus('error');

            // 尝试重试
            if (this.retryCount < this.config.maxRetries) {
                this.retryCount++;
                setTimeout(() => {
                    this.syncToGist();
                }, this.config.retryDelay);
            }

            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : '同步失败',
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
            console.error('从 Gist 同步失败:', error);
            this.updateStatus('error');

            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : '同步失败',
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
     * 添加待同步变更
     */
    async addPendingChange(change: PendingChange): Promise<void> {
        try {
            const pending =
                (await cacheService.getData<PendingChange[]>(STORAGE_KEYS.PENDING_CHANGES)) || [];
            pending.push(change);
            await cacheService.saveData(STORAGE_KEYS.PENDING_CHANGES, pending);

            // 触发同步
            this.triggerSync();
        } catch (error) {
            console.error('添加待同步变更失败:', error);
        }
    }

    /**
     * 获取待同步变更
     */
    async getPendingChanges(): Promise<PendingChange[]> {
        return (await cacheService.getData<PendingChange[]>(STORAGE_KEYS.PENDING_CHANGES)) || [];
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
}

// 导出单例
export const syncService = new SyncService();
