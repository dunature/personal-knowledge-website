/**
 * Gist 数据冲突对话框
 * 当本地已有数据时，让用户选择使用远程数据还是保留本地数据
 */

import React from 'react';
import { AlertTriangle, Database, Cloud, X } from 'lucide-react';
import type { DataStats } from '@/hooks/useGistUrlLoader';

interface GistDataConflictDialogProps {
    isOpen: boolean;
    localDataStats: DataStats | null;
    remoteDataStats: DataStats | null;
    onUseRemote: () => void;
    onKeepLocal: () => void;
    onCancel: () => void;
}

export const GistDataConflictDialog: React.FC<GistDataConflictDialogProps> = ({
    isOpen,
    localDataStats,
    remoteDataStats,
    onUseRemote,
    onKeepLocal,
    onCancel,
}) => {
    if (!isOpen || !localDataStats || !remoteDataStats) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* 关闭按钮 */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="关闭"
                >
                    <X size={24} />
                </button>

                {/* 标题 */}
                <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
                        <AlertTriangle className="w-12 h-12 text-yellow-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        检测到数据冲突
                    </h3>
                    <p className="text-gray-600">
                        您的浏览器中已有本地数据，请选择要使用的数据
                    </p>
                </div>

                {/* 数据对比 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* 本地数据 */}
                    <div className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Database className="w-5 h-5 text-gray-600" />
                            <h4 className="font-semibold text-gray-900">本地数据</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">资源:</span>
                                <span className="font-medium">{localDataStats.resources} 个</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">大问题:</span>
                                <span className="font-medium">{localDataStats.questions} 个</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">小问题:</span>
                                <span className="font-medium">{localDataStats.subQuestions} 个</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">回答:</span>
                                <span className="font-medium">{localDataStats.answers} 个</span>
                            </div>
                        </div>
                    </div>

                    {/* 远程数据 */}
                    <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                        <div className="flex items-center gap-2 mb-3">
                            <Cloud className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold text-gray-900">分享的数据</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">资源:</span>
                                <span className="font-medium">{remoteDataStats.resources} 个</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">大问题:</span>
                                <span className="font-medium">{remoteDataStats.questions} 个</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">小问题:</span>
                                <span className="font-medium">{remoteDataStats.subQuestions} 个</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">回答:</span>
                                <span className="font-medium">{remoteDataStats.answers} 个</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 警告提示 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                        <strong>注意：</strong>选择"使用分享的数据"将会覆盖您当前的本地数据。
                        如果您想保留本地数据，请选择"保留本地数据"。
                    </p>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onUseRemote}
                        className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                        使用分享的数据
                    </button>
                    <button
                        onClick={onKeepLocal}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        保留本地数据
                    </button>
                </div>

                <button
                    onClick={onCancel}
                    className="w-full mt-3 text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors"
                >
                    取消
                </button>
            </div>
        </div>
    );
};
