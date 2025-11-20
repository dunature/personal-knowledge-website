/**
 * 冲突解决对话框组件
 * 当本地和云端都有更新时，让用户选择如何处理冲突
 */

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export type ConflictResolutionStrategy = 'cloud' | 'local' | 'merge';

interface ConflictItem {
    type: 'resource' | 'question' | 'subQuestion' | 'answer';
    id: string;
    title: string;
    localVersion?: string;
    cloudVersion?: string;
}

interface ConflictResolutionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onResolve: (strategy: ConflictResolutionStrategy) => void;
    conflictItems?: ConflictItem[]; // 可选的冲突项列表
    localChangesCount: number; // 本地未同步变更数量
    cloudChangesCount: number; // 云端新变更数量
}

export function ConflictResolutionDialog({
    isOpen,
    onClose,
    onResolve,
    conflictItems = [],
    localChangesCount,
    cloudChangesCount,
}: ConflictResolutionDialogProps) {
    const [selectedStrategy, setSelectedStrategy] = useState<ConflictResolutionStrategy | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const strategies = [
        {
            value: 'cloud' as const,
            title: '使用云端数据',
            description: '下载云端最新数据，丢弃本地未同步的变更',
            icon: '☁️',
            impact: `将丢失 ${localChangesCount} 个本地变更`,
            recommended: localChangesCount === 0,
        },
        {
            value: 'local' as const,
            title: '保留本地变更',
            description: '先上传本地变更到云端，然后再下载云端数据',
            icon: '💾',
            impact: `将上传 ${localChangesCount} 个本地变更，然后同步云端数据`,
            recommended: false,
        },
        {
            value: 'merge' as const,
            title: '智能合并',
            description: '自动合并本地和云端的变更，保留所有数据',
            icon: '🔀',
            impact: '系统将智能合并两边的变更，可能需要手动处理部分冲突',
            recommended: localChangesCount > 0 && cloudChangesCount > 0,
        },
    ];

    const handleConfirm = () => {
        if (selectedStrategy) {
            onResolve(selectedStrategy);
            setSelectedStrategy(null);
            setShowDetails(false);
        }
    };

    const handleCancel = () => {
        setSelectedStrategy(null);
        setShowDetails(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title="检测到数据冲突"
            className="max-w-4xl"
        >
            <div className="space-y-6">
                {/* 冲突说明 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                云端和本地都有更新
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    云端有 <span className="font-semibold">{cloudChangesCount}</span> 个新变更，
                                    本地有 <span className="font-semibold">{localChangesCount}</span> 个未同步的变更。
                                </p>
                                <p className="mt-1">
                                    请选择如何处理这些冲突：
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 策略选项 */}
                <div className="space-y-3">
                    {strategies.map((strategy) => (
                        <button
                            key={strategy.value}
                            onClick={() => setSelectedStrategy(strategy.value)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedStrategy === strategy.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                } ${strategy.recommended ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
                        >
                            <div className="flex items-start">
                                <span className="text-2xl mr-3">{strategy.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-base font-semibold text-gray-900">
                                            {strategy.title}
                                        </h4>
                                        {strategy.recommended && (
                                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                                                推荐
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {strategy.description}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500">
                                        <span className="font-medium">影响：</span> {strategy.impact}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* 冲突项详情（可选） */}
                {conflictItems.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            <span>查看冲突项详情 ({conflictItems.length} 项)</span>
                            <svg
                                className={`w-5 h-5 transition-transform ${showDetails ? 'transform rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showDetails && (
                            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                                {conflictItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3 bg-gray-50 rounded-lg text-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">{item.title}</span>
                                            <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                                        </div>
                                        {(item.localVersion || item.cloudVersion) && (
                                            <div className="mt-2 text-xs text-gray-600 space-y-1">
                                                {item.localVersion && (
                                                    <div>本地版本: {item.localVersion}</div>
                                                )}
                                                {item.cloudVersion && (
                                                    <div>云端版本: {item.cloudVersion}</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleCancel}
                        className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedStrategy}
                        className={`flex-1 py-2 px-4 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${selectedStrategy
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        确认并继续
                    </button>
                </div>
            </div>
        </Modal>
    );
}
