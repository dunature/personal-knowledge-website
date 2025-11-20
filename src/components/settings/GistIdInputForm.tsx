/**
 * Gist ID 输入表单组件
 * 使用 useGistIdInput Hook 实现输入和加载功能
 * 使用 React.memo 优化性能
 */

import React from 'react';
import { useGistIdInput } from '@/hooks/useGistIdInput';

interface GistIdInputFormProps {
    mode: 'visitor' | 'owner';
    onSuccess: () => void;
    onError: (error: string) => void;
}

const GistIdInputForm: React.FC<GistIdInputFormProps> = ({
    mode,
    onSuccess,
    onError,
}) => {
    const {
        gistIdInput,
        setGistIdInput,
        isLoading,
        error,
        loadingProgress,
        loadingMessage,
        handleSubmit,
    } = useGistIdInput({
        onSuccess,
        onError,
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit();
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* 输入框 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gist ID (20-40位十六进制)
                </label>
                <input
                    type="text"
                    value={gistIdInput}
                    onChange={(e) => setGistIdInput(e.target.value)}
                    placeholder="输入20-40位 Gist ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 transition-all duration-200 font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    maxLength={40}
                />
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">{gistIdInput.length}/40 字符</p>
                    {gistIdInput.length >= 20 && gistIdInput.length <= 40 && /^[a-f0-9]+$/i.test(gistIdInput) && (
                        <span className="text-sm text-green-600 flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            格式正确
                        </span>
                    )}
                </div>
            </div>

            {/* 提示信息 */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-700">
                    {mode === 'owner' ? (
                        <>
                            💡 <span className="font-medium">拥有者模式：</span>
                            输入你的 Gist ID 连接到现有知识库。如果本地有数据，系统会提示你选择如何处理。
                        </>
                    ) : (
                        <>
                            💡 <span className="font-medium">访客模式：</span>
                            输入他人分享的 Gist ID 查看公开的知识库数据。
                        </>
                    )}
                </p>
            </div>

            {/* 加载进度 */}
            {isLoading && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="mb-2">
                        <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-blue-800 text-center">{loadingMessage}</p>
                </div>
            )}

            {/* 错误提示 */}
            {error && !isLoading && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start mb-2">
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
                            <p className="text-sm text-red-800 font-medium mb-1">操作失败</p>
                            <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                        </div>
                    </div>
                    {/* 格式错误时显示额外帮助 */}
                    {error.includes('格式不正确') && (
                        <div className="mt-3 pt-3 border-t border-red-200">
                            <p className="text-xs text-red-700 font-medium mb-1">格式要求：</p>
                            <ul className="text-xs text-red-600 space-y-1 ml-4">
                                <li>• 长度：20-40 个字符</li>
                                <li>• 字符：仅包含 0-9 和 a-f（不区分大小写）</li>
                                <li>• 示例：a1b2c3d4e5f6789012345678901234ab</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* 提交按钮 */}
            <button
                type="submit"
                disabled={isLoading || !gistIdInput.trim()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
                        加载中...
                    </>
                ) : (
                    <>
                        {mode === 'owner' ? '连接 Gist' : '开始加载'}
                    </>
                )}
            </button>

            {/* 帮助信息 */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center">
                    <svg
                        className="w-4 h-4 mr-2 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    如何获取 Gist ID？
                </h4>
                <ul className="text-xs text-gray-700 space-y-1">
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>从分享链接中获取（链接中的 ?gist= 参数）</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>从 Gist URL 中获取（https://gist.github.com/username/[ID]）</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>向知识库拥有者索取</span>
                    </li>
                </ul>
            </div>
        </form>
    );
};

// 使用 React.memo 优化性能
export default React.memo(GistIdInputForm);
