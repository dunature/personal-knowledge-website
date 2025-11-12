import React from 'react';

export type LoadingType = 'spinner' | 'skeleton' | 'dots' | 'pulse';

interface LoadingStateProps {
    type?: LoadingType;
    message?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

/**
 * LoadingState 组件
 * 显示各种加载状态
 */
const LoadingState: React.FC<LoadingStateProps> = ({
    type = 'spinner',
    message,
    size = 'medium',
    className = '',
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    if (type === 'spinner') {
        return (
            <div className={`flex flex-col items-center justify-center gap-md ${className}`}>
                <div
                    className={`${sizeClasses[size]} border-4 border-background-secondary border-t-primary rounded-full animate-spin`}
                    role="status"
                    aria-label="加载中"
                />
                {message && <p className="text-secondary text-secondary">{message}</p>}
            </div>
        );
    }

    if (type === 'dots') {
        return (
            <div className={`flex flex-col items-center justify-center gap-md ${className}`}>
                <div className="flex gap-sm">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                {message && <p className="text-secondary text-secondary">{message}</p>}
            </div>
        );
    }

    if (type === 'pulse') {
        return (
            <div className={`flex flex-col items-center justify-center gap-md ${className}`}>
                <div className={`${sizeClasses[size]} bg-primary rounded-full animate-pulse`} />
                {message && <p className="text-secondary text-secondary">{message}</p>}
            </div>
        );
    }

    // skeleton type - 返回null，因为骨架屏通常是自定义的
    return null;
};

/**
 * CardSkeleton 组件
 * 卡片骨架屏
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`bg-white rounded-card shadow-card p-md ${className}`}>
            <div className="animate-pulse">
                {/* 图片占位 */}
                <div className="w-full h-48 bg-background-secondary rounded-medium mb-md" />

                {/* 标签占位 */}
                <div className="flex gap-sm mb-md">
                    <div className="w-16 h-5 bg-background-secondary rounded-small" />
                    <div className="w-20 h-5 bg-background-secondary rounded-small" />
                </div>

                {/* 标题占位 */}
                <div className="w-full h-6 bg-background-secondary rounded mb-sm" />
                <div className="w-3/4 h-6 bg-background-secondary rounded mb-md" />

                {/* 描述占位 */}
                <div className="w-full h-4 bg-background-secondary rounded mb-xs" />
                <div className="w-5/6 h-4 bg-background-secondary rounded mb-md" />

                {/* 底部信息占位 */}
                <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-background-secondary rounded" />
                    <div className="w-20 h-8 bg-background-secondary rounded-medium" />
                </div>
            </div>
        </div>
    );
};

/**
 * ListSkeleton 组件
 * 列表项骨架屏
 */
export const ListSkeleton: React.FC<{ count?: number; className?: string }> = ({
    count = 3,
    className = ''
}) => {
    return (
        <div className={`space-y-md ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white rounded-medium p-md animate-pulse">
                    <div className="flex items-center gap-md">
                        <div className="w-16 h-6 bg-background-secondary rounded-small" />
                        <div className="flex-1 h-5 bg-background-secondary rounded" />
                        <div className="w-24 h-4 bg-background-secondary rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * TextSkeleton 组件
 * 文本骨架屏
 */
export const TextSkeleton: React.FC<{
    lines?: number;
    className?: string
}> = ({
    lines = 3,
    className = ''
}) => {
        return (
            <div className={`space-y-sm animate-pulse ${className}`}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className="h-4 bg-background-secondary rounded"
                        style={{ width: index === lines - 1 ? '75%' : '100%' }}
                    />
                ))}
            </div>
        );
    };

/**
 * FullPageLoading 组件
 * 全页面加载状态
 */
export const FullPageLoading: React.FC<{ message?: string }> = ({ message = '加载中...' }) => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-background-secondary border-t-primary rounded-full animate-spin mx-auto mb-lg" />
                <p className="text-body text-secondary">{message}</p>
            </div>
        </div>
    );
};

export default LoadingState;
