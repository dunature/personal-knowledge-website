/**
 * Gist ID 输入组件
 * 访客模式下输入 Gist ID 查看内容
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { gistService } from '@/services/gistService';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { validateGistDataDetailed } from '@/utils/dataValidation';

interface GistIdInputProps {
    onBack: () => void;
    onComplete: () => void;
}

const GistIdInput: React.FC<GistIdInputProps> = ({ onBack, onComplete }) => {
    const { setGistId, switchMode } = useAuth();
    const [gistIdInput, setGistIdInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!gistIdInput.trim()) {
            setError('请输入 Gist ID');
            return;
        }

        // 验证 Gist ID 格式（20-40位十六进制字符）
        if (!/^[a-f0-9]{20,40}$/i.test(gistIdInput.trim())) {
            setError('Gist ID 格式不正确，应该是20-40位十六进制字符');
            return;
        }

        setIsLoading(true);
        setLoadingProgress(0);
        setLoadingMessage('正在连接到 GitHub...');

        try {
            // Step 1: 获取 Gist 数据
            setLoadingProgress(20);
            setLoadingMessage('正在加载知识库数据...');
            const gistData = await gistService.getGist(gistIdInput.trim());

            // Step 2: 验证数据格式
            setLoadingProgress(40);
            setLoadingMessage('正在验证数据...');
            const validationResult = validateGistDataDetailed(gistData);
            if (!validationResult.valid) {
                const errorMessage = validationResult.errors
                    ? `数据验证失败：\n${validationResult.errors.join('\n')}`
                    : '数据格式无效';
                throw new Error(errorMessage);
            }

            // Step 3: 保存到本地缓存
            setLoadingProgress(60);
            setLoadingMessage('正在保存数据...');
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, gistData.resources);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, gistData.questions);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, gistData.subQuestions);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, gistData.answers);
            await cacheService.saveData(STORAGE_KEYS.METADATA, gistData.metadata);

            // Step 4: 保存 Gist ID 并切换模式
            setLoadingProgress(80);
            setLoadingMessage('正在初始化...');
            setGistId(gistIdInput.trim());
            switchMode('visitor');

            // Step 5: 完成
            setLoadingProgress(100);
            setLoadingMessage('加载完成！');

            // 延迟一下再跳转，让用户看到完成状态
            setTimeout(() => {
                onComplete();
            }, 500);
        } catch (err) {
            console.error('加载 Gist 失败:', err);
            setLoadingProgress(0);
            if (err instanceof Error) {
                if (err.message.includes('404')) {
                    setError('Gist 不存在，请检查 ID 是否正确');
                } else if (err.message.includes('403')) {
                    setError('Gist 是私有的，需要权限访问');
                } else if (err.message.includes('数据验证失败')) {
                    // 使用详细的验证错误消息
                    setError(err.message);
                } else if (err.message.includes('数据格式')) {
                    setError(err.message);
                } else {
                    setError('无法访问该 Gist，请检查 ID 是否正确或 Gist 是否为公开');
                }
            } else {
                setError('加载失败，请稍后重试');
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                    <svg
                        className="w-12 h-12 text-gray-600"
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
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">访客模式</h2>
                <p className="text-gray-600">输入 Gist ID 查看他人的知识库</p>
            </div>

            {/* 说明 */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">什么是 Gist ID？</h3>
                <p className="text-sm text-blue-800 mb-3">
                    Gist ID 是一个20-40位十六进制字符（0-9, a-f）的唯一标识符，用于访问存储在 GitHub Gist 上的知识库数据。
                </p>
                <div className="space-y-2">
                    <p className="text-sm text-blue-800">
                        <span className="font-medium">有效示例：</span>
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1 ml-4">
                        <li>• 32位：<code className="px-2 py-1 bg-blue-100 rounded font-mono">a1b2c3d4e5f6789012345678901234ab</code></li>
                        <li>• 40位：<code className="px-2 py-1 bg-blue-100 rounded font-mono">a1b2c3d4e5f67890123456789012345678901234</code></li>
                    </ul>
                </div>
            </div>

            {/* Gist ID 输入表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gist ID
                    </label>
                    <input
                        type="text"
                        value={gistIdInput}
                        onChange={(e) => setGistIdInputValue(e.target.value)}
                        placeholder="输入20-40位 Gist ID"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary placeholder:text-gray-400 transition-all duration-200 font-mono text-sm"
                        disabled={isLoading}
                        maxLength={40}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        {gistIdInput.length}/40 字符
                    </p>
                </div>

                {/* 加载进度 */}
                {isLoading && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="mb-2">
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-500"
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
                                <p className="text-sm text-red-800 font-medium mb-1">加载失败</p>
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
                            加载中...
                        </>
                    ) : (
                        '开始浏览'
                    )}
                </button>
            </form>

            {/* 提示信息 */}
            <div className="mt-8 space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg
                            className="w-5 h-5 mr-2 text-gray-600"
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
                    <ul className="text-sm text-gray-700 space-y-2">
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

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                        💡 访客模式下，你可以浏览所有内容，但无法进行编辑操作
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GistIdInput;
