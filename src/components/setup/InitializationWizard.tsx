/**
 * 初始化向导组件
 * 显示 Token 配置后的数据初始化流程
 */

import React, { useState, useEffect } from 'react';
import { initializationService } from '@/services/initializationService';
import type { InitializationResult } from '@/types/auth';

type InitStep = 'detecting' | 'syncing' | 'conflict' | 'complete' | 'error';

interface InitializationWizardProps {
    token: string;
    onComplete: (result: InitializationResult) => void;
    onError: (error: Error) => void;
    onConflict?: (gistId: string) => void;
}

const InitializationWizard: React.FC<InitializationWizardProps> = ({
    token,
    onComplete,
    onError,
    onConflict,
}) => {
    const [step, setStep] = useState<InitStep>('detecting');
    const [progress, setProgress] = useState(0);
    const [currentOperation, setCurrentOperation] = useState('正在初始化...');
    const [error, setError] = useState<string | null>(null);
    const [canSkip, setCanSkip] = useState(false);

    useEffect(() => {
        performInitialization();
    }, []);

    const performInitialization = async () => {
        try {
            // Step 1: 检测 Gist
            setStep('detecting');
            setProgress(20);
            setCurrentOperation('检测现有数据...');

            const result = await initializationService.detectAndSync(token);

            if (!result.success) {
                if (result.error === 'DATA_CONFLICT') {
                    // 数据冲突，需要用户选择
                    setStep('conflict');
                    setProgress(50);
                    setCurrentOperation('检测到数据冲突');
                    if (onConflict && result.gistId) {
                        onConflict(result.gistId);
                    }
                    return;
                } else {
                    // 其他错误
                    throw new Error(result.error || '初始化失败');
                }
            }

            // Step 2: 同步或创建完成
            if (result.action === 'synced') {
                setStep('syncing');
                setProgress(80);
                setCurrentOperation('正在同步数据...');

                // 模拟同步过程
                await new Promise((resolve) => setTimeout(resolve, 500));
            } else if (result.action === 'created') {
                setStep('syncing');
                setProgress(80);
                setCurrentOperation('正在创建知识库...');

                // 模拟创建过程
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            // Step 3: 完成
            setStep('complete');
            setProgress(100);
            setCurrentOperation('初始化完成！');

            // 延迟一下再调用完成回调，让用户看到完成状态
            setTimeout(() => {
                onComplete(result);
            }, 800);
        } catch (err) {
            console.error('初始化失败:', err);
            setStep('error');
            setProgress(0);
            setError(err instanceof Error ? err.message : '初始化失败');
            setCanSkip(true);
        }
    };

    const handleSkip = () => {
        onComplete({
            success: true,
            action: 'skipped',
        });
    };

    const handleRetry = () => {
        setError(null);
        setCanSkip(false);
        performInitialization();
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* 标题 */}
            <div className="text-center mb-8">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                    <svg
                        className="w-12 h-12 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">正在初始化你的知识库</h2>
                <p className="text-gray-600">请稍候，这可能需要几秒钟...</p>
            </div>

            {/* 步骤指示器 */}
            <div className="mb-8 space-y-3">
                <div className="flex items-center space-x-3">
                    <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step === 'detecting' || step === 'syncing' || step === 'complete'
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {step === 'complete' ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : step === 'detecting' ? (
                            <svg
                                className="animate-spin w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            '1'
                        )}
                    </div>
                    <p className="flex-1 text-gray-700">验证 Token</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step === 'detecting'
                                ? 'bg-primary text-white'
                                : step === 'syncing' || step === 'complete'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {step === 'syncing' || step === 'complete' ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : step === 'detecting' ? (
                            <svg
                                className="animate-spin w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            '2'
                        )}
                    </div>
                    <p className="flex-1 text-gray-700">检测现有数据</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step === 'syncing'
                                ? 'bg-primary text-white'
                                : step === 'complete'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {step === 'complete' ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : step === 'syncing' ? (
                            <svg
                                className="animate-spin w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            '3'
                        )}
                    </div>
                    <p className="flex-1 text-gray-700">同步数据</p>
                </div>
            </div>

            {/* 进度条 */}
            <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">{currentOperation}</p>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">初始化失败</p>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 操作按钮 */}
            {step === 'error' && (
                <div className="flex space-x-3">
                    <button
                        onClick={handleRetry}
                        className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                        重试
                    </button>
                    {canSkip && (
                        <button
                            onClick={handleSkip}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            跳过
                        </button>
                    )}
                </div>
            )}

            {/* 完成状态 */}
            {step === 'complete' && (
                <div className="text-center">
                    <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                        <svg
                            className="w-12 h-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">初始化完成！</p>
                    <p className="text-sm text-gray-600 mt-2">正在跳转到主页面...</p>
                </div>
            )}
        </div>
    );
};

export default InitializationWizard;
