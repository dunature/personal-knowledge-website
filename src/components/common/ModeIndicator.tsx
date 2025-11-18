/**
 * 模式指示器组件
 * 显示当前应用模式（拥有者/访客）和同步状态
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { syncService } from '@/services/syncService';
import { User, Eye } from 'lucide-react';
import type { SyncStatus } from '@/types/sync';

interface ModeIndicatorProps {
    onClick?: () => void;
    className?: string;
}

export const ModeIndicator: React.FC<ModeIndicatorProps> = ({ onClick, className = '' }) => {
    const { mode, user } = useAuth();
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

    useEffect(() => {
        // Only track sync status in owner mode
        if (mode === 'owner') {
            // Get initial status
            setSyncStatus(syncService.getSyncStatus());
            syncService.getLastSyncTime().then(setLastSyncTime);

            // Listen for status changes
            const unsubscribe = syncService.onSyncStatusChange((newStatus) => {
                setSyncStatus(newStatus);
                if (newStatus === 'success') {
                    syncService.getLastSyncTime().then(setLastSyncTime);
                }
            });

            return unsubscribe;
        } else {
            // Reset sync status when switching to guest mode
            setSyncStatus('idle');
            setLastSyncTime(null);
        }
    }, [mode]);

    const formatSyncTime = (time: string | null) => {
        if (!time) return '';
        const date = new Date(time);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return '刚刚同步';
        if (diffMins < 60) return `${diffMins}分钟前同步`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}小时前同步`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}天前同步`;
    };

    const getSyncStatusText = () => {
        switch (syncStatus) {
            case 'syncing':
                return '同步中...';
            case 'success':
                return lastSyncTime ? formatSyncTime(lastSyncTime) : '已同步';
            case 'error':
                return '同步失败';
            case 'conflict':
                return '同步冲突';
            default:
                return '';
        }
    };

    const getSyncStatusColor = () => {
        switch (syncStatus) {
            case 'syncing':
                return 'text-blue-600';
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            case 'conflict':
                return 'text-orange-600';
            default:
                return 'text-gray-500';
        }
    };

    if (mode === 'owner') {
        return (
            <button
                onClick={onClick}
                className={`flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
                title="点击切换模式"
                aria-label="切换访问模式"
            >
                {/* 用户信息 */}
                <div className="flex items-center gap-2">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-6 h-6 rounded-full"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={14} className="text-blue-600" />
                        </div>
                    )}
                    <span className="text-sm font-medium text-blue-900">
                        {user?.username || '拥有者'}
                    </span>
                </div>

                {/* 分隔线 */}
                <div className="w-px h-4 bg-gray-300" />

                {/* 同步状态 */}
                <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-blue-600 animate-pulse' :
                        syncStatus === 'success' ? 'bg-green-600' :
                            syncStatus === 'error' ? 'bg-red-600' :
                                syncStatus === 'conflict' ? 'bg-orange-600' :
                                    'bg-gray-400'
                        }`} />
                    <span className={`text-xs ${getSyncStatusColor()}`}>
                        {getSyncStatusText()}
                    </span>
                </div>
            </button>
        );
    }

    // 访客模式
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            title="点击切换模式"
            aria-label="切换访问模式"
        >
            <Eye size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
                访客模式
            </span>
        </button>
    );
};
