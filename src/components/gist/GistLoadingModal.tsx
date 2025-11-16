/**
 * Gist 加载状态 Modal
 * 显示 Gist 数据加载进度、成功和错误状态
 */

import React from 'react';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface GistLoadingModalProps {
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
    gistId: string | null;
    onRetry: () => void;
    onClose: () => void;
}

export const GistLoadingModal: React.FC<GistLoadingModalProps> = ({
    isOpen,
    isLoading,
    error,
    gistId,
    onRetry,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                {/* 加载中状态 */}
                {isLoading && (
                    <div className="text-center">
                        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            正在加载数据
                        </h3>
                        <p className="text-gray-600 mb-4">
                            正在从 GitHub Gist 加载知识库数据...
                        </p>
                        {gistId && (
                            <p className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-2 rounded">
                                Gist ID: {gistId}
                            </p>
                        )}
                    </div>
                )}

                {/* 错误状态 */}
                {error && !isLoading && (
                    <div className="text-center">
                        <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            加载失败
                        </h3>
                        <p className="text-gray-700 mb-6 whitespace-pre-line">
                            {error}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onRetry}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                            >
                                <RefreshCw size={18} />
                                重试
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                )}

                {/* 成功状态（通常会自动关闭，但保留以防万一） */}
                {!isLoading && !error && (
                    <div className="text-center">
                        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            加载成功
                        </h3>
                        <p className="text-gray-600 mb-4">
                            数据已成功加载，正在刷新页面...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
