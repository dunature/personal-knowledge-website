/**
 * 同步结果模态框
 * 显示明显的成功或失败反馈
 */

import { useEffect } from 'react';

interface SyncResultModalProps {
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export function SyncResultModal({
    isOpen,
    type,
    title,
    message,
    onClose,
    autoClose = true,
    autoCloseDelay = 3000,
}: SyncResultModalProps) {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scaleIn">
                {/* 图标 */}
                <div className="flex justify-center mb-6">
                    {type === 'success' ? (
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                            <svg
                                className="w-16 h-16 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-shake">
                            <svg
                                className="w-16 h-16 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* 标题 */}
                <h2
                    className={`text-3xl font-bold text-center mb-4 ${type === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}
                >
                    {title}
                </h2>

                {/* 消息 */}
                <p className="text-gray-700 text-center text-lg mb-6 leading-relaxed">
                    {message}
                </p>

                {/* 关闭按钮 */}
                <button
                    onClick={onClose}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${type === 'success'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                >
                    确定
                </button>

                {/* 自动关闭提示 */}
                {autoClose && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                        {Math.ceil(autoCloseDelay / 1000)} 秒后自动关闭
                    </p>
                )}
            </div>
        </div>
    );
}
