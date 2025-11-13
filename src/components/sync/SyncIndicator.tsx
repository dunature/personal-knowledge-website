/**
 * 同步状态指示器组件
 * 显示同步状态、最后同步时间和手动同步按钮
 */

import React from 'react';
import { RefreshCw, Check, AlertCircle, Cloud } from 'lucide-react';
import type { SyncStatus } from '@/types/sync';

interface SyncIndicatorProps {
    status: SyncStatus;
    lastSyncTime: string | null;
    onSync?: () => void;
    showButton?: boolean;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
    status,
    lastSyncTime,
    onSync,
    showButton = true,
}) => {
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
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
            {/* 状态图标和文本 */}
            <div className="flex items-center gap-2">
                <Icon size={16} className={`${config.color} ${config.iconClass}`} />
                <div className="flex flex-col">
                    <span className={`text-sm font-medium ${config.color}`}>
                        {config.text}
                    </span>
                    {lastSyncTime && (
                        <span className="text-xs text-gray-500">
                            {timeText}
                        </span>
                    )}
                </div>
            </div>

            {/* 手动同步按钮 */}
            {showButton && onSync && (
                <button
                    onClick={onSync}
                    disabled={status === 'syncing'}
                    className="ml-2 p-1.5 rounded hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="手动同步"
                    title="立即同步"
                >
                    <RefreshCw size={14} className="text-gray-600" />
                </button>
            )}
        </div>
    );
};
