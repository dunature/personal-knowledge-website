import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary 组件
 * 捕获子组件树中的 JavaScript 错误，记录错误并显示备用 UI
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // 记录错误信息
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // 调用自定义错误处理函数
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // 如果提供了自定义 fallback，使用它
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // 默认错误 UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-background-secondary p-xl">
                    <div className="bg-white rounded-card shadow-modal p-xl max-w-2xl w-full">
                        <div className="flex items-center gap-md mb-lg">
                            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-error"
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
                            <div>
                                <h2 className="text-h2 text-text">出错了</h2>
                                <p className="text-secondary text-tertiary">应用程序遇到了一个错误</p>
                            </div>
                        </div>

                        <div className="mb-lg">
                            <p className="text-body text-secondary mb-md">
                                很抱歉，应用程序遇到了一个意外错误。您可以尝试刷新页面或返回首页。
                            </p>

                            {import.meta.env.DEV && this.state.error && (
                                <details className="mt-md">
                                    <summary className="cursor-pointer text-small text-primary hover:text-primary-hover mb-sm">
                                        查看错误详情
                                    </summary>
                                    <div className="bg-background-secondary p-md rounded-medium overflow-auto">
                                        <p className="text-small text-error font-semibold mb-sm">
                                            {this.state.error.toString()}
                                        </p>
                                        {this.state.errorInfo && (
                                            <pre className="text-small text-secondary whitespace-pre-wrap">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        )}
                                    </div>
                                </details>
                            )}
                        </div>

                        <div className="flex gap-md">
                            <button
                                onClick={this.handleReset}
                                className="px-lg py-sm bg-primary text-white rounded-medium transition-colors hover:bg-primary-hover"
                            >
                                重试
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-lg py-sm bg-white text-primary border-2 border-primary rounded-medium transition-colors hover:bg-primary-light"
                            >
                                返回首页
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
