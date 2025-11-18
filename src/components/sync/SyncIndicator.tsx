/**
 * 同步状态指示器组件
 * 显示同步状态、最后同步时间和手动同步按钮
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, AlertCircle, Cloud } from 'lucide-react';
import { syncService } from '@/services/syncService';
import { syncCoordinator } from '@/services/syncCoordinator';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/common/Toast';
import type { SyncStatus } from '@/types/sync';

interface SyncIndicatorProps {
    showButton?: boolean;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
    showButton = true,
}) => {
    const [status, setStatus] = useState<SyncStatus>('idle');
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [lastClickTime, setLastClickTime] = useState(0);
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const { toasts, showSuccess, showError, showWarning } = useToast();

    useEffect(() => {
        // 获取初始状态
        setStatus(syncService.getSyncStatus());
        syncService.getLastSyncTime().then(setLastSyncTime);

        // 检查待同步变更
        const checkPending = async () => {
            const hasPending = await syncService.hasPendingChanges();
            const count = await syncService.getPendingChangesCount();
            setHasPendingChanges(hasPending);
            setPendingCount(count);
        };
        checkPending();

        // 监听状态变化
        const unsubscribe = syncService.onSyncStatusChange((newStatus) => {
            setStatus(newStatus);
            if (newStatus === 'success') {
                syncService.getLastSyncTime().then(setLastSyncTime);
                // 同步成功后重新检查待同步变更
                checkPending();
            }
        });

        // 定期检查待同步变更（每5秒）
        const intervalId = setInterval(checkPending, 5000);

        // 监听网络状态变化
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            unsubscribe();
            clearInterval(intervalId);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSync = async () => {
        // 防抖：避免短时间内重复点击（1秒内）
        const now = Date.now();
        if (now - lastClickTime < 1000) {
            return;
        }
        setLastClickTime(now);

        // 检查是否正在同步
        if (isSyncing) return;

        // 检查网络状态
        if (!isOnline) {
            showWarning('当前处于离线状态，无法同步');
            return;
        }

        setIsSyncing(true);
        try {
            // 使用 syncCoordinator 的 manualRefresh 来检查云端更新
            const checkResult = await syncCoordinator.manualRefresh();

            if (checkResult.hasUpdates) {
                // 有更新，对话框会自动显示
                showSuccess('检测到云端有更新');
            } else if (checkResult.error) {
                // 检查失败
                showError(checkResult.error);
            } else {
                // 没有更新，执行普通同步（Push本地变更）
                const result = await syncService.smartSync();

                if (result.skipped) {
                    // 跳过同步
                    if (result.skipReason === 'already_synced') {
                        showSuccess('数据已是最新，无需同步');
                    } else if (result.skipReason === 'offline') {
                        showWarning('当前处于离线状态，无法同步');
                    }
                } else if (result.success) {
                    // 同步成功
                    showSuccess('同步成功');
                } else {
                    // 同步失败
                    showError(result.error || '同步失败');
                }
            }
        } catch (error) {
            showError('同步异常，请稍后重试');
        } finally {
            setIsSyncing(false);
        }
    };
    const formatSyncTime = (time: string | null) => {
        if (!time) return '从未同步';

        const date = new Date(time);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return '刚刚';
        if (diffMins < 60) return `${diffMins}分钟前`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}小时前`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}天前`;
    };

    const getStatusConfig = () => {
        // 如果有待同步变更，优先显示"需要同步"状态
        if (hasPendingChanges && status !== 'syncing') {
            return {
                icon: AlertCircle,
                text: '需要同步',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200',
                iconClass: '',
                subtitle: `${pendingCount} 个待同步变更`,
            };
        }

        switch (status) {
            case 'syncing':
                return {
                    icon: RefreshCw,
                    text: '同步中...',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconClass: 'animate-spin',
                };
            case 'success':
                return {
                    icon: Check,
                    text: '已同步',
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconClass: '',
                };
            case 'error':
                return {
                    icon: AlertCircle,
                    text: '同步失败',
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    iconClass: '',
                };
            case 'conflict':
                return {
                    icon: AlertCircle,
                    text: '同步冲突',
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    iconClass: '',
                };
            default: // idle
                return {
                    icon: Cloud,
                    text: '未同步',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    iconClass: '',
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;
    const timeText = formatSyncTime(lastSyncTime);

    return (
        <>
            {/* Toast 容器 */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>

            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
                {/* 状态图标和文本 */}
                <div className="flex items-center gap-2">
                    <Icon size={16} className={`${config.color} ${config.iconClass}`} />
                    <div className="flex flex-col">
                        <span className={`text-sm font-medium ${config.color}`}>
                            {config.text}
                        </span>
                        {config.subtitle ? (
                            <span className="text-xs text-gray-500">
                                {config.subtitle}
                            </span>
                        ) : lastSyncTime ? (
                            <span className="text-xs text-gray-500">
                                {timeText}
                            </span>
                        ) : null}
                    </div>
                </div>

                {/* 手动同步按钮 */}
                {showButton && (
                    <button
                        onClick={handleSync}
                        disabled={status === 'syncing' || isSyncing || !isOnline}
                        className="ml-2 p-1.5 rounded hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="手动同步"
                        title={!isOnline ? '离线状态' : hasPendingChanges ? `同步 ${pendingCount} 个变更` : '立即同步'}
                    >
                        <RefreshCw size={14} className={`text-gray-600 ${isSyncing ? 'animate-spin' : ''}`} />
                    </button>
                )}
            </div>
        </>
    );
};
