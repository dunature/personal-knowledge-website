/**
 * Modal组件
 * 支持全屏弹窗和普通弹窗
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { iconButtonStyles } from '@/styles/buttonStyles';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    fullScreen?: boolean;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    fullScreen = false,
    showCloseButton = true,
    closeOnOverlayClick = true,
    className = '',
}) => {
    // 阻止背景滚动
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // ESC键关闭
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 遮罩层 - 淡入动画 */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
                onClick={handleOverlayClick}
            />

            {/* 弹窗内容 - 缩放动画 */}
            <div
                className={`relative bg-white overflow-hidden animate-scaleIn ${fullScreen
                        ? 'w-full h-full rounded-none'
                        : 'rounded-lg shadow-strong max-w-2xl w-full mx-4 max-h-[90vh]'
                    } ${className}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {/* 标题栏 - 仅在非全屏模式显示 */}
                {!fullScreen && (title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        {title && (
                            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className={iconButtonStyles}
                                aria-label="关闭弹窗"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* 内容区 */}
                <div className={`${fullScreen ? 'h-full' : 'max-h-[calc(90vh-80px)] overflow-auto p-6'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};
