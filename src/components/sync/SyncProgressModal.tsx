/**
 * 同步进度模态框组件
 * 显示同步操作的实时进度
 */

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface SyncProgressModalProps {
    isOpen: boolean;
    progress: number; // 0-100
    currentOperation: string; // 当前操作描述
    processedItems: number; // 已处理项数
    totalItems: number; // 总项数
    onCancel?: () => void; // 取消同步回调
    cancellable?: boolean; // 是否可取消
}

export function SyncProgressModal({
    isOpen,
    progress,
    currentOperation,
    processedItems,
    totalItems,
    onCancel,
    cancellable = true,
}: SyncProgressModalProps) {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    // 重置取消确认状态
    useEffect(() => {
        if (!isOpen) {
            setShowCancelConfirm(false);
        }
    }, [isOpen]);

    const handleCancelClick = () => {
        if (showCancelConfirm) {
            onCancel?.();
            setShowCancelConfirm(false);
        } else {
            setShowCancelConfirm(true);
        }
    };

    const handleKeepSyncing = () => {
        setShowCancelConfirm(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { }} // 同步进行中不允许直接关闭
            title="正在同步"
            size="md"
        >
            <div className="space-y-6">
                {/* 进度条 */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{currentOperation}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* 处理项数统计 */}
                <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900">
                        {processedItems} / {totalItems}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        已处理 {processedItems} 项，共 {totalItems} 项
                    </p>
                </div>

                {/* 动画指示器 */}
                <div className="flex justify-center">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>

                {/* 取消按钮 */}
                {cancellable && onCancel && (
                    <div className="pt-4 border-t border-gray-200">
                        {!showCancelConfirm ? (
                            <button
                                onClick={handleCancelClick}
                                className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                取消同步
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-center text-gray-600">
                                    确定要取消同步吗？已同步的数据将保留。
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleKeepSyncing}
                                        className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        继续同步
                                    </button>
                                    <button
                                        onClick={handleCancelClick}
                                        className="flex-1 py-2 px-4 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        确认取消
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 提示信息 */}
                <p className="text-xs text-center text-gray-500">
                    请保持网络连接，不要关闭此页面
                </p>
            </div>
        </Modal>
    );
}
