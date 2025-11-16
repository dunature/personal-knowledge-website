/**
 * GitHub Gist 集成测试页面
 * 测试所有核心功能
 */

import React, { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { cacheService } from '@/services/cacheService';
import { syncService } from '@/services/syncService';
import { migrationService } from '@/services/migrationService';
import { permissionService } from '@/services/permissionService';
import { ModeIndicator } from '@/components/common/ModeIndicator';
import { SyncIndicator } from '@/components/sync/SyncIndicator';
import SetupWizard from '@/components/setup/SetupWizard';
import { MigrationWizard } from '@/components/setup/MigrationWizard';
export const GistIntegrationTest: React.FC = () => {
    const [testResults, setTestResults] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [showSetup, setShowSetup] = useState(false);
    const [showMigration, setShowMigration] = useState(false);

    useEffect(() => {
        // 初始化 AuthService
        authService.initialize();
    }, []);

    const runTest = async (testName: string, testFn: () => Promise<any>) => {
        setLoading(true);
        try {
            const result = await testFn();
            setTestResults(prev => ({
                ...prev,
                [testName]: { success: true, result }
            }));
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                [testName]: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
            }));
        } finally {
            setLoading(false);
        }
    };

    // 测试 1: 加密工具
    const testCrypto = async () => {
        const { encryptToken, decryptToken } = await import('@/utils/cryptoUtils');
        const testToken = 'ghp_test123456789';
        const encrypted = await encryptToken(testToken);
        const decrypted = await decryptToken(encrypted);
        return { encrypted: encrypted.substring(0, 20) + '...', decrypted, match: testToken === decrypted };
    };

    // 测试 2: AuthService
    const testAuthService = async () => {
        const mode = authService.getMode();
        const isAuth = authService.isAuthenticated();
        const user = await authService.getCurrentUser();
        const gistId = authService.getGistId();
        return { mode, isAuth, user, gistId };
    };

    // 测试 3: CacheService
    const testCacheService = async () => {
        const testData = { test: 'data', timestamp: Date.now() };
        await cacheService.saveData('test_key', testData);
        const retrieved = await cacheService.getData('test_key');
        const cacheInfo = await cacheService.getCacheInfo();
        await cacheService.clearData('test_key');
        return { saved: testData, retrieved, cacheInfo };
    };

    // 测试 4: PermissionService
    const testPermissionService = () => {
        return {
            canCreate: permissionService.canCreate(),
            canEdit: permissionService.canEdit(),
            canDelete: permissionService.canDelete(),
            canSync: permissionService.canSync(),
            mode: permissionService.getCurrentMode(),
            isOwner: permissionService.isOwnerMode(),
            isVisitor: permissionService.isVisitorMode(),
        };
    };

    // 测试 5: MigrationService
    const testMigrationService = async () => {
        const localData = await migrationService.detectLocalData();
        const needsMigration = await migrationService.needsMigration();
        return { localData, needsMigration };
    };

    // 测试 6: SyncService 状态
    const testSyncService = async () => {
        const status = syncService.getSyncStatus();
        const lastSync = await syncService.getLastSyncTime();
        return { status, lastSync };
    };

    // 手动同步测试
    // const testManualSync = async () => {
    //     const result = await syncService.syncNow();
    //     const newLastSync = await syncService.getLastSyncTime();
    //     setLastSyncTime(newLastSync);
    //     return result;
    // };

    const clearAllTests = () => {
        setTestResults({});
    };

    const clearAllData = async () => {
        if (confirm('确定要清除所有数据吗？这将删除 Token、缓存和配置。')) {
            await authService.clearAll();
            await cacheService.clearAll();
            alert('所有数据已清除');
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    GitHub Gist 集成测试
                </h1>

                {/* 状态指示器 */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">模式状态</h3>
                        <ModeIndicator />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">同步状态</h3>
                        <SyncIndicator showButton={true} />
                    </div>
                </div>

                {/* 快速操作 */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">快速操作</h2>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowSetup(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            打开配置向导
                        </button>
                        <button
                            onClick={() => setShowMigration(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            打开迁移向导
                        </button>
                        <button
                            onClick={clearAllData}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            清除所有数据
                        </button>
                        <button
                            onClick={clearAllTests}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            清除测试结果
                        </button>
                    </div>
                </div>

                {/* 测试按钮 */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">功能测试</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <button
                            onClick={() => runTest('加密工具', testCrypto)}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            1. 测试加密工具
                        </button>
                        <button
                            onClick={() => runTest('AuthService', testAuthService)}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            2. 测试 AuthService
                        </button>
                        <button
                            onClick={() => runTest('CacheService', testCacheService)}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            3. 测试 CacheService
                        </button>
                        <button
                            onClick={() => runTest('PermissionService', () => Promise.resolve(testPermissionService()))}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            4. 测试 PermissionService
                        </button>
                        <button
                            onClick={() => runTest('MigrationService', testMigrationService)}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            5. 测试 MigrationService
                        </button>
                        <button
                            onClick={() => runTest('SyncService', testSyncService)}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            6. 测试 SyncService
                        </button>
                    </div>
                </div>

                {/* 测试结果 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">测试结果</h2>
                    {Object.keys(testResults).length === 0 ? (
                        <p className="text-gray-500">点击上方按钮开始测试</p>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(testResults).map(([name, result]) => (
                                <div
                                    key={name}
                                    className={`p-4 rounded-lg border-2 ${result.success
                                        ? 'border-green-200 bg-green-50'
                                        : 'border-red-200 bg-red-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{name}</h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${result.success
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {result.success ? '✓ 成功' : '✗ 失败'}
                                        </span>
                                    </div>
                                    <pre className="text-sm bg-white p-3 rounded overflow-auto max-h-60">
                                        {JSON.stringify(result.success ? result.result : result.error, null, 2)}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 配置向导模态框 */}
                {showSetup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-xl font-semibold">配置向导</h2>
                                <button
                                    onClick={() => setShowSetup(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            <SetupWizard
                                onComplete={() => {
                                    setShowSetup(false);
                                    alert('配置完成！');
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* 迁移向导模态框 */}
                {showMigration && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-xl font-semibold">数据迁移</h2>
                                <button
                                    onClick={() => setShowMigration(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            <MigrationWizard
                                onComplete={(gistId) => {
                                    setShowMigration(false);
                                    alert(`迁移完成！Gist ID: ${gistId}`);
                                }}
                                onSkip={() => {
                                    setShowMigration(false);
                                    alert('已跳过迁移');
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GistIntegrationTest;
