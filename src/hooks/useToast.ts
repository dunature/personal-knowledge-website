import { useState, useCallback } from 'react';
import type { ToastType, ToastProps } from '../components/common/Toast';

interface UseToastReturn {
    toasts: ToastProps[];
    showToast: (type: ToastType, message: string, duration?: number) => string;
    showSuccess: (message: string, duration?: number) => string;
    showError: (message: string, duration?: number) => string;
    showWarning: (message: string, duration?: number) => string;
    showInfo: (message: string, duration?: number) => string;
    showLoading: (message: string) => string;
    hideToast: (id: string) => void;
    clearAll: () => void;
}

/**
 * useToast Hook
 * 管理Toast通知状态
 */
export const useToast = (): UseToastReturn => {
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

    return {
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
};

export default useToast;
