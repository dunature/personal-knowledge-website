/**
 * 双向同步 Hook
 * 处理应用启动时的云端更新检查和定期检查
 */

import { useEffect, useState, useCallback } from 'react';
import { syncCoordinator } from '@/services/syncCoordinator';
import type { DataComparisonResult } from '@/types/sync';

export interface UseBidirectionalSyncOptions {
    enabled?: boolean; // 是否启用双向同步
    enablePeriodicCheck?: boolean; // 是否启用定期检查
    periodicCheckInterval?: number; // 定期检查间隔（毫秒）
}

export interface UseBidirectionalSyncReturn {
    isChecking: boolean;
    comparisonData: DataComparisonResult | null;
    showComparisonDialog: boolean;
    handleSyncConfirmation: (action: 'sync' | 'skip' | 'auto') => Promise<void>;
    closeComparisonDialog: () => void;
    manualRefresh: () => Promise<void>;
}

/**
 * 使用双向同步 Hook
 * @param options - 配置选项
 */
export function useBidirectionalSync(
    options?: UseBidirectionalSyncOptions
): UseBidirectionalSyncReturn {
    const {
        enabled = true,
        enablePeriodicCheck = true,
        periodicCheckInterval = 5 * 60 * 1000, // 默认5分钟
    } = options || {};

    const [isChecking, setIsChecking] = useState(false);
    const [comparisonData, setComparisonData] = useState<DataComparisonResult | null>(null);
    const [showComparisonDialog, setShowComparisonDialog] = useState(false);

    // 处理显示对比对话框的事件
    useEffect(() => {
        if (!enabled) return;

        const handleShowComparison = (event: CustomEvent<DataComparisonResult>) => {
            console.log('[useBidirectionalSync] 显示对比对话框', event.detail);
            setComparisonData(event.detail);
            setShowComparisonDialog(true);
        };

        const handleShowNotification = (event: CustomEvent<DataComparisonResult>) => {
            console.log('[useBidirectionalSync] 显示更新通知', event.detail);
            setComparisonData(event.detail);
            setShowComparisonDialog(true);
        };

        window.addEventListener(
            'show-comparison-dialog' as any,
            handleShowComparison as EventListener
        );
        window.addEventListener(
            'show-update-notification' as any,
            handleShowNotification as EventListener
        );

        return () => {
            window.removeEventListener(
                'show-comparison-dialog' as any,
                handleShowComparison as EventListener
            );
            window.removeEventListener(
                'show-update-notification' as any,
                handleShowNotification as EventListener
            );
        };
    }, [enabled]);

    // 应用启动时检查更新
    useEffect(() => {
        if (!enabled) return;

        const checkOnStartup = async () => {
            console.log('[useBidirectionalSync] 应用启动，开始检查云端更新');
            setIsChecking(true);
            try {
                await syncCoordinator.checkOnStartup();
            } catch (error) {
                console.error('[useBidirectionalSync] 启动检查失败:', error);
            } finally {
                setIsChecking(false);
            }
        };

        // 延迟执行，避免阻塞应用加载
        const timer = setTimeout(checkOnStartup, 1000);

        return () => clearTimeout(timer);
    }, [enabled]);

    // 启动定期检查
    useEffect(() => {
        if (!enabled || !enablePeriodicCheck) return;

        console.log(
            `[useBidirectionalSync] 启动定期检查，间隔 ${periodicCheckInterval}ms`
        );
        syncCoordinator.startPeriodicCheck(periodicCheckInterval);

        return () => {
            console.log('[useBidirectionalSync] 停止定期检查');
            syncCoordinator.stopPeriodicCheck();
        };
    }, [enabled, enablePeriodicCheck, periodicCheckInterval]);

    // 处理用户同步确认
    const handleSyncConfirmation = useCallback(
        async (action: 'sync' | 'skip' | 'auto') => {
            console.log(`[useBidirectionalSync] 用户选择: ${action}`);
            setShowComparisonDialog(false);
            setComparisonData(null);

            try {
                await syncCoordinator.handleSyncConfirmation(action);
            } catch (error) {
                console.error('[useBidirectionalSync] 同步确认处理失败:', error);
            }
        },
        []
    );

    // 关闭对比对话框
    const closeComparisonDialog = useCallback(() => {
        setShowComparisonDialog(false);
        setComparisonData(null);
    }, []);

    // 手动刷新
    const manualRefresh = useCallback(async () => {
        console.log('[useBidirectionalSync] 手动刷新');
        setIsChecking(true);
        try {
            await syncCoordinator.manualRefresh();
        } catch (error) {
            console.error('[useBidirectionalSync] 手动刷新失败:', error);
        } finally {
            setIsChecking(false);
        }
    }, []);

    return {
        isChecking,
        comparisonData,
        showComparisonDialog,
        handleSyncConfirmation,
        closeComparisonDialog,
        manualRefresh,
    };
}
