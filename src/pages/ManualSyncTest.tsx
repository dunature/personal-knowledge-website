/**
 * 手动同步模式测试页面
 * 用于调试和验证手动同步功能
 */

import React, { useState, useEffect } from 'react';
import { syncService } from '@/services/syncService';
import { useAuth } from '@/contexts/AuthContext';
import { useResources } from '@/contexts/ResourceContext';
import type { Resource } from '@/types/resource';

export const ManualSyncTest: React.FC = () => {
    const { mode, isAuthenticated } = useAuth();
    const { addResource } = useResources();
    const [pendingChanges, setPendingChanges] = useState<any[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
        console.log(`[ManualSyncTest] ${message}`);
    };

    // 检查待同步变更
    const checkPending = async () => {
        try {
            const pending = await syncService.getPendingChanges();
            const count = await syncService.getPendingChangesCount();
            setPendingChanges(pending);
            addLog(`检查完成：${count} 个待同步变更`);
        } catch (error) {
            addLog(`检查失败：${error}`);
        }
    };

    useEffect(() => {
        addLog('页面加载');
        addLog(`当前模式：${mode}`);
        addLog(`是否认证：${isAuthenticated}`);
        checkPending();
    }, []);

    // 测试添加资源
    const handleAddTestResource = () => {
        addLog('开始添加测试资源');

        const now = new Date().toISOString();
        const testResource: Resource = {
            id: `test-${Date.now()}`,
            title: `测试资源 ${new Date().toLocaleTimeString()}`,
            url: 'https://example.com',
            type: 'blog',
            cover: 'https://via.placeholder.com/300x200',
            platform: 'Web',
            content_tags: ['测试'],
            category: '测试分类',
            author: '测试作者',
            recommendation: '这是一个测试资源',
            metadata: {},
            created_at: now,
            updated_at: now,
        };

        addLog(`资源 ID：${testResource.id}`);
        addLog(`当前模式：${mode}`);

        try {
            addResource(testResource);
            addLog('资源添加成功');

            // 延迟检查，等待异步操作完成
            setTimeout(() => {
                addLog('延迟检查待同步变更');
                checkPending();
            }, 1000);
        } catch (error) {
            addLog(`资源添加失败：${error}`);
        }
    };

    // 检查 LocalStorage
    const handleCheckLocalStorage = () => {
        addLog('检查 LocalStorage');

        try {
            const pendingStr = localStorage.getItem('PENDING_CHANGES');
            const pending = pendingStr ? JSON.parse(pendingStr) : [];
            addLog(`LocalStorage 中的待同步变更：${pending.length} 个`);

            const resources = localStorage.getItem('resources');
            const resourcesData = resources ? JSON.parse(resources) : [];
            addLog(`LocalStorage 中的资源：${resourcesData.length} 个`);

            const modeStr = localStorage.getItem('app_mode');
            addLog(`LocalStorage 中的模式：${modeStr}`);
        } catch (error) {
            addLog(`检查 LocalStorage 失败：${error}`);
        }
    };

    // 手动同步
    const handleManualSync = async () => {
        addLog('开始手动同步');

        try {
            const result = await syncService.syncNow();
            if (result.success) {
                addLog('同步成功');
            } else {
                addLog(`同步失败：${result.error}`);
            }

            setTimeout(checkPending, 500);
        } catch (error) {
            addLog(`同步异常：${error}`);
        }
    };

    // 清除待同步变更
    const handleClearPending = async () => {
        addLog('清除待同步变更');

        try {
            await syncService.clearAllPendingChanges();
            addLog('清除成功');
            checkPending();
        } catch (error) {
            addLog(`清除失败：${error}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">手动同步模式测试</h1>

                {/* 状态信息 */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">当前状态</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="font-medium">模式：</span>
                            <span className={mode === 'owner' ? 'text-blue-600' : 'text-gray-600'}>
                                {mode === 'owner' ? '拥有者' : '访客'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">认证状态：</span>
                            <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                                {isAuthenticated ? '已认证' : '未认证'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">待同步变更：</span>
                            <span className="text-orange-600 font-bold">
                                {pendingChanges.length} 个
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">网络状态：</span>
                            <span className={navigator.onLine ? 'text-green-600' : 'text-red-600'}>
                                {navigator.onLine ? '在线' : '离线'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 操作按钮 */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">操作</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleAddTestResource}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            添加测试资源
                        </button>
                        <button
                            onClick={checkPending}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            检查待同步变更
                        </button>
                        <button
                            onClick={handleCheckLocalStorage}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            检查 LocalStorage
                        </button>
                        <button
                            onClick={handleManualSync}
                            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                            disabled={!isAuthenticated || mode !== 'owner'}
                        >
                            手动同步
                        </button>
                        <button
                            onClick={handleClearPending}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            清除待同步变更
                        </button>
                    </div>
                </div>

                {/* 待同步变更列表 */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">待同步变更列表</h2>
                    {pendingChanges.length === 0 ? (
                        <p className="text-gray-500">暂无待同步变更</p>
                    ) : (
                        <div className="space-y-2">
                            {pendingChanges.map((change, index) => (
                                <div key={index} className="border rounded p-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${change.type === 'create' ? 'bg-green-100 text-green-800' :
                                                change.type === 'update' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {change.type}
                                        </span>
                                        <span className="font-medium">{change.entity}</span>
                                        <span className="text-gray-500 text-sm">{change.id}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(change.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 日志 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">操作日志</h2>
                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
                        {logs.length === 0 ? (
                            <p>暂无日志</p>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index}>{log}</div>
                            ))
                        )}
                    </div>
                    <button
                        onClick={() => setLogs([])}
                        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        清除日志
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManualSyncTest;
