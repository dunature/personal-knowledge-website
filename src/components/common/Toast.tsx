import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

/**
 * Toast 通知组件
 * 显示临时通知消息
 */
const Toast: React.FC<ToastProps> = ({
    id,
    type,
    message,
    duration = 3000,
    onClose,
}) => {
    useEffect(() => {
        if (duration > 0 && type !== 'loading') {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [id, duration, type, onClose]);

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    bgColor: 'bg-green-600',
                    textColor: 'text-white',
                    iconColor: 'text-white',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    ),
                };
            case 'error':
                return {
                    bgColor: 'bg-red-600',
                    textColor: 'text-white',
                    iconColor: 'text-white',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ),
                };
            case 'warning':
                return {
                    bgColor: 'bg-yellow-500',
                    textColor: 'text-gray-900',
                    iconColor: 'text-gray-900',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    ),
                };
            case 'loading':
                return {
                    bgColor: 'bg-primary',
                    textColor: 'text-white',
                    iconColor: 'text-white',
                    icon: (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ),
                };
            default: // info
                return {
                    bgColor: 'bg-primary',
                    textColor: 'text-white',
                    iconColor: 'text-white',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    ),
                };
        }
    };

    const config = getToastConfig();

    return (
        <div
            className={`
                ${config.bgColor}
                px-4 py-3 rounded-md
                shadow-lg
                flex items-center gap-3
                animate-fadeIn
                min-w-[300px] max-w-[500px]
                transition-all duration-200
            `}
            role="alert"
            aria-live="polite"
        >
            <div className={`flex-shrink-0 ${config.iconColor}`}>{config.icon}</div>

            <p className={`flex-1 text-sm ${config.textColor} font-medium`}>{message}</p>

            {type !== 'loading' && (
                <button
                    onClick={() => onClose(id)}
                    className={`flex-shrink-0 ${config.iconColor} hover:opacity-80 transition-opacity duration-200`}
                    aria-label="关闭"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Toast;
