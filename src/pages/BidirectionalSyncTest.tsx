/**
 * 双向同步功能测试页面
 * 用于测试新实现的 Pull 和双向同步功能
 */

import { useState } from 'react';
import { syncService } from '@/services/syncService';
import { dataComparator } from '@/services/dataComparator';
import { conflictResolver } from '@/services/conflictResolver';
import { syncCoordinator } from '@/services/syncCoordinator';
import { authService } from '@/services/authService';
import { DataComparisonDialog } from '@/components/sync/DataComparisonDialog';
import type { SyncCheckResult, DataComparisonResult } from '@/types/sync';

export default function BidirectionalSyncTest() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const [checkResult, setCheckResult] = useState<SyncCheckResult | null>(null);
    const [showComparisonDialog, setShowComparisonDialog] = useState(false);
    const [comparisonData, setComparisonData] = useState<DataComparisonResult | null>(null);

    const addLog = (message: string) => {
        setResult((prev) => prev + '\n' + message);
        console.log(message);
    };

    // 测试 1：检查云端更新
    const testCheckForUpdates = async () => {
        setLoading(true);
        setResult('');
        addLog('=== 测试 1：检查云端更新 ===');

        try {
            addLog('检查认证状态...');
            if (!authService.isAuthenticated()) {
                addLog('❌ 未认证，请先配置 Token');
                return;
            }

            const gistId = authService.getGistId();
            addLog(`✓ 已认证，Gist ID: ${gistId}`);

            addLog('\n开始检查云端更新...');
            const result = await syncService.checkForUpdates();

            setCheckResult(result);

            if (result.error) {
                addLog(`❌ 检查失败: ${result.error}`);
                return;
            }

            if (result.hasUpdates) {
                addLog('✓ 云端有更新！');
                if (result.comparison) {
                    addLog('\n数据对比：');
                    addLog(`本地 - 资源: ${result.comparison.local.resourceCount}, 问题: ${result.comparison.local.questionCount}`);
                    addLog(`云端 - 资源: ${result.comparison.remote.resourceCount}, 问题: ${result.comparison.remote.questionCount}`);
                    addLog(`\n差异：`);
                    addLog(`  资源: ${result.comparison.differences.resources > 0 ? '+' : ''}${result.comparison.differences.resources}`);
                    addLog(`  问题: ${result.comparison.differences.questions > 0 ? '+' : ''}${result.comparison.differences.questions}`);
                    addLog(`\n建议操作: ${result.comparison.recommendation}`);
                }
            } else {
                addLog('✓ 数据已是最新，无需同步');
            }
        } catch (error) {
            addLog(`❌ 错误: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    // 测试 2：从云端拉取数据
    const testPullFromCloud = async () => {
        setLoading(true);
        setResult('');
        addLog('=== 测试 2：从云端拉取数据 ===');

        try {
            addLog('开始从云端拉取数据...');
            const result = await syncService.pullFromCloud();

            if (result.success) {
                addLog('✓ 拉取成功！');
                addLog(`时间: ${result.timestamp}`);
            } else {
                addLog(`❌ 拉取失败: ${result.error}`);
            }
        } catch (error) {
            addLog(`❌ 错误: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    // 测试 3：双向同步
    const testBidirectionalSync = async () => {
        setLoading(true);
        setResult('');
        addLog('=== 测试 3：双向同步 ===');

        try {
            addLog('开始双向同步（先 Pull 后 Push）...');
            const result = await syncService.bidirectionalSync();

            if (result.success) {
                addLog('✓ 双向同步成功！');
                addLog(`时间: ${result.timestamp}`);
                if (result.changes) {
                    addLog(`变更: +${result.changes.added} ~${result.changes.updated} -${result.changes.deleted}`);
                }
            } else {
                addLog(`❌ 双向同步失败: ${result.error}`);
            }
        } catch (error) {
            addLog(`❌ 错误: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    // 测试 4：数据对比器
    const testDataComparator = async () => {
        setLoading(true);
        setResult('');
        addLog('=== 测试 4：数据对比器 ===');

        try {
            addLog('生成本地数据统计...');
            // 这里需要获取本地数据，简化测试
            const mockLocalData = {
                resources: Array(5).fill({}),
                questions: Array(3).fill({}),
                subQuestions: [],
                answers: [],
                metadata: { version: '1.0.0', lastSync: new Date().toISOString(), owner: 'test' },
            };

            const localStats = dataComparator.generateStatistics(mockLocalData as any);
            addLog(`本地统计: ${JSON.stringify(localStats, null, 2)}`);

            const mockRemoteStats = {
                resourceCount: 7,
                questionCount: 4,
                subQuestionCount: 0,
                answerCount: 0,
                lastModified: new Date().toISOString(),
            };

            addLog('\n比较本地和云端数据...');
            const comparison = dataComparator.compare(mockLocalData as any, mockRemoteStats);

            addLog(`\n对比结果:`);
            addLog(`  有变化: ${comparison.hasChanges}`);
            addLog(`  差异: ${JSON.stringify(comparison.differences, null, 2)}`);
            addLog(`  建议: ${comparison.recommendation}`);
            addLog(`  摘要: ${dataComparator.getComparisonSummary(comparison)}`);
        } catch (error) {
            addLog(`❌ 错误: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    // 测试 5：冲突解决器
    const testConflictResolver = async () => {
        setLoading(true);
        setResult('');
        addLog('=== 测试 5：冲突解决器 ===');

        try {
            const mockLocalData = {
                resources: [{ id: '1', title: 'Local Resource', updatedAt: '2025-01-01' }],
                questions: [],
                subQuestions: [],
                answers: [],
                metadata: { version: '1.0.0', lastSync: '2025-01-01', owner: 'test' },
            };

            const mockRemoteData = {
                resources: [{ id: '1', title: 'Remote Resource', updatedAt: '2025-01-02' }],
                questions: [],
                subQuestions: [],
                answers: [],
                metadata: { version: '1.0.0', lastSync: '2025-01-02', owner: 'test' },
            };

            addLog('检测冲突...');
            const conflictInfo = conflictResolver.detectConflict(
                mockLocalData as any,
                mockRemoteData as any,
                []
            );

            addLog(`冲突检测结果: ${conflictResolver.getConflictDescription(conflictInfo)}`);

            if (conflictInfo.hasConflict) {
                addLog('\n测试智能合并...');
                const merged = conflictResolver.smartMerge(
                    mockLocalData as any,
                    mockRemoteData as any
                );
                addLog(`合并后资源数: ${merged.resources.length}`);
                addLog(`合并后资源标题: ${merged.resources[0].title}`);
            }

            addLog('\n推荐策略: ' + conflictResolver.getRecommendedStrategy(conflictInfo));
        } catch (error) {
            addLog(`❌ 错误: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    // 测试 6：显示数据对比对话框
    const testComparisonDialog = () => {
        const mockComparison: DataComparisonResult = {
            hasChanges: true,
            local: {
                resourceCount: 10,
                questionCount: 5,
                subQuestionCount: 8,
                answerCount: 15,
                lastModified: new Date(Date.now() - 3600000).toISOString(), // 1小时前
            },
            remote: {
                resourceCount: 12,
                questionCount: 4,
                subQuestionCount: 8,
                answerCount: 16,
                lastModified: new Date().toISOString(),
            },
            differences: {
                resources: 2,
                questions: -1,
                subQuestions: 0,
                answers: 1,
            },
            recommendation: 'pull',
        };

        setComparisonData(mockComparison);
        setShowComparisonDialog(true);
        addLog('=== 测试 6：显示数据对比对话框 ===');
        addLog('✓ 对话框已打开，请查看界面');
    };

    // 测试 7：测试 SyncCoordinator
    const testSyncCoordinator = async () => {
        setLoading(true);
        setResult('');
        addLog('=== 测试 7：测试 SyncCoordinator ===');

        try {
            addLog('获取同步偏好设置...');
            const prefs = await syncCoordinator.getPreferences();
            addLog(`偏好设置: ${JSON.stringify(prefs, null, 2)}`);

            addLog('\n检查当前状态...');
            addLog(`正在检查: ${syncCoordinator.isCurrentlyChecking()}`);

            const lastResult = syncCoordinator.getLastCheckResult();
            addLog(`最后检查结果: ${lastResult ? '有结果' : '无结果'}`);

            addLog('\n✓ SyncCoordinator 测试完成');
        } catch (error) {
            addLog(`❌ 错误: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    // 处理对话框确认
    const handleDialogConfirm = async (action: 'sync' | 'skip' | 'auto') => {
        setShowComparisonDialog(false);
        addLog(`\n用户选择: ${action}`);

        if (action === 'sync' || action === 'auto') {
            addLog('开始同步...');
            try {
                const result = await syncService.pullFromCloud();
                if (result.success) {
                    addLog('✓ 同步成功！');
                } else {
                    addLog(`❌ 同步失败: ${result.error}`);
                }
            } catch (error) {
                addLog(`❌ 同步异常: ${error instanceof Error ? error.message : String(error)}`);
            }
        } else {
            addLog('用户选择稍后同步');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">双向同步功能测试</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">测试按钮</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={testCheckForUpdates}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                        >
                            1. 检查云端更新
                        </button>
                        <button
                            onClick={testPullFromCloud}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                        >
                            2. 从云端拉取
                        </button>
                        <button
                            onClick={testBidirectionalSync}
                            disabled={loading}
                            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300"
                        >
                            3. 双向同步
                        </button>
                        <button
                            onClick={testDataComparator}
                            disabled={loading}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300"
                        >
                            4. 测试数据对比
                        </button>
                        <button
                            onClick={testConflictResolver}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                        >
                            5. 测试冲突解决
                        </button>
                        <button
                            onClick={testComparisonDialog}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-300"
                        >
                            6. 对比对话框
                        </button>
                        <button
                            onClick={testSyncCoordinator}
                            disabled={loading}
                            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:bg-gray-300"
                        >
                            7. SyncCoordinator
                        </button>
                    </div>
                </div>

                {checkResult && checkResult.comparison && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">数据对比结果</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2">本地数据</h3>
                                <p>资源: {checkResult.comparison.local.resourceCount}</p>
                                <p>问题: {checkResult.comparison.local.questionCount}</p>
                                <p>子问题: {checkResult.comparison.local.subQuestionCount}</p>
                                <p>答案: {checkResult.comparison.local.answerCount}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">云端数据</h3>
                                <p>资源: {checkResult.comparison.remote.resourceCount}</p>
                                <p>问题: {checkResult.comparison.remote.questionCount}</p>
                                <p>子问题: {checkResult.comparison.remote.subQuestionCount}</p>
                                <p>答案: {checkResult.comparison.remote.answerCount}</p>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 rounded">
                            <p className="font-semibold">
                                建议操作: {checkResult.comparison.recommendation}
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">测试日志</h2>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96 text-sm font-mono whitespace-pre-wrap">
                        {result || '点击上方按钮开始测试...'}
                    </pre>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">测试说明</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>测试前请确保已配置 Token 和 Gist ID</li>
                        <li>测试 1 会检查云端是否有更新，并显示数据对比</li>
                        <li>测试 2 会从云端拉取最新数据到本地</li>
                        <li>测试 3 会执行双向同步（先拉取后推送）</li>
                        <li>测试 4 和 5 使用模拟数据测试对比和冲突解决逻辑</li>
                        <li>测试 6 显示数据对比对话框（UI 组件测试）</li>
                        <li>测试 7 测试 SyncCoordinator 的偏好设置和状态</li>
                    </ul>
                </div>
            </div>

            {/* 数据对比对话框 */}
            {comparisonData && (
                <DataComparisonDialog
                    open={showComparisonDialog}
                    comparison={comparisonData}
                    onConfirm={handleDialogConfirm}
                    onClose={() => setShowComparisonDialog(false)}
                />
            )}
        </div>
    );
}
