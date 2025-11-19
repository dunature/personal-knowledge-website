/**
 * Toast Context
 * 提供全局 Toast 通知管理
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { type ToastType, type ToastProps } from '@/components/common/Toast';

interface ToastContextValue {
    toasts: ToastProps[]; // 用于测试和调试
    showToast: (type: ToastType, message: string, duration?: number) => string;
    showSuccess: (message: string, duration?: number) => string;
    showError: (message: string, duration?: number) => string;
    showWarning: (message: string, duration?: number) => string;
    showInfo: (message: string, duration?: number) => string;
    showLoading: (message: string) => string;
    hideToast: (id: string) => void;
    clearAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const showToast = useCallback(
        (type: ToastType, message: string, duration?: number): string => {
            const id = `toast-${Date.now()}-${Math.random()}`;

            const newToast: ToastProps = {
                id,
                type,
                message,
                duration,
                onClose: (toastId: string) => {
                    setToasts((prev) => prev.filter((t) => t.id !== toastId));
                },
            };

            setToasts((prev) => [...prev, newToast]);
            return id;
        },
        []
    );

    const showSuccess = useCallback(
        (message: string, duration = 2000): string => {
            return showToast('success', message, duration);
        },
        [showToast]
    );

    const showError = useCallback(
        (message: string, duration = 3000): string => {
            return showToast('error', message, duration);
        },
        [showToast]
    );

    const showWarning = useCallback(
        (message: string, duration = 3000): string => {
            return showToast('warning', message, duration);
        },
        [showToast]
    );

    const showInfo = useCallback(
        (message: string, duration = 3000): string => {
            return showToast('info', message, duration);
        },
        [showToast]
    );

    const showLoading = useCallback(
        (message: string): string => {
            return showToast('loading', message, 0);
        },
        [showToast]
    );

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const value: ToastContextValue = {
        toasts,
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showLoading,
        hideToast,
        clearAll,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Toast 容器 */}
            <div
                className="fixed top-4 right-4 z-[9999] flex flex-col gap-2"
                aria-live="polite"
                aria-atomic="true"
            >
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

/**
 * useToast Hook
 * 使用全局 Toast 通知
 */
export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
