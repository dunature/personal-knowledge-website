/**
 * 同步协调器
 * 负责协调整个同步流程，是同步功能的入口点
 */

import { syncService } from './syncService';
import { authService } from './authService';
import { cacheService } from './cacheService';
import type { SyncCheckResult, SyncPreferences, DataComparisonResult } from '@/types/sync';

class SyncCoordinator {
    private periodicCheckTimer: number | null = null;
    private isChecking = false;
    private lastCheckResult: SyncCheckResult | null = null;
    private comparisonDialogCallback: ((comparison: DataComparisonResult) => void) | null = null;
    private updateNotificationCallback: ((comparison: DataComparisonResult) => void) | null = null;

    /**
     * 应用启动时检查更新
     */
    async checkOnStartup(): Promise<void> {
        console.log('[SyncCoordinator] 启动时检查更新');

        // 1. 检查是否配置了 Token 和 Gist ID
        if (!authService.isAuthenticated() || !authService.getGistId()) {
            console.log('[SyncCoordinator] 未认证或未配置 Gist ID，跳过启动检查');
            return;
        }

        // 2. 检查网络状态
        if (!navigator.onLine) {
            console.log('[SyncCoordinator] 离线状态，跳过启动检查');
            return;
        }

        // 3. 检查用户偏好
        const prefs = await this.getPreferences();
        if (!prefs.autoSyncOnStartup) {
            console.log('[SyncCoordinator] 用户禁用了启动时自动同步');
            return;
        }

        // 4. 优先显示本地数据（非阻塞）
        // UI 已经加载本地数据

        // 5. 后台检查更新
        try {
            this.isChecking = true;
            const result = await syncService.checkForUpdates();
            this.lastCheckResult = result;

            if (result.hasUpdates && result.comparison) {
                console.log('[SyncCoordinator] 检测到云端有更新');

                // 6. 显示数据对比对话框或自动同步
                if (prefs.showDataComparison) {
                    this.showComparisonDialog(result.comparison);
                } else {
                    // 自动同步
                    await this.handleSyncConfirmation('auto');
                }
            } else {
                console.log('[SyncCoordinator] 数据已是最新');
            }
        } catch (error) {
            // 静默处理错误，不影响用户使用
            console.error('[SyncCoordinator] 启动检查失败:', error);
        } finally {
            this.isChecking = false;
        }
    }

    /**
     * 手动触发刷新
     */
    async manualRefresh(): Promise<SyncCheckResult> {
        console.log('[SyncCoordinator] 手动刷新');

        if (this.isChecking) {
            console.log('[SyncCoordinator] 正在检查中，跳过');
            return this.lastCheckResult || { hasUpdates: false };
        }

        try {
            this.isChecking = true;
            const result = await syncService.checkForUpdates();
            this.lastCheckResult = result;

            if (result.hasUpdates && result.comparison) {
                console.log('[SyncCoordinator] 检测到云端有更新');
                // 手动刷新时总是显示对比对话框
                this.showComparisonDialog(result.comparison);
            }

            return result;
        } catch (error) {
            console.error('[SyncCoordinator] 手动刷新失败:', error);
            return {
                hasUpdates: false,
                error: error instanceof Error ? error.message : String(error),
            };
        } finally {
            this.isChecking = false;
        }
    }

    /**
     * 启动定期检查
     */
    startPeriodicCheck(intervalMs: number = 5 * 60 * 1000): void {
        console.log(`[SyncCoordinator] 启动定期检查，间隔 ${intervalMs}ms`);

        // 清除现有定时器
        this.stopPeriodicCheck();

        // 设置新定时器
        this.periodicCheckTimer = window.setInterval(async () => {
            // 只在认证且在线时检查
            if (!authService.isAuthenticated() || !navigator.onLine) {
                return;
            }

            try {
                const result = await syncService.checkForUpdates();

                if (result.hasUpdates && result.comparison) {
                    console.log('[SyncCoordinator] 定期检查：检测到云端更新');
                    // 显示通知，让用户决定是否同步
                    this.showUpdateNotification(result.comparison);
                }
            } catch (error) {
                console.error('[SyncCoordinator] 定期检查失败:', error);
            }
        }, intervalMs);
    }

    /**
     * 停止定期检查
     */
    stopPeriodicCheck(): void {
        if (this.periodicCheckTimer !== null) {
            console.log('[SyncCoordinator] 停止定期检查');
            clearInterval(this.periodicCheckTimer);
            this.periodicCheckTimer = null;
        }
    }

    /**
     * 处理用户同步确认
     */
    async handleSyncConfirmation(action: 'sync' | 'skip' | 'auto'): Promise<void> {
        console.log(`[SyncCoordinator] 处理同步确认: ${action}`);

        if (action === 'skip') {
            console.log('[SyncCoordinator] 用户选择跳过同步');
            return;
        }

        if (action === 'auto') {
            // 更新偏好设置：不再显示对比对话框
            const prefs = await this.getPreferences();
            prefs.showDataComparison = false;
            await this.savePreferences(prefs);
        }

        // 执行同步
        try {
            const result = await syncService.pullFromCloud();

            if (result.success) {
                console.log('[SyncCoordinator] 同步成功');
                // 刷新界面（通过事件或回调）
                window.dispatchEvent(new CustomEvent('sync-completed', { detail: result }));
            } else {
                console.error('[SyncCoordinator] 同步失败:', result.error);
                window.dispatchEvent(new CustomEvent('sync-failed', { detail: result }));
            }
        } catch (error) {
            console.error('[SyncCoordinator] 同步异常:', error);
            window.dispatchEvent(new CustomEvent('sync-failed', { detail: { error } }));
        }
    }

    /**
     * 获取同步偏好设置
     */
    async getPreferences(): Promise<SyncPreferences> {
        const prefs = await cacheService.getSyncPreferences();
        return prefs || this.getDefaultPreferences();
    }

    /**
     * 保存同步偏好设置
     */
    async savePreferences(prefs: SyncPreferences): Promise<void> {
        await cacheService.saveSyncPreferences(prefs);
    }

    /**
     * 获取默认偏好设置
     */
    private getDefaultPreferences(): SyncPreferences {
        return {
            autoSync: true,
            autoSyncOnStartup: true,
            periodicCheckEnabled: true,
            periodicCheckInterval: 5 * 60 * 1000, // 5 分钟
            conflictStrategy: 'merge',
            showDataComparison: true,
        };
    }

    /**
     * 显示数据对比对话框
     */
    private showComparisonDialog(comparison: DataComparisonResult): void {
        console.log('[SyncCoordinator] 显示数据对比对话框');
        if (this.comparisonDialogCallback) {
            this.comparisonDialogCallback(comparison);
        } else {
            // 通过事件触发
            window.dispatchEvent(
                new CustomEvent('show-comparison-dialog', { detail: comparison })
            );
        }
    }

    /**
     * 显示更新通知
     */
    private showUpdateNotification(comparison: DataComparisonResult): void {
        console.log('[SyncCoordinator] 显示更新通知');
        if (this.updateNotificationCallback) {
            this.updateNotificationCallback(comparison);
        } else {
            // 通过事件触发
            window.dispatchEvent(
                new CustomEvent('show-update-notification', { detail: comparison })
            );
        }
    }

    /**
     * 设置对比对话框回调
     */
    setComparisonDialogCallback(callback: (comparison: DataComparisonResult) => void): void {
        this.comparisonDialogCallback = callback;
    }

    /**
     * 设置更新通知回调
     */
    setUpdateNotificationCallback(callback: (comparison: DataComparisonResult) => void): void {
        this.updateNotificationCallback = callback;
    }

    /**
     * 获取当前检查状态
     */
    isCurrentlyChecking(): boolean {
        return this.isChecking;
    }

    /**
     * 获取最后检查结果
     */
    getLastCheckResult(): SyncCheckResult | null {
        return this.lastCheckResult;
    }
}

// 导出单例
export const syncCoordinator = new SyncCoordinator();
