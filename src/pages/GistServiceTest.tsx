/**
 * Gist 服务测试页面
 * 测试 GistService、AuthService 和加密工具
 */

import React, { useState } from 'react';
import { gistService } from '@/services/gistService';
import { authService } from '@/services/authService';
import { encryptToken, decryptToken } from '@/utils/cryptoUtils';
import { validateGistData } from '@/utils/dataValidation';
import type { GistData } from '@/types/gist';

const GistServiceTest: React.FC = () => {
    const [token, setToken] = useState('');
    const [gistId, setGistId] = useState('');
    const [testResults, setTestResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addResult = (message: string, isError = false) => {
        const prefix = isError ? '❌' : '✅';
        setTestResults((prev) => [...prev, `${prefix} ${message}`]);
    };

    const clearResults = () => {
        setTestResults([]);
    };

    // 测试 1: Token 加密和解密
    const testTokenEncryption = async () => {
        clearResults();
        addResult('开始测试 Token 加密和解密...');

        try {
            const testToken = 'ghp_test1234567890abcdefghijklmnopqrstuvwxyz';

            // 加密
            const encrypted = await encryptToken(testToken);
            addResult(`Token 加密成功，长度: ${encrypted.length}`);

            // 解密
            const decrypted = await decryptToken(encrypted);
            if (decrypted === testToken) {
                addResult('Token 解密成功，内容匹配');
            } else {
                addResult('Token 解密失败，内容不匹配', true);
            }
        } catch (error) {
            addResult(`加密测试失败: ${error}`, true);
        }
    };

    // 测试 2: Token 验证
    const testTokenValidation = async () => {
        if (!token) {
            addResult('请输入 GitHub Token', true);
            return;
        }

        clearResults();
        setIsLoading(true);
        addResult('开始验证 Token...');

        try {
            const result = await gistService.validateToken(token);

            if (result.valid) {
                addResult(`Token 验证成功！用户名: ${result.username}`);
                addResult(`头像 URL: ${result.avatarUrl}`);
            } else {
                addResult(`Token 验证失败: ${result.error}`, true);
            }
        } catch (error) {
            addResult(`Token 验证出错: ${error}`, true);
        } finally {
            setIsLoading(false);
        }
    };

    // 测试 3: 创建 Gist
    const testCreateGist = async () => {
        if (!token) {
            addResult('请输入 GitHub Token', true);
            return;
        }

        clearResults();
        setIsLoading(true);
        addResult('开始创建测试 Gist...');

        try {
            const testData: GistData = {
                resources: [
                    {
                        id: 'test_res_1',
                        title: '测试资源',
                        url: 'https://example.com',
                        type: 'blog',
                        cover: 'https://via.placeholder.com/320x180',
                        platform: 'Test Platform',
                        content_tags: ['测试'],
                        category: '测试分类',
                        author: '测试作者',
                        recommendation: '这是一个测试资源',
                        metadata: {},
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                ],
                questions: [],
                subQuestions: [],
                answers: [],
                metadata: {
                    version: '1.0.0',
                    lastSync: new Date().toISOString(),
                    owner: 'test_user',
                },
            };

            const result = await gistService.createGist(testData, token);
            addResult(`Gist 创建成功！ID: ${result.id}`);
            addResult(`URL: ${result.htmlUrl}`);
            setGistId(result.id);
        } catch (error) {
            addResult(`创建 Gist 失败: ${error}`, true);
        } finally {
            setIsLoading(false);
        }
    };

    // 测试 4: 获取 Gist
    const testGetGist = async () => {
        if (!gistId) {
            addResult('请先创建 Gist 或输入 Gist ID', true);
            return;
        }

        clearResults();
        setIsLoading(true);
        addResult('开始获取 Gist 数据...');

        try {
            const data = await gistService.getGist(gistId, token || undefined);
            addResult(`Gist 获取成功！`);
            addResult(`资源数量: ${data.resources.length}`);
            addResult(`问题数量: ${data.questions.length}`);
            addResult(`版本: ${data.metadata.version}`);
            addResult(`拥有者: ${data.metadata.owner}`);

            // 验证数据格式
            if (validateGistData(data)) {
                addResult('数据格式验证通过');
            } else {
                addResult('数据格式验证失败', true);
            }
        } catch (error) {
            addResult(`获取 Gist 失败: ${error}`, true);
        } finally {
            setIsLoading(false);
        }
    };

    // 测试 5: AuthService
    const testAuthService = async () => {
        if (!token) {
            addResult('请输入 GitHub Token', true);
            return;
        }

        clearResults();
        setIsLoading(true);
        addResult('开始测试 AuthService...');

        try {
            // 初始化
            await authService.initialize();
            addResult('AuthService 初始化成功');

            // 设置 Token
            const success = await authService.setToken(token);
            if (success) {
                addResult('Token 设置成功');

                // 获取用户信息
                const user = await authService.getCurrentUser();
                if (user) {
                    addResult(`用户信息: ${user.username}`);
                }

                // 检查认证状态
                const isAuth = authService.isAuthenticated();
                addResult(`认证状态: ${isAuth ? '已认证' : '未认证'}`);

                // 获取模式
                const mode = authService.getMode();
                addResult(`当前模式: ${mode}`);

                // 生成分享链接
                if (gistId) {
                    authService.setGistId(gistId);
                    const shareLink = authService.generateShareLink();
                    if (shareLink) {
                        addResult(`分享链接: ${shareLink}`);
                    }
                }
            } else {
                addResult('Token 设置失败', true);
            }
        } catch (error) {
            addResult(`AuthService 测试失败: ${error}`, true);
        } finally {
            setIsLoading(false);
        }
    };

    // 测试 6: 数据验证
    const testDataValidation = () => {
        clearResults();
        addResult('开始测试数据验证...');

        const validData: GistData = {
            resources: [],
            questions: [],
            subQuestions: [],
            answers: [],
            metadata: {
                version: '1.0.0',
                lastSync: new Date().toISOString(),
                owner: 'test',
            },
        };

        if (validateGistData(validData)) {
            addResult('有效数据验证通过');
        } else {
            addResult('有效数据验证失败', true);
        }

        const invalidData = {
            resources: 'not an array',
            questions: [],
        };

        if (!validateGistData(invalidData as any)) {
            addResult('无效数据正确被拒绝');
        } else {
            addResult('无效数据验证失败', true);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Gist 服务测试</h1>

                {/* 输入区域 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">配置</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            GitHub Personal Access Token
                        </label>
                        <input
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            需要 'gist' 权限。在{' '}
                            <a
                                href="https://github.com/settings/tokens"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                GitHub Settings
                            </a>{' '}
                            创建
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Gist ID (可选)</label>
                        <input
                            type="text"
                            value={gistId}
                            onChange={(e) => setGistId(e.target.value)}
                            placeholder="输入已存在的 Gist ID"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* 测试按钮 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">测试项目</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={testTokenEncryption}
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                        >
                            1. Token 加密/解密
                        </button>

                        <button
                            onClick={testTokenValidation}
                            disabled={isLoading || !token}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                        >
                            2. Token 验证
                        </button>

                        <button
                            onClick={testCreateGist}
                            disabled={isLoading || !token}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                        >
                            3. 创建 Gist
                        </button>

                        <button
                            onClick={testGetGist}
                            disabled={isLoading || !gistId}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                        >
                            4. 获取 Gist
                        </button>

                        <button
                            onClick={testAuthService}
                            disabled={isLoading || !token}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                        >
                            5. AuthService
                        </button>

                        <button
                            onClick={testDataValidation}
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                        >
                            6. 数据验证
                        </button>
                    </div>
                </div>

                {/* 测试结果 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">测试结果</h2>
                        <button
                            onClick={clearResults}
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            清除
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-3 text-gray-600">测试中...</span>
                        </div>
                    )}

                    {testResults.length === 0 && !isLoading && (
                        <p className="text-gray-500 text-center py-8">点击上方按钮开始测试</p>
                    )}

                    {testResults.length > 0 && (
                        <div className="space-y-2 font-mono text-sm">
                            {testResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`p-2 rounded ${result.startsWith('❌')
                                            ? 'bg-red-50 text-red-700'
                                            : 'bg-green-50 text-green-700'
                                        }`}
                                >
                                    {result}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 说明 */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">测试说明</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• 测试 1: 不需要 Token，测试本地加密功能</li>
                        <li>• 测试 2-5: 需要有效的 GitHub Token</li>
                        <li>• 测试 3: 会在你的 GitHub 账号创建一个公开 Gist</li>
                        <li>• 测试 4: 需要先创建 Gist 或输入已存在的 Gist ID</li>
                        <li>• 测试 6: 不需要 Token，测试数据验证逻辑</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GistServiceTest;
