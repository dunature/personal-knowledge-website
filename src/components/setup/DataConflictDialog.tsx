/**
 * 数据冲突对话框组件
 * 当本地和云端都有数据时，让用户选择如何处理
 */

import React, { useState, useEffect } from 'react';
import type { GistData } from '@/types/gist';
import type { DataStats } from '@/types/sync';
import type { ConflictStrategy } from '@/services/initializationService';

interface DataConflictDialogProps {
    localData: GistData;
    remoteData: GistData;
    onResolve: (strategy: ConflictStrategy) => void;
    onCancel: () => void;
}

const DataConflictDialog: React.FC<DataConflictDialogProps> = ({
    localData,
    remoteData,
    onResolve,
    onCancel,
}) => {
    const [localStats, setLocalStats] = useState<DataStats | null>(null);
    const [remoteStats, setRemoteStats] = useState<DataStats | null>(null);
    const [selectedStrategy, setSelectedStrategy] = useState<ConflictStrategy | null>(null);

    useEffect(() => {
        // 计算本地数据统计
        setLocalStats({
            resources: localData.resources.length,
            questions: localData.questions.length,
            subQuestions: localData.subQuestions.length,
            answers: localData.answers.length,
            lastUpdated: localData.metadata.lastSync || '未知',
        });

        // 计算云端数据统计
        setRemoteStats({
            resources: remoteData.resources.length,
            questions: remoteData.questions.length,
            subQuestions: remoteData.subQuestions.length,
            answers: remoteData.answers.length,
            lastUpdated: remoteData.metadata.lastSync || '未知',
        });
    }, [localData, remoteData]);

    const handleResolve = () => {
        if (selectedStrategy) {
            onResolve(selectedStrategy);
        }
    };

    const formatDate = (dateStr: string): string => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return '刚刚';
            if (diffMins < 60) return `${diffMins} 分钟前`;
            if (diffHours < 24) return `${diffHours} 小时前`;
            if (diffDays < 7) return `${diffDays} 天前`;

            return date.toLocaleDateString('zh-CN');
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    {/* 标题 */}
                    <div className="text-center mb-6">
                        <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4">
                            <svg
                                className="w-12 h-12 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">检测到数据冲突</h2>
                        <p className="text-gray-600">
                            你的设备上已有本地数据，同时云端也有数据。请选择如何处理：
                        </p>
                    </div>

                    {/* 数据对比 */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* 本地数据 */}
                        <div
                            className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedStrategy === 'use-local'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => setSelectedStrategy('use-local')}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="w-6 h-6 text-gray-700"
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
                                    <h3 className="text-lg font-semibold text-gray-900">本地数据</h3>
                                </div>
                                {selectedStrategy === 'use-local' && (
                                    <svg
                                        className="w-6 h-6 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>

                            {localStats && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">资源</span>
                                        <span className="font-medium text-gray-900">
                                            {localStats.resources}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">问题</span>
                                        <span className="font-medium text-gray-900">
                                            {localStats.questions}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">子问题</span>
                                        <span className="font-medium text-gray-900">
                                            {localStats.subQuestions}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">回答</span>
                                        <span className="font-medium text-gray-900">
                                            {localStats.answers}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">最后更新</span>
                                            <span className="font-medium text-gray-900">
                                                {formatDate(localStats.lastUpdated)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 云端数据 */}
                        <div
                            className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedStrategy === 'use-remote'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => setSelectedStrategy('use-remote')}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="w-6 h-6 text-gray-700"
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
                                    <h3 className="text-lg font-semibold text-gray-900">云端数据</h3>
                                </div>
                                {selectedStrategy === 'use-remote' && (
                                    <svg
                                        className="w-6 h-6 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>

                            {remoteStats && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">资源</span>
                                        <span className="font-medium text-gray-900">
                                            {remoteStats.resources}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">问题</span>
                                        <span className="font-medium text-gray-900">
                                            {remoteStats.questions}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">子问题</span>
                                        <span className="font-medium text-gray-900">
                                            {remoteStats.subQuestions}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">回答</span>
                                        <span className="font-medium text-gray-900">
                                            {remoteStats.answers}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">最后更新</span>
                                            <span className="font-medium text-gray-900">
                                                {formatDate(remoteStats.lastUpdated)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 合并选项 */}
                    <div
                        className={`border-2 rounded-xl p-6 mb-8 cursor-pointer transition-all ${selectedStrategy === 'merge'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => setSelectedStrategy('merge')}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <svg
                                    className="w-6 h-6 text-gray-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                    />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        合并数据
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        保留两边的所有数据，自动去重（推荐）
                                    </p>
                                </div>
                            </div>
                            {selectedStrategy === 'merge' && (
                                <svg
                                    className="w-6 h-6 text-primary flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* 提示信息 */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">选择说明</p>
                                <ul className="space-y-1 list-disc list-inside">
                                    <li>使用本地数据：将本地数据上传到云端，覆盖云端数据</li>
                                    <li>使用云端数据：用云端数据覆盖本地数据</li>
                                    <li>合并数据：保留两边的所有数据，相同 ID 的项目会被去重</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleResolve}
                            disabled={!selectedStrategy}
                            className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            确认
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataConflictDialog;
