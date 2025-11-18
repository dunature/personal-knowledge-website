/**
 * 数据对比展示组件
 * 在设置页面显示本地和云端的数据统计对比
 */

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { syncService } from '@/services/syncService';
import { dataComparator } from '@/services/dataComparator';
import { authService } from '@/services/authService';
import { gistService } from '@/services/gistService';
import type { DataStatistics } from '@/types/sync';

export function DataComparisonView() {
    const [localStats, setLocalStats] = useState<DataStatistics | null>(null);
    const [remoteStats, setRemoteStats] = useState<DataStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 加载数据统计
    const loadStats = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 获取本地数据统计
            const localData = await syncService['getLocalData']();
            const local = dataComparator.generateStatistics(localData);
            setLocalStats(local);

            // 获取最后同步时间
            const lastSync = await syncService.getLastSyncTime();
            setLastSyncTime(lastSync);

            // 如果配置了Gist ID,获取云端数据统计
            const gistId = authService.getGistId();
            if (gistId) {
                const token = await authService.getToken();
                const remoteData = await gistService.getGist(gistId, token || undefined);
                const remote = dataComparator.generateStatistics(remoteData);
                setRemoteStats(remote);
            } else {
                setRemoteStats(null);
            }
        } catch (err) {
            console.error('加载数据统计失败:', err);
            setError(err instanceof Error ? err.message : '加载失败');
        } finally {
            setIsLoading(false);
        }
    };

    // 初始加载
    useEffect(() => {
        loadStats();

        // 监听同步完成事件,自动刷新
        const handleSyncCompleted = () => {
            console.log('[DataComparisonView] 同步完成,刷新数据统计');
            loadStats();
        };

        window.addEventListener('sync-completed', handleSyncCompleted as EventListener);

        return () => {
            window.removeEventListener('sync-completed', handleSyncCompleted as EventListener);
        };
    }, []);

    // 格式化时间
    const formatTime = (timestamp: string | null) => {
        if (!timestamp) return '从未同步';

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return '刚刚';
        if (diffMins < 60) return `${diffMins} 分钟前`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} 小时前`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} 天前`;
    };

    // 计算差异
    const getDifference = (local: number, remote: number) => {
        const diff = remote - local;
        if (diff === 0) return { text: '一致', color: 'text-gray-600' };
        if (diff > 0) return { text: `+${diff}`, color: 'text-green-600' };
        return { text: `${diff}`, color: 'text-red-600' };
    };

    if (isLoading && !localStats) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">加载中...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={loadStats}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        重试
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* 标题栏 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">数据统计</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        本地和云端的数据对比
                    </p>
                </div>
                <button
                    onClick={loadStats}
                    disabled={isLoading}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    title="刷新数据"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* 数据对比 */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 本地数据 */}
                    <div>
                        <div className="flex items-center mb-4">
                            <svg
                                className="w-5 h-5 mr-2 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h4 className="text-sm font-medium text-gray-700">本地数据</h4>
                        </div>
                        {localStats && (
                            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                <DataRow label="资源" value={localStats.resourceCount} />
                                <DataRow label="问题" value={localStats.questionCount} />
                                <DataRow label="子问题" value={localStats.subQuestionCount} />
                                <DataRow label="答案" value={localStats.answerCount} />
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-3">
                            最后同步: {formatTime(lastSyncTime)}
                        </p>
                    </div>

                    {/* 云端数据 */}
                    <div>
                        <div className="flex items-center mb-4">
                            <svg
                                className="w-5 h-5 mr-2 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                                />
                            </svg>
                            <h4 className="text-sm font-medium text-gray-700">云端数据</h4>
                        </div>
                        {remoteStats ? (
                            <>
                                <div className="space-y-3 bg-blue-50 rounded-lg p-4">
                                    <DataRow
                                        label="资源"
                                        value={remoteStats.resourceCount}
                                        diff={
                                            localStats
                                                ? getDifference(
                                                    localStats.resourceCount,
                                                    remoteStats.resourceCount
                                                )
                                                : undefined
                                        }
                                    />
                                    <DataRow
                                        label="问题"
                                        value={remoteStats.questionCount}
                                        diff={
                                            localStats
                                                ? getDifference(
                                                    localStats.questionCount,
                                                    remoteStats.questionCount
                                                )
                                                : undefined
                                        }
                                    />
                                    <DataRow
                                        label="子问题"
                                        value={remoteStats.subQuestionCount}
                                        diff={
                                            localStats
                                                ? getDifference(
                                                    localStats.subQuestionCount,
                                                    remoteStats.subQuestionCount
                                                )
                                                : undefined
                                        }
                                    />
                                    <DataRow
                                        label="答案"
                                        value={remoteStats.answerCount}
                                        diff={
                                            localStats
                                                ? getDifference(
                                                    localStats.answerCount,
                                                    remoteStats.answerCount
                                                )
                                                : undefined
                                        }
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    最后修改: {formatTime(remoteStats.lastModified)}
                                </p>
                            </>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                                未配置 Gist ID
                            </div>
                        )}
                    </div>
                </div>

                {/* 差异摘要 */}
                {localStats && remoteStats && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h5 className="text-sm font-medium text-yellow-800 mb-2">数据差异</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {[
                                {
                                    label: '资源',
                                    diff: remoteStats.resourceCount - localStats.resourceCount,
                                },
                                {
                                    label: '问题',
                                    diff: remoteStats.questionCount - localStats.questionCount,
                                },
                                {
                                    label: '子问题',
                                    diff:
                                        remoteStats.subQuestionCount -
                                        localStats.subQuestionCount,
                                },
                                {
                                    label: '答案',
                                    diff: remoteStats.answerCount - localStats.answerCount,
                                },
                            ].map(({ label, diff }) => (
                                <div key={label} className="flex justify-between">
                                    <span className="text-gray-700">{label}:</span>
                                    <span
                                        className={
                                            diff === 0
                                                ? 'text-gray-600'
                                                : diff > 0
                                                    ? 'text-green-600 font-medium'
                                                    : 'text-red-600 font-medium'
                                        }
                                    >
                                        {diff === 0 ? '一致' : diff > 0 ? `+${diff}` : diff}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// 数据行组件
function DataRow({
    label,
    value,
    diff,
}: {
    label: string;
    value: number;
    diff?: { text: string; color: string };
}) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{label}:</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{value}</span>
                {diff && diff.text !== '一致' && (
                    <span className={`text-xs font-medium ${diff.color}`}>({diff.text})</span>
                )}
            </div>
        </div>
    );
}
