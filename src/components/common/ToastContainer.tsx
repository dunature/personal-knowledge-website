import React from 'react';
import Toast from './Toast';
import type { ToastProps } from './Toast';

interface ToastContainerProps {
    toasts: ToastProps[];
    onClose: (id: string) => void;
}

/**
 * ToastContainer 组件
 * 管理和显示多个Toast通知
 */
const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    return (
        <div
            className="fixed top-4 right-4 z-50 flex flex-col gap-md"
            aria-live="polite"
            aria-atomic="true"
        >
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={onClose} />
            ))}
        </div>
    );
};

export default ToastContainer;
