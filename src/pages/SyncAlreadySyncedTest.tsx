/**
 * 同步已同步提示功能测试页面
 * 用于测试当数据已同步时点击同步按钮的提示功能
 */

import React, { useState } from 'react';
import { SyncIndicator } from '@/components/sync/SyncIndicator';
import { syncService } from '@/services/syncService';
import { useToast } from '@/hooks/useToast';

const SyncAlreadySyncedTest: React.FC = () => {
    const [checkResult, setCheckResult] = useState<{
        synced: boolean;
        reason?: string;
    } | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const { showSuccess, showError, showWarning } = useToast();

    const handleCheckSync = async () => {
        setIsChecking(true);
        try {
            const result = await syncService.isAlreadySynced();
            setCheckResult(result);
        } catch (error) {
            console.error('检查失败:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const handleSmartSync = async () => {
        try {
            const result = await syncService.smartSync();
            console.log('智能同步结果:', result);

            // 显示 Toast 提示
            if (result.skipped) {
                if (result.skipReason === 'already_synced') {
                    showSuccess('数据已是最新，无需同步');
                } else if (result.skipReason === 'offline') {
                    showWarning('当前处于离线状态，无法同步');
                }
            } else if (result.success) {
                showSuccess('同步成功');
            } else {
                showError(result.error || '同步失败');
            }
        } catch (error) {
            console.error('智能同步失败:', error);
            showError('同步异常，请稍后重试');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">同步已同步提示功能测试</h1>

                {/* 测试说明 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-blue-900">测试说明</h2>
                    <ul className="space-y-2 text-blue-800">
                        <li>• 点击"检查同步状态"查看当前数据是否已同步</li>
                        <li>• 点击"执行智能同步"测试智能同步功能</li>
                        <li>• 使用下方的同步指示器测试实际的同步按钮</li>
                        <li>• 如果数据已同步，应该看到"数据已是最新，无需同步"的提示</li>
                    </ul>
                </div>

                {/* 测试按钮 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">测试操作</h2>
                    <div className="space-y-4">
                        <div>
                            <button
                                onClick={handleCheckSync}
                                disabled={isChecking}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isChecking ? '检查中...' : '检查同步状态'}
                            </button>
                            {checkResult && (
                                <div className="mt-4 p-4 bg-gray-50 rounded border">
                                    <p className="font-semibold">
                                        状态: {checkResult.synced ? '✅ 已同步' : '❌ 未同步'}
                                    </p>
                                    {checkResult.reason && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            原因: {checkResult.reason}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                onClick={handleSmartSync}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                执行智能同步
                            </button>
                            <p className="text-sm text-gray-600 mt-2">
                                智能同步会先检查数据是否一致，如果一致则跳过同步
                            </p>
                        </div>
                    </div>
                </div>

                {/* 同步指示器 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">同步指示器</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        点击同步按钮测试实际的用户体验
                    </p>

                    {/* 网络状态调试信息 */}
                    <div className="mb-4 p-3 bg-gray-50 rounded border text-sm">
                        <p><strong>网络状态:</strong> {navigator.onLine ? '🟢 在线' : '🔴 离线'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            如果显示离线，请检查浏览器开发者工具的 Network 标签是否设置为 Offline 模式
                        </p>
                        {!navigator.onLine && (
                            <button
                                onClick={() => {
                                    window.dispatchEvent(new Event('online'));
                                    window.location.reload();
                                }}
                                className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                                模拟恢复在线状态并刷新
                            </button>
                        )}
                    </div>

                    <SyncIndicator showButton={true} />
                </div>

                {/* 测试场景 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">测试场景</h2>
                    <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="font-semibold text-green-900">场景 1: 数据已同步</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                预期: 显示绿色提示"数据已是最新，无需同步"
                            </p>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-4">
                            <h3 className="font-semibold text-orange-900">场景 2: 离线状态</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                预期: 显示橙色提示"当前处于离线状态，无法同步"
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                提示: 可以在浏览器开发者工具中模拟离线状态
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-blue-900">场景 3: 数据不一致</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                预期: 执行正常同步，显示"同步成功"或错误信息
                            </p>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                            <h3 className="font-semibold text-purple-900">场景 4: 防抖测试</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                预期: 1秒内重复点击同步按钮，只执行一次检查
                            </p>
                        </div>
                    </div>
                </div>

                {/* 性能指标 */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">性能指标</h2>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>• 缓存有效期: 30秒</li>
                        <li>• 防抖时间: 1秒</li>
                        <li>• Toast 持续时间: 3秒</li>
                        <li>• 检查响应时间: 应小于 1秒</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SyncAlreadySyncedTest;
