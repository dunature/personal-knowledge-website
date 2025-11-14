/**
 * 同步调试页面
 * 用于调试和测试同步功能
 */

import { useState, useEffect } from 'react';
import { syncService } from '@/services/syncService';
import { authService } from '@/services/authService';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { useToast } from '@/hooks/useToast';

export default function SyncDebugPage() {
    const { showToast } = useToast();
    const [debugInfo, setDebugInfo] = useState<any>({});
    const [syncing, setSyncing] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
        console.log(message);
    };

    const loadDebugInfo = async () => {
        try {
            addLog('开始加载调试信息...');

            const info: any = {};

            // 认证信息
            info.isAuthenticated = authService.isAuthenticated();
            info.mode = authService.getMode();
            info.gistId = authService.getGistId();
            info.hasToken = !!(await authService.getToken());

            // 用户信息
            try {
                info.user = await authService.getCurrentUser();
            } catch (error) {
                info.user = null;
                info.userError = error instanceof Error ? error.message : String(error);
            }

            // 同步状态
            info.syncStatus = syncService.getSyncStatus();
            info.lastSyncTime = await syncService.getLastSyncTime();
            info.pendingChanges = await syncService.getPendingChangesCount();
            info.hasPendingChanges = await syncService.hasPendingChanges();

            // 数据统计
            const resources = (await cacheService.getData(STORAGE_KEYS.RESOURCES)) || [];
            const questions = (await cacheService.getData(STORAGE_KEYS.QUESTIONS)) || [];
            const subQuestions = (await cacheService.getData(STORAGE_KEYS.SUB_QUESTIONS)) || [];
            const answers = (await cacheService.getData(STORAGE_KEYS.ANSWERS)) || [];

            info.dataStats = {
                resources: Array.isArray(resources) ? resources.length : 0,
                questions: Array.isArray(questions) ? questions.length : 0,
                subQuestions: Array.isArray(subQuestions) ? subQuestions.length : 0,
                answers: Array.isArray(answers) ? answers.length : 0,
            };

            // 网络状态
            info.isOnline = navigator.onLine;

            setDebugInfo(info);
            addLog('调试信息加载完成');
        } catch (error) {
            addLog(`加载调试信息失败: ${error instanceof Error ? error.message : String(error)}`);
            console.error('加载调试信息失败:', error);
        }
    };

    useEffect(() => {
        loadDebugInfo();
    }, []);

    const handleTestSync = async () => {
        try {
            setSyncing(true);
            addLog('开始测试同步...');

            // 检查前置条件
            if (!authService.isAuthenticated()) {
                addLog('❌ 未认证');
                showToast('error', '未认证，无法同步');
                return;
            }

            const token = await authService.getToken();
            if (!token) {
                addLog('❌ Token 不可用');
                showToast('error', 'Token 不可用');
                return;
            }

            const gistId = authService.getGistId();
            addLog(`✓ 认证状态: ${authService.isAuthenticated()}`);
            addLog(`✓ Token: ${token ? '已配置' : '未配置'}`);
            addLog(`✓ Gist ID: ${gistId || '未配置'}`);
            addLog(`✓ 网络状态: ${navigator.onLine ? '在线' : '离线'}`);

            // 执行同步
            addLog('调用 syncService.syncNow()...');
            const result = await syncService.syncNow();

            if (result.success) {
                addLog('✓ 同步成功');
                addLog(`同步时间: ${result.timestamp}`);
                if (result.changes) {
                    addLog(
                        `变更统计: 新增 ${result.changes.added}, 更新 ${result.changes.updated}, 删除 ${result.changes.deleted}`
                    );
                }
                showToast('success', '同步成功');
            } else {
                addLog(`❌ 同步失败: ${result.error}`);
                showToast('error', `同步失败: ${result.error}`);
            }

            // 重新加载调试信息
            await loadDebugInfo();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            addLog(`❌ 同步异常: ${errorMessage}`);
            console.error('同步测试失败:', error);
            showToast('error', `同步异常: ${errorMessage}`);
        } finally {
            setSyncing(false);
        }
    };

    const handleClearLogs = () => {
        setLogs([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">同步调试工具</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 调试信息 */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">调试信息</h2>
                            <button
                                onClick={loadDebugInfo}
                                className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                            >
                                刷新
                            </button>
                        </div>

                        <div className="space-y-2 text-sm font-mono">
                            <div className="bg-gray-50 p-3 rounded">
                                <pre className="whitespace-pre-wrap break-words">
                                    {JSON.stringify(debugInfo, null, 2)}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <button
                                onClick={handleTestSync}
                                disabled={syncing}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {syncing ? '同步中...' : '测试同步'}
                            </button>
                        </div>
                    </div>

                    {/* 日志 */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">操作日志</h2>
                            <button
                                onClick={handleClearLogs}
                                className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                            >
                                清除
                            </button>
                        </div>

                        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs h-96 overflow-y-auto">
                            {logs.length === 0 ? (
                                <div className="text-gray-500">暂无日志</div>
                            ) : (
                                logs.map((log, index) => (
                                    <div key={index} className="mb-1">
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* 快速操作 */}
                <div className="mt-6 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={async () => {
                                const changes = await syncService.getPendingChanges();
                                addLog(`待同步变更: ${JSON.stringify(changes, null, 2)}`);
                            }}
                            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                        >
                            查看待同步变更
                        </button>

                        <button
                            onClick={async () => {
                                await syncService.clearAllPendingChanges();
                                addLog('已清除所有待同步变更');
                                await loadDebugInfo();
                            }}
                            className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
                        >
                            清除待同步变更
                        </button>

                        <button
                            onClick={async () => {
                                const result = await syncService.syncFromGist();
                                if (result.success) {
                                    addLog('✓ 从 Gist 拉取成功');
                                    showToast('success', '拉取成功');
                                } else {
                                    addLog(`❌ 从 Gist 拉取失败: ${result.error}`);
                                    showToast('error', `拉取失败: ${result.error}`);
                                }
                                await loadDebugInfo();
                            }}
                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                        >
                            从 Gist 拉取
                        </button>

                        <button
                            onClick={async () => {
                                const token = await authService.getToken();
                                addLog(`Token: ${token ? '已配置 (长度: ' + token.length + ')' : '未配置'}`);
                            }}
                            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                        >
                            检查 Token
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
