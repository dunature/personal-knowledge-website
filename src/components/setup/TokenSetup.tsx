/**
 * Token 配置组件
 * 引导用户配置 GitHub Personal Access Token
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import InitializationWizard from './InitializationWizard';
import DataConflictDialog from './DataConflictDialog';
import { initializationService } from '@/services/initializationService';
import { gistService } from '@/services/gistService';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import type { GistData } from '@/types/gist';
import type { ConflictStrategy } from '@/services/initializationService';

interface TokenSetupProps {
    onBack: () => void;
    onComplete: () => void;
}

const TokenSetup: React.FC<TokenSetupProps> = ({ onBack, onComplete }) => {
    const { setToken } = useAuth();
    const [token, setTokenInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [showInitWizard, setShowInitWizard] = useState(false);
    const [showConflictDialog, setShowConflictDialog] = useState(false);
    const [conflictGistId, setConflictGistId] = useState<string | null>(null);
    const [localData, setLocalData] = useState<GistData | null>(null);
    const [remoteData, setRemoteData] = useState<GistData | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token.trim()) {
            setError('请输入 Token');
            return;
        }

        if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
            setError('Token 格式不正确，应该以 ghp_ 或 github_pat_ 开头');
            return;
        }

        setIsLoading(true);

        try {
            const success = await setToken(token);
            if (success) {
                // Token 验证成功，显示初始化向导
                setShowInitWizard(true);
            } else {
                setError('Token 验证失败，请检查 Token 是否正确');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Token 设置失败');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInitComplete = (result: any) => {
        // 初始化完成，跳转到主页面
        onComplete();
    };

    const handleInitError = (err: Error) => {
        // 初始化失败，返回 Token 输入界面
        setError(err.message);
        setShowInitWizard(false);
    };

    const handleConflict = async (gistId: string) => {
        // 检测到冲突，加载本地和云端数据
        try {
            setConflictGistId(gistId);

            // 获取本地数据
            const resources = (await cacheService.getData(STORAGE_KEYS.RESOURCES)) || [];
            const questions = (await cacheService.getData(STORAGE_KEYS.QUESTIONS)) || [];
            const subQuestions = (await cacheService.getData(STORAGE_KEYS.SUB_QUESTIONS)) || [];
            const answers = (await cacheService.getData(STORAGE_KEYS.ANSWERS)) || [];
            const metadata = (await cacheService.getData(STORAGE_KEYS.METADATA)) || {
                version: '1.0.0',
                lastSync: new Date().toISOString(),
                owner: 'unknown',
            };

            setLocalData({
                resources,
                questions,
                subQuestions,
                answers,
                metadata,
            });

            // 获取云端数据
            const remote = await gistService.getGist(gistId, token);
            setRemoteData(remote);

            // 显示冲突对话框
            setShowInitWizard(false);
            setShowConflictDialog(true);
        } catch (err) {
            console.error('加载冲突数据失败:', err);
            setError('加载数据失败');
            setShowInitWizard(false);
        }
    };

    const handleConflictResolve = async (strategy: ConflictStrategy) => {
        try {
            setShowConflictDialog(false);
            setIsLoading(true);

            // 解决冲突并同步
            const result = await initializationService.resolveConflictAndSync(strategy);

            if (result.success) {
                onComplete();
            } else {
                setError(result.error || '解决冲突失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '解决冲突失败');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConflictCancel = () => {
        setShowConflictDialog(false);
        setShowInitWizard(false);
        setError('已取消初始化');
    };

    const openGitHubTokenPage = () => {
        window.open('https://github.com/settings/tokens/new', '_blank');
    };

    // 显示初始化向导
    if (showInitWizard) {
        return (
            <InitializationWizard
                token={token}
                onComplete={handleInitComplete}
                onError={handleInitError}
                onConflict={handleConflict}
            />
        );
    }

    // 显示冲突对话框
    if (showConflictDialog && localData && remoteData) {
        return (
            <DataConflictDialog
                localData={localData}
                remoteData={remoteData}
                onResolve={handleConflictResolve}
                onCancel={handleConflictCancel}
            />
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* 返回按钮 */}
            <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                返回
            </button>

            {/* 标题 */}
            <div className="text-center mb-8">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                    <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">配置 GitHub Token</h2>
                <p className="text-gray-600">连接你的 GitHub 账号以开始使用</p>
            </div>

            {/* 步骤说明 */}
            <div className="mb-8 space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">获取 Token 步骤：</h3>

                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-700">
                            访问 GitHub Settings → Developer Settings → Personal Access Tokens
                        </p>
                        <button
                            onClick={openGitHubTokenPage}
                            className="mt-2 text-sm text-primary hover:text-primary-dark flex items-center"
                        >
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                            打开 GitHub Token 页面
                        </button>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                    </div>
                    <p className="flex-1 text-gray-700">
                        点击 "Generate new token (classic)"
                    </p>
                </div>

                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                    </div>
                    <p className="flex-1 text-gray-700">
                        勾选 <code className="px-2 py-1 bg-gray-100 rounded text-sm">gist</code>{' '}
                        权限
                    </p>
                </div>

                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                    </div>
                    <p className="flex-1 text-gray-700">生成并复制 Token</p>
                </div>
            </div>

            {/* Token 输入表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub Personal Access Token
                    </label>
                    <div className="relative">
                        <input
                            type={showToken ? 'text' : 'password'}
                            value={token}
                            onChange={(e) => setTokenInput(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showToken ? (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* 错误提示 */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
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
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* 提交按钮 */}
                <button
                    type="submit"
                    disabled={isLoading || !token.trim()}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            验证中...
                        </>
                    ) : (
                        '验证并保存'
                    )}
                </button>
            </form>

            {/* 安全提示 */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                    <svg
                        className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">安全提示</p>
                        <p>Token 将被加密存储在你的浏览器本地，不会上传到任何服务器。</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenSetup;
