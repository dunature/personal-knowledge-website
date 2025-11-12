import React from 'react';

export type EmptyStateType = 'noResources' | 'noSearchResults' | 'noQuestions' | 'noSubQuestions' | 'noAnswers' | 'general';

interface EmptyStateProps {
    type?: EmptyStateType;
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

/**
 * EmptyState 组件
 * 显示各种空状态提示
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    type = 'general',
    title,
    message,
    actionLabel,
    onAction,
    className = '',
}) => {
    const getEmptyStateConfig = () => {
        switch (type) {
            case 'noResources':
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    ),
                    defaultTitle: '还没有资源',
                    defaultMessage: '开始添加您的第一个资源，记录您的学习旅程。',
                    defaultActionLabel: '添加资源',
                };
            case 'noSearchResults':
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    ),
                    defaultTitle: '未找到相关资源',
                    defaultMessage: '尝试使用不同的关键词或清除筛选条件。',
                    defaultActionLabel: '清除筛选',
                };
            case 'noQuestions':
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    ),
                    defaultTitle: '还没有问题',
                    defaultMessage: '开始记录您的问题和思考，构建您的知识体系。',
                    defaultActionLabel: '添加问题',
                };
            case 'noSubQuestions':
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    ),
                    defaultTitle: '还没有小问题',
                    defaultMessage: '将大问题分解为小问题，逐步解决。',
                    defaultActionLabel: '添加小问题',
                };
            case 'noAnswers':
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                    ),
                    defaultTitle: '还没有回答',
                    defaultMessage: '记录您的思考和解决方案，建立时间线。',
                    defaultActionLabel: '添加回答',
                };
            default:
                return {
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    ),
                    defaultTitle: '暂无内容',
                    defaultMessage: '这里还没有任何内容。',
                    defaultActionLabel: '开始添加',
                };
        }
    };

    const config = getEmptyStateConfig();
    const displayTitle = title || config.defaultTitle;
    const displayMessage = message || config.defaultMessage;
    const displayActionLabel = actionLabel || config.defaultActionLabel;

    return (
        <div className={`flex flex-col items-center justify-center py-xxl px-xl text-center ${className}`}>
            <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mb-lg">
                <svg
                    className="w-12 h-12 text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {config.icon}
                </svg>
            </div>

            <h3 className="text-h3 text-text mb-sm">{displayTitle}</h3>
            <p className="text-body text-secondary max-w-md mb-lg">{displayMessage}</p>

            {onAction && (
                <button
                    onClick={onAction}
                    className="px-lg py-sm bg-primary text-white rounded-medium transition-colors hover:bg-primary-hover"
                >
                    {displayActionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
