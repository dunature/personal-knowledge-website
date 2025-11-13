/**
 * Gist 服务测试页面
 * 测试 GistService、AuthService 和加密工具
 */

import React, { useState, useEffect } from 'react';
import { gistService } from '@/services/gistService';
import { authService } from '@/services/authService';
import { syncService } from '@/services/syncService';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { encryptToken, decryptToken } from '@/utils/cryptoUtils';
import { validateGistData } from '@/utils/dataValidation';
import type { GistData } from '@/types/gist';
import type { SyncStatus } from '@/types/sync';

const GistServiceTest: React.FC = () => {
    const [token, setToken] = useState('');
    const [gistId, setGistId] = useState('');
    const [testResults, setTestResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

    // 监听同步状态
    useEffect(() => {
        const unsubscribe = syncService.onSyncStatusChange((status) => {
            setSyncStatus(status);
        });
        return unsubscribe;
    }, []);

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

    // 测试 7: SyncService - 同步到 Gist
    const testSyncToGist = async () => {
        if (!token || !gistId) {
            addResult('请先配置 Token 和 Gist ID', true);
            return;
        }

        clearResults();
        setIsLoading(true);
        addResult('开始测试同步到 Gist...');

        try {
            // 先设置 Token 和 Gist ID
            await authService.setToken(token);
            authService.setGistId(gistId);

            // 准备测试数据
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, [
                {
                    id: 'sync_test_1',
                    title: '同步测试资源',
                    url: 'https://example.com',
                    type: 'blog',
                    cover: 'https://via.placeholder.com/320x180',
                    platform: 'Test',
                    content_tags: ['测试'],
                    category: '测试',
                    author: '测试作者',
                    recommendation: '这是同步测试',
                    metadata: {},
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ]);

            addResult('测试数据已准备');

            // 执行同步
            const result = await syncService.syncToGist();

            if (result.success) {
                addResult('同步到 Gist 成功！');
                addResult(`同步时间: ${result.timestamp}`);
            } else {
                addResult(`同步失败: ${result.error}`, true);
            }
        } catch (error) {
            addResult(`同步测试失败: ${error}`, true);
        } finally {
            setIsLoading(false);
        }
    };

    // 测试 8: SyncService - 从 Gist 同步
    const testSyncFromGist = async () => {
        if (!gistId) {
            addResult('请先输入 Gist ID', true);
            return;
        }

        clearResults();
        setIsLoading(true);
        addResult('开始测试从 Gist 同步...');

        try {
            authService.setGistId(gistId);

            const result = await syncService.syncFromGist();

            if (result.success) {
                addResult('从 Gist 同步成功！');
                addResult(`同步时间: ${result.timestamp}`);

                // 检查缓存数据
                const resources = await cacheService.getData(STORAGE_KEYS.RESOURCES);
                const questions = await cacheService.getData(STORAGE_KEYS.QUESTIONS);
                addResult(`已加载 ${(resources as any[])?.length || 0} 个资源`);
                addResult(`已加载 ${(questions as any[])?.length || 0} 个问题`);
            } else {
                addResult(`同步失败: ${result.error}`, true);
            }
        } catch (error) {
            addResult(`同步测试失败: ${error}`, true);
        } finally {
            setIsLoading(false);
        }
    };

    // 测试 9: 增量同步
    const testIncrementalSync = async () => {
        if (!token || !gistId) {
            addResult('请先配置 Token 和 Gist ID', true);
            return;
        }

        clearResults();
        setIsLoading(true);
        addResult('开始测试增量同步...');

        try {
            // 先设置 Token 和 Gist ID
            await authService.setToken(token);
            authService.setGistId(gistId);

            // 清除待同步变更
            await syncService.clearAllPendingChanges();
            addResult('已清除所有待同步变更');

            // 添加多个变更
            addResult('添加测试变更...');

            // 变更 1: 创建资源
            await syncService.addPendingChange({
                type: 'create',
                entity: 'resource',
                id: 'inc_test_1',
                data: {
                    id: 'inc_test_1',
                    title: '增量测试资源 1',
                    url: 'https://example.com/1',
                    type: 'blog',
                    cover: 'https://via.placeholder.com/320x180',
                    platform: 'Test',
                    content_tags: ['增量同步'],
                    category: '测试',
                    author: '测试作者',
                    recommendation: '增量同步测试',
                    metadata: {},
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                timestamp: new Date().toISOString(),
            });
            addResult('✓ 添加创建变更');

            // 变更 2: 更新同一资源（应该合并）
            await syncService.addPendingChange({
                type: 'update',
                entity: 'resource',
                id: 'inc_test_1',
                data: {
                    id: 'inc_test_1',
                    title: '增量测试资源 1 (已更新)',
                    url: 'https://example.com/1',
                    type: 'blog',
                    cover: 'https://via.placeholder.com/320x180',
                    platform: 'Test',
                    content_tags: ['增量同步', '已更新'],
                    category: '测试',
                    author: '测试作者',
                    recommendation: '增量同步测试 - 已更新',
                    metadata: {},
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                timestamp: new Date().toISOString(),
            });
            addResult('✓ 添加更新变更（应与创建合并）');

            // 变更 3: 创建另一个资源
            await syncService.addPendingChange({
                type: 'create',
                entity: 'resource',
                id: 'inc_test_2',
                data: {
                    id: 'inc_test_2',
                    title: '增量测试资源 2',
                    url: 'https://example.com/2',
                    type: 'video',
                    cover: 'https://via.placeholder.com/320x180',
                    platform: 'Test',
                    content_tags: ['增量同步'],
                    category: '测试',
                    author: '测试作者',
                    recommendation: '增量同步测试',
                    metadata: {},
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                timestamp: new Date().toISOString(),
            });
            addResult('✓ 添加第二个创建变更');

            // 检查待同步变更
            const pendingCount = await syncService.getPendingChangesCount();
            addResult(`待同步变更数量: ${pendingCount} (应该是 2，因为前两个已合并)`);

            const pendingChanges = await syncService.getPendingChanges();
            addResult(`变更详情: ${JSON.stringify(pendingChanges.map(c => ({ type: c.type, entity: c.entity, id: c.id })))}`);

            // 执行同步
            addResult('执行增量同步...');
            const result = await syncService.syncNow();

            if (result.success) {
                addResult('增量同步成功！');
                addResult(`同步时间: ${result.timestamp}`);
                if (result.changes) {
                    addResult(`变更统计: 新增 ${result.changes.added}, 更新 ${result.changes.updated}, 删除 ${result.changes.deleted}`);
                }

                // 验证待同步变更已清除
                const remainingCount = await syncService.getPendingChangesCount();
                addResult(`剩余待同步变更: ${remainingCount} (应该是 0)`);
            } else {
                addResult(`增量同步失败: ${result.error}`, true);
            }
        } catch (error) {
            addResult(`增量同步测试失败: ${error}`, true);
        } finally {
            setIsLoading(false);
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

                        <button
                            onClick={testSyncToGist}
                            disabled={isLoading || !token || !gistId}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            7. 同步到 Gist
                        </button>

                        <button
                            onClick={testSyncFromGist}
                            disabled={isLoading || !gistId}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            8. 从 Gist 同步
                        </button>

                        <button
                            onClick={testIncrementalSync}
                            disabled={isLoading || !token || !gistId}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                            9. 增量同步测试
                        </button>
                    </div>

                    {/* 同步状态指示器 */}
                    {syncStatus !== 'idle' && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                同步状态: <span className="font-semibold">{syncStatus}</span>
                            </p>
                        </div>
                    )}
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
                        <li>• 测试 7-8: 测试完整数据同步（上传和下载）</li>
                        <li>• 测试 9: 测试增量同步功能，包括变更合并和优化</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GistServiceTest;
