/**
 * 自动同步 Hook
 * 监听网络状态，在网络恢复后自动同步待同步变更
 */

import { useEffect, useCallback, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { syncService } from '@/services/syncService';
import { useToast } from './useToast';

export interface AutoSyncOptions {
    enabled?: boolean; // 是否启用自动同步
    showNotifications?: boolean; // 是否显示同步通知
}

/**
 * 使用自动同步 Hook
 * @param options - 配置选项
 */
export const useAutoSync = (options?: AutoSyncOptions): void => {
    const { enabled = true, showNotifications = true } = options || {};
    const [isSyncing, setIsSyncing] = useState(false);
    const { showToast } = useToast();

    // 网络恢复时的同步处理
    const handleNetworkRecovery = useCallback(async () => {
        if (!enabled || isSyncing) {
            return;
        }

        try {
            // 检查是否有待同步变更
            const hasPending = await syncService.hasPendingChanges();

            if (!hasPending) {
                console.log('网络已恢复，但没有待同步变更');
                return;
            }

            const pendingCount = await syncService.getPendingChangesCount();
            console.log(`网络已恢复，开始同步 ${pendingCount} 个待同步变更`);

            if (showNotifications) {
                showToast('info', `正在同步 ${pendingCount} 个离线变更...`);
            }

            setIsSyncing(true);

            // 执行同步
            const result = await syncService.syncPendingChanges();

            if (result.success) {
                console.log('离线变更同步成功');
                if (showNotifications) {
                    showToast('success', '离线变更已同步');
                }
            } else {
                console.error('离线变更同步失败:', result.error);
                if (showNotifications) {
                    showToast('error', `同步失败: ${result.error}`);
                }
            }
        } catch (error) {
            console.error('网络恢复同步失败:', error);
            if (showNotifications) {
                showToast('error', '同步失败，请稍后重试');
            }
        } finally {
            setIsSyncing(false);
        }
    }, [enabled, isSyncing, showNotifications, showToast]);

    // 使用网络状态 Hook，监听网络恢复
    useNetworkStatus({
        onOnline: handleNetworkRecovery,
        onOffline: () => {
            if (showNotifications) {
                showToast('warning', '网络已断开，变更将在恢复后同步');
            }
        },
    });

    // 组件挂载时检查是否有待同步变更
    useEffect(() => {
        if (!enabled) {
            return;
        }

        const checkPendingChanges = async () => {
            if (navigator.onLine) {
                const hasPending = await syncService.hasPendingChanges();
                if (hasPending) {
                    console.log('检测到待同步变更，开始同步');
                    await handleNetworkRecovery();
                }
            }
        };

        checkPendingChanges();
    }, [enabled, handleNetworkRecovery]);
};
