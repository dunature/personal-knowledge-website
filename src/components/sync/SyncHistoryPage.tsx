/**
 * 同步历史页面组件
 * 显示最近的同步记录
 */

import { useState, useEffect } from 'react';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import type { SyncHistory, SyncHistoryEntry } from '@/types/sync';

type FilterType = 'all' | 'success' | 'error';

export function SyncHistoryPage() {
    const [history, setHistory] = useState<SyncHistoryEntry[]>([]);
    const [filter, setFilter] = useState<FilterType>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // 加载同步历史
    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const syncHistory = await cacheService.getData<SyncHistory>(STORAGE_KEYS.SYNC_HISTORY);
            setHistory(syncHistory?.entries || []);
        } catch (error) {
            console.error('加载同步历史失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (confirm('确定要清除所有同步历史记录吗？此操作不可恢复。')) {
            try {
                await cacheService.clearData(STORAGE_KEYS.SYNC_HISTORY);
                setHistory([]);
            } catch (error) {
                console.error('清除历史失败:', error);
            }
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // 过滤历史记录
    const filteredHistory = history.filter((entry) => {
        if (filter === 'all') return true;
        if (filter === 'success') return entry.success;
        if (filter === 'error') return !entry.success;
        return true;
    });

    // 格式化时间
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes} 分钟前`;
        if (hours < 24) return `${hours} 小时前`;
        if (days < 7) return `${days} 天前`;
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // 获取同步类型标签
    const getSyncTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            pull: '从云端拉取',
            push: '推送到云端',
            bidirectional: '双向同步',
            manual: '手动同步',
            auto: '自动同步',
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 页面标题 */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">同步历史</h1>
                <p className="mt-1 text-sm text-gray-500">
                    查看最近 50 条同步记录
                </p>
            </div>

            {/* 筛选和操作栏 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        全部 ({history.length})
                    </button>
                    <button
                        onClick={() => setFilter('success')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'success'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        成功 ({history.filter((e) => e.success).length})
                    </button>
                    <button
                        onClick={() => setFilter('error')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        失败 ({history.filter((e) => !e.success).length})
                    </button>
                </div>

                {history.length > 0 && (
                    <button
                        onClick={handleClearHistory}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        清除历史
                    </button>
                )}
            </div>

            {/* 历史记录列表 */}
            {filteredHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="mt-4 text-sm text-gray-500">
                        {filter === 'all' ? '暂无同步记录' : `暂无${filter === 'success' ? '成功' : '失败'}的同步记录`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredHistory.map((entry) => (
                        <div
                            key={entry.id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => toggleExpand(entry.id)}
                                className="w-full p-4 text-left"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            {/* 状态图标 */}
                                            {entry.success ? (
                                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* 同步信息 */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {getSyncTypeLabel(entry.type)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(entry.timestamp)}
                                                    </span>
                                                </div>
                                                {entry.changes && (
                                                    <p className="mt-1 text-xs text-gray-600">
                                                        {entry.changes.added > 0 && `新增 ${entry.changes.added} 项 `}
                                                        {entry.changes.updated > 0 && `更新 ${entry.changes.updated} 项 `}
                                                        {entry.changes.deleted > 0 && `删除 ${entry.changes.deleted} 项`}
                                                    </p>
                                                )}
                                                {entry.error && (
                                                    <p className="mt-1 text-xs text-red-600 truncate">
                                                        {entry.error}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 展开图标 */}
                                    <svg
                                        className={`flex-shrink-0 w-5 h-5 text-gray-400 transition-transform ${expandedId === entry.id ? 'transform rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {/* 展开的详情 */}
                            {expandedId === entry.id && (
                                <div className="px-4 pb-4 border-t border-gray-100">
                                    <dl className="mt-3 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">同步时间</dt>
                                            <dd className="text-gray-900 font-mono text-xs">
                                                {new Date(entry.timestamp).toLocaleString('zh-CN')}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">同步类型</dt>
                                            <dd className="text-gray-900">{getSyncTypeLabel(entry.type)}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">状态</dt>
                                            <dd className={entry.success ? 'text-green-600' : 'text-red-600'}>
                                                {entry.success ? '成功' : '失败'}
                                            </dd>
                                        </div>
                                        {entry.changes && (
                                            <>
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500">新增</dt>
                                                    <dd className="text-gray-900">{entry.changes.added} 项</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500">更新</dt>
                                                    <dd className="text-gray-900">{entry.changes.updated} 项</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500">删除</dt>
                                                    <dd className="text-gray-900">{entry.changes.deleted} 项</dd>
                                                </div>
                                            </>
                                        )}
                                        {entry.error && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <dt className="text-gray-500 mb-1">错误信息</dt>
                                                <dd className="text-red-600 text-xs break-words">{entry.error}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
