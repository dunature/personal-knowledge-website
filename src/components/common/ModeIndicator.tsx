/**
 * 模式指示器组件
 * 显示当前应用模式（拥有者/访客）和同步状态
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Eye } from 'lucide-react';

interface ModeIndicatorProps {
    syncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
    lastSyncTime?: string | null;
}

export const ModeIndicator: React.FC<ModeIndicatorProps> = ({
    syncStatus = 'idle',
    lastSyncTime,
}) => {
    const { mode, user } = useAuth();

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
            case 'synced':
                return lastSyncTime ? formatSyncTime(lastSyncTime) : '已同步';
            case 'error':
                return '同步失败';
            default:
                return '';
        }
    };

    const getSyncStatusColor = () => {
        switch (syncStatus) {
            case 'syncing':
                return 'text-blue-600';
            case 'synced':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            default:
                return 'text-gray-500';
        }
    };

    if (mode === 'owner') {
        return (
            <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
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
                    <span className="text-sm font-medium text-gray-900">
                        {user?.username || '拥有者'}
                    </span>
                </div>

                {/* 分隔线 */}
                <div className="w-px h-4 bg-gray-300" />

                {/* 同步状态 */}
                <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-blue-600 animate-pulse' :
                            syncStatus === 'synced' ? 'bg-green-600' :
                                syncStatus === 'error' ? 'bg-red-600' :
                                    'bg-gray-400'
                        }`} />
                    <span className={`text-xs ${getSyncStatusColor()}`}>
                        {getSyncStatusText()}
                    </span>
                </div>
            </div>
        );
    }

    // 访客模式
    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg">
            <Eye size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
                访客模式
            </span>
        </div>
    );
};
