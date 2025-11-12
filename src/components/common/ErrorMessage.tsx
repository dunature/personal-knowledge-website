import React from 'react';

export type ErrorType = 'network' | 'validation' | 'notFound' | 'permission' | 'general';

interface ErrorMessageProps {
    type?: ErrorType;
    message?: string;
    title?: string;
    onRetry?: () => void;
    onDismiss?: () => void;
    className?: string;
}

/**
 * ErrorMessage 组件
 * 显示各种类型的错误消息
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
    type = 'general',
    message,
    title,
    onRetry,
    onDismiss,
    className = '',
}) => {
    const getErrorConfig = () => {
        switch (type) {
            case 'network':
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                        />
                    ),
                    defaultTitle: '网络错误',
                    defaultMessage: '无法连接到服务器，请检查您的网络连接。',
                    color: 'error',
                };
            case 'validation':
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    ),
                    defaultTitle: '验证错误',
                    defaultMessage: '请检查您输入的信息是否正确。',
                    color: 'warning',
                };
            case 'notFound':
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    ),
                    defaultTitle: '未找到',
                    defaultMessage: '抱歉，我们找不到您要查找的内容。',
                    color: 'tertiary',
                };
            case 'permission':
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    ),
                    defaultTitle: '权限不足',
                    defaultMessage: '您没有权限执行此操作。',
                    color: 'warning',
                };
            default:
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    ),
                    defaultTitle: '出错了',
                    defaultMessage: '发生了一个错误，请稍后重试。',
                    color: 'error',
                };
        }
    };

    const config = getErrorConfig();
    const displayTitle = title || config.defaultTitle;
    const displayMessage = message || config.defaultMessage;

    return (
        <div
            className={`bg-white border-l-4 border-${config.color} rounded-medium shadow-card p-md ${className}`}
            role="alert"
        >
            <div className="flex items-start gap-md">
                <div className={`flex-shrink-0 w-6 h-6 text-${config.color}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {config.icon}
                    </svg>
                </div>

                <div className="flex-1">
                    <h3 className="text-card-title text-text mb-xs">{displayTitle}</h3>
                    <p className="text-secondary text-secondary">{displayMessage}</p>

                    {(onRetry || onDismiss) && (
                        <div className="flex gap-sm mt-md">
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="text-small text-primary hover:text-primary-hover transition-colors"
                                >
                                    重试
                                </button>
                            )}
                            {onDismiss && (
                                <button
                                    onClick={onDismiss}
                                    className="text-small text-secondary hover:text-text transition-colors"
                                >
                                    关闭
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="flex-shrink-0 text-tertiary hover:text-text transition-colors"
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
        </div>
    );
};

export default ErrorMessage;
