import React from 'react';

export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonType?: 'primary' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * ConfirmDialog 确认对话框组件
 * 用于需要用户确认的操作
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = '确认',
    cancelText = '取消',
    confirmButtonType = 'primary',
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const confirmButtonClass =
        confirmButtonType === 'danger'
            ? 'bg-error hover:bg-error/80'
            : 'bg-primary hover:bg-primary-hover';

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
        >
            <div className="bg-white rounded-card shadow-modal p-xl max-w-md w-full mx-md animate-scaleIn">
                {/* 标题 */}
                <div className="flex items-start gap-md mb-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-warning"
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
                    <div className="flex-1">
                        <h2 id="confirm-dialog-title" className="text-h3 text-text mb-sm">
                            {title}
                        </h2>
                        <p id="confirm-dialog-message" className="text-body text-secondary">
                            {message}
                        </p>
                    </div>
                </div>

                {/* 按钮 */}
                <div className="flex justify-end gap-md">
                    <button
                        onClick={onCancel}
                        className="px-lg py-sm bg-white text-secondary border border-divider rounded-medium hover:bg-background-secondary transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-lg py-sm text-white rounded-medium transition-colors ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
