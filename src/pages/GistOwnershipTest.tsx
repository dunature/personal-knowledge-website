/**
 * Gist 拥有者验证测试页面
 * 用于测试 verifyGistOwnership 功能
 */

import React, { useState } from 'react';
import { gistService } from '@/services/gistService';
import { authService } from '@/services/authService';
import LoadingState from '@/components/common/LoadingState';
import { CheckCircle, XCircle, AlertCircle, Key, FileText } from 'lucide-react';

interface TestResult {
    success: boolean;
    message: string;
    details?: any;
}

export default function GistOwnershipTest() {
    const [token, setToken] = useState('');
    const [gistId, setGistId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[]>([]);

    // 从 authService 加载当前数据
    const loadCurrentData = async () => {
        const currentToken = await authService.getToken();
        const currentGistId = authService.getGistId();

        if (currentToken) {
            setToken(currentToken);
        }
        if (currentGistId) {
            setGistId(currentGistId);
        }
    };

    React.useEffect(() => {
        loadCurrentData();
    }, []);

    // 测试 1: 验证 Token
    const testValidateToken = async () => {
        setIsLoading(true);
        try {
            const result = await gistService.validateToken(token);

            if (result.valid) {
                setTestResults(prev => [...prev, {
                    success: true,
                    message: `Token 验证成功`,
                    details: {
                        username: result.username,
                        avatarUrl: result.avatarUrl,
                    }
                }]);
            } else {
                setTestResults(prev => [...prev, {
                    success: false,
                    message: `Token 验证失败: ${result.error}`,
                }]);
            }
        } catch (error) {
            setTestResults(prev => [...prev, {
                success: false,
                message: `Token 验证异常: ${error instanceof Error ? error.message : '未知错误'}`,
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 测试 2: 验证 Gist 拥有者
    const testVerifyOwnership = async () => {
        setIsLoading(true);
        try {
            const result = await gistService.verifyGistOwnership(gistId, token);

            if (result.isOwner) {
                setTestResults(prev => [...prev, {
                    success: true,
                    message: `✅ 你是 Gist 的拥有者`,
                    details: {
                        ownerUsername: result.ownerUsername,
                    }
                }]);
            } else {
                setTestResults(prev => [...prev, {
                    success: false,
                    message: `❌ 你不是 Gist 的拥有者`,
                    details: {
                        ownerUsername: result.ownerUsername,
                        error: result.error,
                    }
                }]);
            }
        } catch (error) {
            setTestResults(prev => [...prev, {
                success: false,
                message: `拥有者验证异常: ${error instanceof Error ? error.message : '未知错误'}`,
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 测试 3: 获取 Gist 信息
    const testGetGist = async () => {
        setIsLoading(true);
        try {
            const data = await gistService.getGist(gistId, token);

            setTestResults(prev => [...prev, {
                success: true,
                message: `Gist 数据获取成功`,
                details: {
                    resourcesCount: data.resources.length,
                    questionsCount: data.questions.length,
                    lastSync: data.metadata.lastSync,
                    owner: data.metadata.owner,
                }
            }]);
        } catch (error) {
            setTestResults(prev => [...prev, {
                success: false,
                message: `Gist 数据获取失败: ${error instanceof Error ? error.message : '未知错误'}`,
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 测试 4: 完整的模式切换流程模拟
    const testModeSwitchFlow = async () => {
        setIsLoading(true);
        const results: TestResult[] = [];

        try {
            // Step 1: 验证 Token
            results.push({ success: true, message: '步骤 1: 开始验证 Token...' });
            const tokenValidation = await gistService.validateToken(token);

            if (!tokenValidation.valid) {
                results.push({
                    success: false,
                    message: `步骤 1 失败: Token 无效 - ${tokenValidation.error}`,
                });
                setTestResults(prev => [...prev, ...results]);
                return;
            }

            results.push({
                success: true,
                message: `步骤 1 成功: Token 有效 (用户: ${tokenValidation.username})`,
            });

            // Step 2: 检查是否有 Gist ID
            if (!gistId) {
                results.push({
                    success: true,
                    message: '步骤 2: 没有 Gist ID，跳过拥有者验证（允许切换到拥有者模式）',
                });
                results.push({
                    success: true,
                    message: '✅ 模式切换流程通过：可以切换到拥有者模式',
                });
                setTestResults(prev => [...prev, ...results]);
                return;
            }

            // Step 3: 验证 Gist 拥有者
            results.push({ success: true, message: '步骤 2: 开始验证 Gist 拥有者...' });
            const ownershipCheck = await gistService.verifyGistOwnership(gistId, token);

            if (!ownershipCheck.isOwner) {
                results.push({
                    success: false,
                    message: `步骤 2 失败: 你不是 Gist 的拥有者 (拥有者: ${ownershipCheck.ownerUsername})`,
                });
                results.push({
                    success: false,
                    message: '❌ 模式切换流程失败：无法切换到拥有者模式',
                });
                setTestResults(prev => [...prev, ...results]);
                return;
            }

            results.push({
                success: true,
                message: `步骤 2 成功: 你是 Gist 的拥有者`,
            });

            // Step 4: 模拟用户确认
            results.push({
                success: true,
                message: '步骤 3: 等待用户确认（在实际应用中会显示确认对话框）',
            });

            results.push({
                success: true,
                message: '✅ 模式切换流程通过：可以切换到拥有者模式',
            });

        } catch (error) {
            results.push({
                success: false,
                message: `流程异常: ${error instanceof Error ? error.message : '未知错误'}`,
            });
        } finally {
            setTestResults(prev => [...prev, ...results]);
            setIsLoading(false);
        }
    };

    // 清除测试结果
    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Gist 拥有者验证测试
                    </h1>
                    <p className="text-gray-600 mb-6">
                        测试从访问者模式切换到拥有者模式时的验证逻辑
                    </p>

                    {/* 输入区域 */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Key size={16} />
                                GitHub Token
                            </label>
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FileText size={16} />
                                Gist ID
                            </label>
                            <input
                                type="text"
                                value={gistId}
                                onChange={(e) => setGistId(e.target.value)}
                                placeholder="abc123def456..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                留空以测试没有 Gist ID 的场景
                            </p>
                        </div>

                        <button
                            onClick={loadCurrentData}
                            className="text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                            从当前会话加载 Token 和 Gist ID
                        </button>
                    </div>

                    {/* 测试按钮 */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={testValidateToken}
                            disabled={!token || isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            测试 1: 验证 Token
                        </button>

                        <button
                            onClick={testVerifyOwnership}
                            disabled={!token || !gistId || isLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            测试 2: 验证拥有者
                        </button>

                        <button
                            onClick={testGetGist}
                            disabled={!token || !gistId || isLoading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            测试 3: 获取 Gist
                        </button>

                        <button
                            onClick={testModeSwitchFlow}
                            disabled={!token || isLoading}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            测试 4: 完整流程
                        </button>
                    </div>

                    <button
                        onClick={clearResults}
                        disabled={testResults.length === 0}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        清除结果
                    </button>
                </div>

                {/* 加载状态 */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <LoadingState message="测试进行中..." />
                    </div>
                )}

                {/* 测试结果 */}
                {testResults.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">测试结果</h2>
                        <div className="space-y-3">
                            {testResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${result.success
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {result.success ? (
                                            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                        ) : (
                                            <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                        )}
                                        <div className="flex-1">
                                            <p className={`font-medium ${result.success ? 'text-green-900' : 'text-red-900'
                                                }`}>
                                                {result.message}
                                            </p>
                                            {result.details && (
                                                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
                                                    {JSON.stringify(result.details, null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 测试说明 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">测试场景说明</h3>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>
                                    <strong>场景 1 - 拥有者切换：</strong>
                                    使用你自己的 Token 和你自己创建的 Gist ID，应该验证通过
                                </li>
                                <li>
                                    <strong>场景 2 - 非拥有者尝试切换：</strong>
                                    使用你的 Token，但使用别人的 Gist ID（通过分享链接获得），应该验证失败
                                </li>
                                <li>
                                    <strong>场景 3 - 没有 Gist ID：</strong>
                                    只输入 Token，不输入 Gist ID，应该跳过拥有者验证（允许切换）
                                </li>
                                <li>
                                    <strong>场景 4 - Token 无效：</strong>
                                    使用过期或错误的 Token，应该在第一步就失败
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
