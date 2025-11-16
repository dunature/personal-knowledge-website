/**
 * 平台自动填充功能测试页面
 * 测试 Bilibili 和 GitHub 的信息获取功能
 */

import React, { useState } from 'react';
import { getBilibiliVideoInfo, getGitHubRepoInfo } from '@/utils/platformInfoUtils';
import { getYouTubeVideoInfo } from '@/utils/videoThumbnailUtils';

export const PlatformAutoFillTest: React.FC = () => {
    const [bilibiliUrl, setBilibiliUrl] = useState('https://www.bilibili.com/video/BV1uv411q7Mv');
    const [bilibiliResult, setBilibiliResult] = useState<any>(null);
    const [bilibiliError, setBilibiliError] = useState<string>('');
    const [bilibiliLoading, setBilibiliLoading] = useState(false);

    const [githubUrl, setGithubUrl] = useState('https://github.com/facebook/react');
    const [githubResult, setGithubResult] = useState<any>(null);
    const [githubError, setGithubError] = useState<string>('');
    const [githubLoading, setGithubLoading] = useState(false);

    const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    const [youtubeResult, setYoutubeResult] = useState<any>(null);
    const [youtubeError, setYoutubeError] = useState<string>('');
    const [youtubeLoading, setYoutubeLoading] = useState(false);

    const testBilibili = async () => {
        setBilibiliLoading(true);
        setBilibiliError('');
        setBilibiliResult(null);

        try {
            console.log('[Test] 测试 Bilibili:', bilibiliUrl);
            const result = await getBilibiliVideoInfo(bilibiliUrl);
            console.log('[Test] Bilibili 结果:', result);
            setBilibiliResult(result);
            if (!result) {
                setBilibiliError('获取失败 - 请查看控制台了解详情');
            }
        } catch (error: any) {
            console.error('[Test] Bilibili 错误:', error);
            setBilibiliError(error.message || '未知错误');
        } finally {
            setBilibiliLoading(false);
        }
    };

    const testGitHub = async () => {
        setGithubLoading(true);
        setGithubError('');
        setGithubResult(null);

        try {
            console.log('[Test] 测试 GitHub:', githubUrl);
            const result = await getGitHubRepoInfo(githubUrl);
            console.log('[Test] GitHub 结果:', result);
            setGithubResult(result);
            if (!result) {
                setGithubError('获取失败 - 请查看控制台了解详情');
            }
        } catch (error: any) {
            console.error('[Test] GitHub 错误:', error);
            setGithubError(error.message || '未知错误');
        } finally {
            setGithubLoading(false);
        }
    };

    const testYouTube = async () => {
        setYoutubeLoading(true);
        setYoutubeError('');
        setYoutubeResult(null);

        try {
            console.log('[Test] 测试 YouTube:', youtubeUrl);
            const result = await getYouTubeVideoInfo(youtubeUrl);
            console.log('[Test] YouTube 结果:', result);
            setYoutubeResult(result);
            if (!result) {
                setYoutubeError('获取失败 - 请查看控制台了解详情');
            }
        } catch (error: any) {
            console.error('[Test] YouTube 错误:', error);
            setYoutubeError(error.message || '未知错误');
        } finally {
            setYoutubeLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    平台自动填充功能测试
                </h1>

                <div className="space-y-8">
                    {/* YouTube 测试 */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            YouTube 视频信息获取
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    YouTube URL
                                </label>
                                <input
                                    type="text"
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                            <button
                                onClick={testYouTube}
                                disabled={youtubeLoading}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {youtubeLoading ? '获取中...' : '测试 YouTube'}
                            </button>

                            {youtubeError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-800 font-medium">错误</p>
                                    <p className="text-red-600 text-sm mt-1">{youtubeError}</p>
                                </div>
                            )}

                            {youtubeResult && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-green-800 font-medium mb-2">成功获取信息</p>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>标题:</strong> {youtubeResult.title}</p>
                                        <p><strong>作者:</strong> {youtubeResult.author}</p>
                                        <p><strong>封面:</strong></p>
                                        {youtubeResult.thumbnail && (
                                            <img
                                                src={youtubeResult.thumbnail}
                                                alt="封面"
                                                className="w-full max-w-md rounded border"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bilibili 测试 */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Bilibili 视频信息获取
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bilibili URL
                                </label>
                                <input
                                    type="text"
                                    value={bilibiliUrl}
                                    onChange={(e) => setBilibiliUrl(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="https://www.bilibili.com/video/BV..."
                                />
                            </div>
                            <button
                                onClick={testBilibili}
                                disabled={bilibiliLoading}
                                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                            >
                                {bilibiliLoading ? '获取中...' : '测试 Bilibili'}
                            </button>

                            {bilibiliError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-800 font-medium">错误</p>
                                    <p className="text-red-600 text-sm mt-1">{bilibiliError}</p>
                                    <div className="mt-3 space-y-1 text-xs text-red-600">
                                        <p>💡 常见问题:</p>
                                        <p>• <strong>-404 错误</strong>: 视频不存在或已被删除，请尝试其他视频</p>
                                        <p>• <strong>CORS 错误</strong>: 已通过 Vite 代理解决（开发环境）</p>
                                        <p>• <strong>推荐测试视频</strong>: BV1uv411q7Mv（官方视频）</p>
                                    </div>
                                </div>
                            )}

                            {bilibiliResult && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-green-800 font-medium mb-2">成功获取信息</p>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>标题:</strong> {bilibiliResult.title}</p>
                                        <p><strong>UP主:</strong> {bilibiliResult.author}</p>
                                        <p><strong>封面:</strong></p>
                                        {bilibiliResult.thumbnail && (
                                            <img
                                                src={bilibiliResult.thumbnail}
                                                alt="封面"
                                                className="w-full max-w-md rounded border"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GitHub 测试 */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            GitHub 仓库信息获取
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GitHub URL
                                </label>
                                <input
                                    type="text"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="https://github.com/owner/repo"
                                />
                            </div>
                            <button
                                onClick={testGitHub}
                                disabled={githubLoading}
                                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-50"
                            >
                                {githubLoading ? '获取中...' : '测试 GitHub'}
                            </button>

                            {githubError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-800 font-medium">错误</p>
                                    <p className="text-red-600 text-sm mt-1">{githubError}</p>
                                </div>
                            )}

                            {githubResult && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-green-800 font-medium mb-2">成功获取信息</p>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>仓库名:</strong> {githubResult.title}</p>
                                        <p><strong>作者:</strong> {githubResult.author}</p>
                                        <p><strong>描述:</strong> {githubResult.description}</p>
                                        <p><strong>星标数:</strong> {githubResult.stars}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        📋 测试说明
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li>• 打开浏览器控制台（F12）查看详细日志</li>
                        <li>• YouTube: 应该正常工作，使用 oEmbed API</li>
                        <li>• Bilibili: 可能遇到 CORS 问题，这是正常的</li>
                        <li>• GitHub: 应该正常工作，但有速率限制（60次/小时）</li>
                        <li>• 如果 GitHub 失败，可能是速率限制，等待一小时后重试</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PlatformAutoFillTest;
