/**
 * 当前 Gist 信息显示组件
 * 显示已连接的 Gist 的基本信息和元数据
 * 使用 React.memo 优化性能
 */

import React, { useState } from 'react';

interface GistInfo {
    id: string;
    description: string;
    created_at: string;
    updated_at: string;
    public: boolean;
    owner: {
        login: string;
        avatar_url: string;
    };
}

interface CurrentGistInfoProps {
    gistId: string | null;
    gistInfo: GistInfo | null;
    mode: 'visitor' | 'owner';
    onRefresh: () => void;
}

const CurrentGistInfo: React.FC<CurrentGistInfoProps> = ({
    gistId,
    gistInfo,
    mode,
    onRefresh,
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setIsRefreshing(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!gistId) {
        return (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 text-center">未连接到 Gist</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            已连接到 Gist
                        </h3>

                        {/* Gist ID */}
                        <div className="mb-3">
                            <p className="text-xs text-blue-700 mb-1">Gist ID</p>
                            <div className="flex items-center">
                                <code className="text-sm font-mono text-blue-900 bg-blue-100 px-2 py-1 rounded">
                                    {gistId}
                                </code>
                                <a
                                    href={`https://gist.github.com/${gistId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                    title="在 GitHub 查看"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Gist 元数据（如果有） */}
                        {gistInfo && (
                            <>
                                {/* 描述 */}
                                {gistInfo.description && (
                                    <div className="mb-3">
                                        <p className="text-xs text-blue-700 mb-1">描述</p>
                                        <p className="text-sm text-blue-900">
                                            {gistInfo.description}
                                        </p>
                                    </div>
                                )}

                                {/* 所有者 */}
                                {gistInfo.owner && (
                                    <div className="mb-3">
                                        <p className="text-xs text-blue-700 mb-1">所有者</p>
                                        <div className="flex items-center">
                                            {gistInfo.owner.avatar_url && (
                                                <img
                                                    src={gistInfo.owner.avatar_url}
                                                    alt={gistInfo.owner.login}
                                                    className="w-6 h-6 rounded-full mr-2"
                                                />
                                            )}
                                            <span className="text-sm text-blue-900">
                                                {gistInfo.owner.login}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* 更新时间 */}
                                {gistInfo.updated_at && (
                                    <div className="mb-3">
                                        <p className="text-xs text-blue-700 mb-1">最后更新</p>
                                        <p className="text-sm text-blue-900">
                                            {formatDate(gistInfo.updated_at)}
                                        </p>
                                    </div>
                                )}

                                {/* 可见性 */}
                                <div>
                                    <p className="text-xs text-blue-700 mb-1">可见性</p>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${gistInfo.public
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {gistInfo.public ? '公开' : '私有'}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 刷新按钮 */}
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="ml-4 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                        title="刷新信息"
                    >
                        <svg
                            className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 模式指示 */}
            <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                    />
                </svg>
                <span>
                    当前模式：
                    <span className="font-medium ml-1">
                        {mode === 'owner' ? '拥有者模式' : '访客模式'}
                    </span>
                </span>
            </div>
        </div>
    );
};

// 使用 React.memo 优化性能
export default React.memo(CurrentGistInfo);
