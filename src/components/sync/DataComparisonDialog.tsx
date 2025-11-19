/**
 * 数据对比对话框
 * 显示本地和云端的数据统计对比，让用户决定是否同步
 */

import { useState } from 'react';
import type { DataComparisonResult } from '@/types/sync';

interface DataComparisonDialogProps {
    open: boolean;
    comparison: DataComparisonResult;
    onConfirm: (action: 'sync' | 'skip' | 'auto') => void;
    onClose: () => void;
}

export function DataComparisonDialog({
    open,
    comparison,
    onConfirm,
}: DataComparisonDialogProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    if (!open) return null;

    const handleSync = () => {
        onConfirm(dontShowAgain ? 'auto' : 'sync');
    };

    const handleSkip = () => {
        onConfirm('skip');
    };

    const formatTime = (timestamp: string) => {
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

    const getDifferenceColor = (diff: number) => {
        if (diff > 0) return 'text-green-600';
        if (diff < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getDifferenceText = (diff: number) => {
        if (diff > 0) return `+${diff}`;
        if (diff < 0) return `${diff}`;
        return '无变化';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* 标题 */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        检测到云端有更新
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        云端数据与本地数据存在差异，请查看对比并决定是否同步
                    </p>
                </div>

                {/* 数据对比 */}
                <div className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-6">
                        {/* 本地数据 */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center">
                                <svg
                                    className="w-4 h-4 mr-2"
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
                                本地数据
                            </h3>
                            <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                                <DataItem
                                    label="资源"
                                    value={comparison.local.resourceCount}
                                />
                                <DataItem
                                    label="问题"
                                    value={comparison.local.questionCount}
                                />
                                <DataItem
                                    label="子问题"
                                    value={comparison.local.subQuestionCount}
                                />
                                <DataItem
                                    label="答案"
                                    value={comparison.local.answerCount}
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                最后同步: {formatTime(comparison.local.lastModified)}
                            </p>
                        </div>

                        {/* 云端数据 */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center">
                                <svg
                                    className="w-4 h-4 mr-2"
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
                                云端数据
                            </h3>
                            <div className="space-y-2 bg-blue-50 rounded-lg p-4">
                                <DataItem
                                    label="资源"
                                    value={comparison.remote.resourceCount}
                                    diff={comparison.differences.resources}
                                />
                                <DataItem
                                    label="问题"
                                    value={comparison.remote.questionCount}
                                    diff={comparison.differences.questions}
                                />
                                <DataItem
                                    label="子问题"
                                    value={comparison.remote.subQuestionCount}
                                    diff={comparison.differences.subQuestions}
                                />
                                <DataItem
                                    label="答案"
                                    value={comparison.remote.answerCount}
                                    diff={comparison.differences.answers}
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                最后修改: {formatTime(comparison.remote.lastModified)}
                            </p>
                        </div>
                    </div>

                    {/* 差异摘要 */}
                    {comparison.hasChanges && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="text-sm font-medium text-yellow-800 mb-2">
                                数据差异
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {comparison.differences.resources !== 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">资源:</span>
                                        <span
                                            className={getDifferenceColor(
                                                comparison.differences.resources
                                            )}
                                        >
                                            {getDifferenceText(comparison.differences.resources)}
                                        </span>
                                    </div>
                                )}
                                {comparison.differences.questions !== 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">问题:</span>
                                        <span
                                            className={getDifferenceColor(
                                                comparison.differences.questions
                                            )}
                                        >
                                            {getDifferenceText(comparison.differences.questions)}
                                        </span>
                                    </div>
                                )}
                                {comparison.differences.subQuestions !== 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">子问题:</span>
                                        <span
                                            className={getDifferenceColor(
                                                comparison.differences.subQuestions
                                            )}
                                        >
                                            {getDifferenceText(comparison.differences.subQuestions)}
                                        </span>
                                    </div>
                                )}
                                {comparison.differences.answers !== 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">答案:</span>
                                        <span
                                            className={getDifferenceColor(
                                                comparison.differences.answers
                                            )}
                                        >
                                            {getDifferenceText(comparison.differences.answers)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 建议 */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>建议操作:</strong>{' '}
                            {comparison.recommendation === 'pull' && '从云端拉取最新数据'}
                            {comparison.recommendation === 'push' && '推送本地数据到云端'}
                            {comparison.recommendation === 'merge' && '智能合并本地和云端数据'}
                            {comparison.recommendation === 'skip' && '跳过同步'}
                        </p>
                    </div>
                </div>

                {/* 底部操作 */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            不再提示，自动同步
                        </label>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSkip}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                稍后
                            </button>
                            <button
                                onClick={handleSync}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                立即同步
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 数据项组件
function DataItem({
    label,
    value,
    diff,
}: {
    label: string;
    value: number;
    diff?: number;
}) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{label}:</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{value}</span>
                {diff !== undefined && diff !== 0 && (
                    <span
                        className={`text-xs font-medium ${diff > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        ({diff > 0 ? '+' : ''}
                        {diff})
                    </span>
                )}
            </div>
        </div>
    );
}
