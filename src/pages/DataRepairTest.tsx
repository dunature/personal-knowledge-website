/**
 * Data Repair Test Page
 * 测试数据修复功能
 */

import { useState } from 'react';
import { dataDetector, repairAnalyzer, dataRepairer, errorReporter } from '@/services/repair';
import { useDataRepairSync } from '@/hooks/useDataRepairSync';
import { useIsolatedItemsManager } from '@/hooks/useIsolatedItemsManager';
import { RepairSuccessModal } from '@/components/repair/RepairSuccessModal';
import { IsolatedItemsView } from '@/components/repair/IsolatedItemsView';

export default function DataRepairTest() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [storageInfo, setStorageInfo] = useState<string>('');
    const [testData, setTestData] = useState<any>(null);
    const [repairPlan, setRepairPlan] = useState<any>(null);
    const [showIsolatedItems, setShowIsolatedItems] = useState(false);

    const {
        isRepairing,
        lastResult: syncRepairResult,
        error: repairSyncError,
        showSuccessModal,
        repairAndSync,
        autoRepairSafe,
        checkDataHealth,
        getBackups,
        clearError,
        showSuccessDetails,
        hideSuccessDetails
    } = useDataRepairSync();

    const {
        isolatedItems,
        fixItem,
        revalidateAll,
        setIsolatedItems
    } = useIsolatedItemsManager();

    const checkLocalStorage = () => {
        const keys = Object.keys(localStorage);
        let info = `LocalStorage 中的所有键 (${keys.length} 个):\n`;
        keys.forEach((key) => {
            const value = localStorage.getItem(key);
            const size = value ? value.length : 0;
            info += `- ${key}: ${size} 字符\n`;
            if (key.includes('gist') || key.includes('data') || key.includes('question')) {
                info += `  内容预览: ${value?.substring(0, 100)}...\n`;
            }
        });
        setStorageInfo(info);
    };

    const testAutoRepairSafe = async () => {
        if (!testData) {
            setResult('请先运行"开始数据修复"以加载测试数据');
            return;
        }

        setLoading(true);
        setResult('开始自动安全修复...\n\n');

        try {
            const result = await autoRepairSafe(testData);
            setResult(
                (prev) =>
                    prev +
                    `✓ 自动修复完成\n` +
                    `  - 应用修复: ${result.repairResult.appliedRepairs} 个\n` +
                    `  - 剩余错误: ${result.repairResult.remainingErrors.length} 个\n` +
                    `  - 同步状态: ${result.syncResult?.success ? '成功' : '失败或未同步'}\n\n`,
            );
        } catch (error) {
            setResult(
                (prev) =>
                    prev +
                    `\n❌ 错误: ${error instanceof Error ? error.message : '未知错误'}`,
            );
        } finally {
            setLoading(false);
        }
    };

    const testRepairAndSync = async () => {
        if (!testData || !repairPlan) {
            setResult('请先运行"开始数据修复"以生成修复计划');
            return;
        }

        setLoading(true);
        setResult('开始修复并同步...\n\n');

        try {
            const selectedRepairIds = repairPlan.repairs.map((r: any) => r.id);
            const result = await repairAndSync(testData, repairPlan, selectedRepairIds, {
                autoSync: true,
                createBackup: true,
                validateAfterRepair: true
            });

            setResult(
                (prev) =>
                    prev +
                    `✓ 修复并同步完成\n` +
                    `  - 应用修复: ${result.repairResult.appliedRepairs} 个\n` +
                    `  - 创建备份: ${result.backupCreated ? '是' : '否'}\n` +
                    `  - 同步状态: ${result.syncResult?.success ? '成功' : '失败'}\n` +
                    `  - 修复后验证: ${result.validationAfterRepair ? `${result.validationAfterRepair.totalErrors} 个错误` : '未验证'}\n\n`,
            );

            // Show success modal if repair was successful
            if (result.success && result.repairResult.appliedRepairs > 0) {
                showSuccessDetails();
            }
        } catch (error) {
            setResult(
                (prev) =>
                    prev +
                    `\n❌ 错误: ${error instanceof Error ? error.message : '未知错误'}`,
            );
        } finally {
            setLoading(false);
        }
    };

    const testCheckDataHealth = async () => {
        if (!testData) {
            setResult('请先运行"开始数据修复"以加载测试数据');
            return;
        }

        setLoading(true);
        setResult('检查数据健康状况...\n\n');

        try {
            const healthCheck = await checkDataHealth(testData);
            setResult(
                (prev) =>
                    prev +
                    `✓ 健康检查完成\n` +
                    `  - 需要修复: ${healthCheck.needsRepair ? '是' : '否'}\n` +
                    `  - 总错误数: ${healthCheck.validationResult.totalErrors}\n` +
                    `  - 可自动修复: ${healthCheck.repairPlan?.autoRepairableCount || 0} 个\n\n`,
            );
        } catch (error) {
            setResult(
                (prev) =>
                    prev +
                    `\n❌ 错误: ${error instanceof Error ? error.message : '未知错误'}`,
            );
        } finally {
            setLoading(false);
        }
    };

    const testBackupManagement = () => {
        const backups = getBackups();
        let info = `可用备份 (${backups.length} 个):\n\n`;
        backups.forEach((backup, index) => {
            info += `${index + 1}. ${backup.key}\n`;
            info += `   时间: ${backup.timestamp}\n`;
            info += `   大小: ${(backup.size / 1024).toFixed(2)} KB\n\n`;
        });
        setStorageInfo(info);
    };

    const testDataRepair = async () => {
        setLoading(true);
        setResult('开始检测数据...\n\n');

        try {
            // 尝试从多个可能的存储键获取数据
            const possibleKeys = ['gist_data', 'cached_gist_data', 'local_data', 'questions_data'];
            let data = null;
            let foundKey = '';

            for (const key of possibleKeys) {
                const dataStr = localStorage.getItem(key);
                if (dataStr) {
                    try {
                        data = JSON.parse(dataStr);
                        foundKey = key;
                        break;
                    } catch (e) {
                        continue;
                    }
                }
            }

            if (!data) {
                // 如果没有找到数据，创建一个演示数据
                setResult((prev) => prev + '未找到 Gist 数据，使用演示数据...\n\n');
                data = {
                    questions: [
                        {
                            id: 'q1',
                            title: '正常问题',
                            description: '这是一个正常的问题',
                            category: 'test',
                            summary: '测试问题',
                            status: 'unsolved',
                            sub_questions: [],
                            created_at: '2024-01-01T00:00:00Z',
                            updated_at: '2024-01-01T00:00:00Z',
                        },
                        {
                            // 这个问题缺少多个字段，模拟你遇到的错误
                            status: 'invalid_status',
                            sub_questions: 'not_an_array',
                        },
                        {
                            id: 'q3',
                            title: '部分缺失问题',
                            // 缺少 description, category, summary 等
                            status: 'solved',
                        },
                    ],
                };
            } else {
                setResult((prev) => prev + `✓ 从 ${foundKey} 加载数据成功\n\n`);
            }
            setResult((prev) => prev + '✓ 数据加载成功\n\n');

            // 保存测试数据供其他功能使用
            setTestData(data);

            // 1. 检测错误
            setResult((prev) => prev + '步骤 1: 检测数据错误...\n');
            const detectionResult = dataDetector.detectErrors(data);
            setResult(
                (prev) =>
                    prev +
                    `✓ 检测完成: 发现 ${detectionResult.totalErrors} 个错误\n` +
                    `  - 可自动修复: ${detectionResult.summary.autoRepairableErrors} 个\n` +
                    `  - 严重错误: ${detectionResult.summary.criticalErrors} 个\n\n`,
            );

            if (detectionResult.totalErrors === 0) {
                setResult((prev) => prev + '✓ 数据验证通过，无需修复！\n');
                return;
            }

            // 2. 生成修复方案
            setResult((prev) => prev + '步骤 2: 分析错误并生成修复方案...\n');
            const allErrors = Object.values(detectionResult.errorsByType).flat();
            const generatedRepairPlan = repairAnalyzer.analyzeErrors(allErrors, data);
            setRepairPlan(generatedRepairPlan); // 保存修复计划
            setResult(
                (prev) =>
                    prev +
                    `✓ 修复方案生成完成\n` +
                    `  - 总修复操作: ${generatedRepairPlan.repairs.length} 个\n` +
                    `  - 可自动修复: ${generatedRepairPlan.autoRepairableCount} 个\n` +
                    `  - 需手动修复: ${generatedRepairPlan.manualRepairCount} 个\n` +
                    `  - 数据丢失风险: ${generatedRepairPlan.estimatedDataLoss}\n\n`,
            );

            // 3. 应用修复
            setResult((prev) => prev + '步骤 3: 应用修复操作...\n');
            const repairResult = dataRepairer.applyRepairs(data, generatedRepairPlan.repairs);
            setResult(
                (prev) =>
                    prev +
                    `✓ 修复完成\n` +
                    `  - 成功修复: ${repairResult.appliedRepairs} 个\n` +
                    `  - 剩余错误: ${repairResult.remainingErrors.length} 个\n` +
                    `  - 隔离项: ${repairResult.isolatedItems.length} 个\n\n`,
            );

            // 更新隔离项列表
            if (repairResult.isolatedItems.length > 0) {
                setIsolatedItems(repairResult.isolatedItems);
                setShowIsolatedItems(true);
            }

            // 4. 生成报告
            setResult((prev) => prev + '步骤 4: 生成修复报告...\n');
            const report = errorReporter.exportText(detectionResult, {
                gistId: 'test',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
            });

            setResult(
                (prev) =>
                    prev +
                    `✓ 报告生成完成\n\n` +
                    `=== 详细报告 ===\n${report}\n\n` +
                    `=== 修复后的数据 ===\n${JSON.stringify(repairResult.repairedData, null, 2)}`,
            );

            // 可选：保存修复后的数据
            // localStorage.setItem('gist_data', JSON.stringify(repairResult.repairedData));
        } catch (error) {
            setResult(
                (prev) =>
                    prev +
                    `\n❌ 错误: ${error instanceof Error ? error.message : '未知错误'}`,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">数据修复测试</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <p className="text-gray-600 mb-4">
                        这个页面用于测试数据修复功能。点击按钮开始检测和修复 Gist
                        数据中的错误。
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={testDataRepair}
                            disabled={loading || isRepairing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? '处理中...' : '开始数据修复'}
                        </button>
                        <button
                            onClick={checkLocalStorage}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            检查存储
                        </button>
                        <button
                            onClick={testAutoRepairSafe}
                            disabled={loading || isRepairing || !testData}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isRepairing ? '修复中...' : '自动安全修复'}
                        </button>
                        <button
                            onClick={testRepairAndSync}
                            disabled={loading || isRepairing || !testData || !repairPlan}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isRepairing ? '修复中...' : '修复并同步'}
                        </button>
                        <button
                            onClick={testCheckDataHealth}
                            disabled={loading || isRepairing || !testData}
                            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            检查数据健康
                        </button>
                        <button
                            onClick={testBackupManagement}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            查看备份
                        </button>
                        <button
                            onClick={() => setShowIsolatedItems(true)}
                            disabled={isolatedItems.length === 0}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            查看隔离项 ({isolatedItems.length})
                        </button>
                    </div>
                </div>

                {storageInfo && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">存储信息</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px] text-sm whitespace-pre-wrap">
                            {storageInfo}
                        </pre>
                    </div>
                )}

                {syncRepairResult && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">修复同步结果</h2>
                        <div className="bg-blue-50 p-4 rounded">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">修复成功:</span>{' '}
                                    {syncRepairResult.success ? '是' : '否'}
                                </div>
                                <div>
                                    <span className="font-medium">应用修复:</span>{' '}
                                    {syncRepairResult.repairResult.appliedRepairs}
                                </div>
                                <div>
                                    <span className="font-medium">同步成功:</span>{' '}
                                    {syncRepairResult.syncResult?.success ? '是' : '否'}
                                </div>
                                <div>
                                    <span className="font-medium">备份创建:</span>{' '}
                                    {syncRepairResult.backupCreated ? '是' : '否'}
                                </div>
                            </div>
                            {syncRepairResult.error && (
                                <div className="mt-2 text-red-600 text-sm">
                                    错误: {syncRepairResult.error}
                                </div>
                            )}
                            {syncRepairResult.validationAfterRepair && (
                                <div className="mt-2 text-sm">
                                    <span className="font-medium">修复后验证:</span>{' '}
                                    {syncRepairResult.validationAfterRepair.totalErrors} 个剩余错误
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {repairSyncError && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="bg-red-50 border border-red-200 rounded p-4">
                            <h4 className="text-red-800 font-medium">修复同步错误</h4>
                            <p className="text-red-700 text-sm mt-1">{repairSyncError}</p>
                            <button
                                onClick={clearError}
                                className="mt-2 px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                                清除错误
                            </button>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">执行结果</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px] text-sm whitespace-pre-wrap">
                            {result}
                        </pre>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {syncRepairResult && showSuccessModal && (
                <RepairSuccessModal
                    isOpen={showSuccessModal}
                    onClose={hideSuccessDetails}
                    result={syncRepairResult}
                />
            )}

            {/* Isolated Items View */}
            <IsolatedItemsView
                isOpen={showIsolatedItems}
                onClose={() => setShowIsolatedItems(false)}
                isolatedItems={isolatedItems}
                onItemFixed={(itemIndex, fixedData) => {
                    fixItem(itemIndex, fixedData);
                    setResult((prev) => prev + `\n✓ 项目 ${itemIndex} 已手动修复\n`);
                }}
                onRevalidate={() => {
                    revalidateAll();
                    setResult((prev) => prev + `\n✓ 已重新验证所有隔离项\n`);
                }}
            />
        </div>
    );
}
