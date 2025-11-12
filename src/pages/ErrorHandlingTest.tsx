import React, { useState } from 'react';
import {
    ErrorBoundary,
    ErrorMessage,
    EmptyState,
    LoadingState,
    CardSkeleton,
    ListSkeleton,
    TextSkeleton,
    FullPageLoading,
} from '../components/common';
import { useError } from '../hooks/useError';

const ErrorHandlingTest: React.FC = () => {
    const [showFullPageLoading, setShowFullPageLoading] = useState(false);
    const [throwError, setThrowError] = useState(false);
    const { error, setError, clearError, hasError } = useError();

    const ErrorComponent = () => {
        if (throwError) {
            throw new Error('这是一个测试错误！');
        }
        return <div className="p-md bg-success/10 rounded-medium">组件正常运行</div>;
    };

    return (
        <div className="min-h-screen bg-background-secondary p-xl">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-h1 text-text mb-lg">错误处理组件测试</h1>

                {showFullPageLoading && <FullPageLoading message="正在加载数据..." />}

                <section className="bg-white rounded-card shadow-card p-xl mb-lg">
                    <h2 className="text-h2 text-text mb-md">1. ErrorBoundary 测试</h2>

                    <button
                        onClick={() => setThrowError(!throwError)}
                        className="px-lg py-sm bg-error text-white rounded-medium mb-md hover:bg-error/80 transition-colors"
                    >
                        {throwError ? '恢复组件' : '触发错误'}
                    </button>

                    <ErrorBoundary>
                        <ErrorComponent />
                    </ErrorBoundary>
                </section>

                <section className="bg-white rounded-card shadow-card p-xl mb-lg">
                    <h2 className="text-h2 text-text mb-md">2. ErrorMessage 测试</h2>

                    <div className="space-y-md mb-md">
                        <button
                            onClick={() => setError({ type: 'network', message: '网络连接失败' })}
                            className="px-md py-sm bg-primary text-white rounded-medium hover:bg-primary-hover transition-colors mr-sm"
                        >
                            网络错误
                        </button>
                        <button
                            onClick={() => setError({ type: 'validation', message: '请填写所有必填字段' })}
                            className="px-md py-sm bg-primary text-white rounded-medium hover:bg-primary-hover transition-colors mr-sm"
                        >
                            验证错误
                        </button>
                    </div>

                    {hasError && (
                        <ErrorMessage
                            type={error?.type}
                            message={error?.message}
                            onRetry={() => clearError()}
                            onDismiss={clearError}
                        />
                    )}
                </section>

                <section className="bg-white rounded-card shadow-card p-xl mb-lg">
                    <h2 className="text-h2 text-text mb-md">3. EmptyState 测试</h2>

                    <div className="grid grid-cols-2 gap-lg">
                        <EmptyState type="noResources" onAction={() => console.log('添加资源')} />
                        <EmptyState type="noSearchResults" onAction={() => console.log('清除筛选')} />
                    </div>
                </section>

                <section className="bg-white rounded-card shadow-card p-xl mb-lg">
                    <h2 className="text-h2 text-text mb-md">4. LoadingState 测试</h2>

                    <div className="grid grid-cols-3 gap-lg mb-lg">
                        <LoadingState type="spinner" size="medium" message="加载中..." />
                        <LoadingState type="dots" message="保存中..." />
                        <LoadingState type="pulse" size="large" />
                    </div>

                    <button
                        onClick={() => {
                            setShowFullPageLoading(true);
                            setTimeout(() => setShowFullPageLoading(false), 2000);
                        }}
                        className="px-lg py-sm bg-primary text-white rounded-medium hover:bg-primary-hover transition-colors"
                    >
                        测试全页面加载（2秒）
                    </button>
                </section>

                <section className="bg-white rounded-card shadow-card p-xl mb-lg">
                    <h2 className="text-h2 text-text mb-md">5. 骨架屏测试</h2>

                    <h3 className="text-h3 text-text mb-md">卡片骨架屏</h3>
                    <div className="grid grid-cols-3 gap-lg mb-lg">
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </div>

                    <h3 className="text-h3 text-text mb-md">列表骨架屏</h3>
                    <ListSkeleton count={3} className="mb-lg" />

                    <h3 className="text-h3 text-text mb-md">文本骨架屏</h3>
                    <TextSkeleton lines={5} />
                </section>
            </div>
        </div>
    );
};

export default ErrorHandlingTest;
