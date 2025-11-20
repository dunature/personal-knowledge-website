/**
 * Data Repair Page
 * 数据修复页面 - 检测和修复 Gist 数据中的错误
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataDetector, repairAnalyzer } from '@/services/repair';
import { useDataRepairSync } from '@/hooks/useDataRepairSync';
import { useIsolatedItemsManager } from '@/hooks/useIsolatedItemsManager';

import { RepairPreviewModal } from '@/components/repair/RepairPreviewModal';
import { RepairSuccessModal } from '@/components/repair/RepairSuccessModal';
import { IsolatedItemsView } from '@/components/repair/IsolatedItemsView';
import LoadingState from '@/components/common/LoadingState';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { DetectionResult, RepairPlan } from '@/types/dataRepair';

export default function DataRepairPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
    const [repairPlan, setRepairPlan] = useState<RepairPlan | null>(null);
    const [selectedRepairIds, setSelectedRepairIds] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [showIsolatedItems, setShowIsolatedItems] = useState(false);

    const {
        isRepairing,
        lastResult,
        showSuccessModal,
        repairAndSync,
        hideSuccessDetails
    } = useDataRepairSync();

    const {
        isolatedItems,
        fixItem,
        revalidateAll,
        setIsolatedItems
    } = useIsolatedItemsManager();

    useEffect(() => {
        loadAndAnalyzeData();
    }, []);

    const loadAndAnalyzeData = async () => {
        setIsLoading(true);
        setLoadError(null);

        try {
            // 从 localStorage 获取数据
            const dataStr = localStorage.getItem('gist_data') || localStorage.getItem('cached_gist_data');

            if (!dataStr) {
                setLoadError('未找到数据。请先从 Gist 加载数据或在本地模式下添加一些内容。');
                setIsLoading(false);
                return;
            }

            const data = JSON.parse(dataStr);
            console.log('📊 开始分析数据:', data);

            // 检测错误
            const result = dataDetector.detectErrors(data);
            console.log('🔍 检测结果:', result);
            console.log('❌ 总错误数:', result.totalErrors);
            console.log('📋 错误详情:', result.errorsByType);
            setDetectionResult(result);

            // 如果有错误，生成修复计划
            if (result.totalErrors > 0) {
                const allErrors = Object.values(result.errorsByType).flat();
                console.log('🔧 生成修复计划，错误数:', allErrors.length);
                const plan = repairAnalyzer.analyzeErrors(allErrors, data);
                console.log('📝 修复计划:', plan);
                setRepairPlan(plan);

                // 默认选择所有可自动修复的项
                const autoRepairIds = plan.repairs
                    .filter(r => r.autoApplicable)
                    .map(r => r.id);
                console.log('✅ 自动选择的修复项:', autoRepairIds);
                setSelectedRepairIds(autoRepairIds);
            } else {
                console.log('✨ 数据健康，无需修复');
            }
        } catch (error) {
            console.error('数据分析失败:', error);
            setLoadError(error instanceof Error ? error.message : '数据分析失败');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartRepair = async () => {
        if (!detectionResult || !repairPlan || selectedRepairIds.length === 0) {
            console.warn('⚠️ 无法开始修复:', { detectionResult, repairPlan, selectedRepairIds });
            return;
        }

        console.log('🚀 开始修复流程...');
        console.log('📝 选中的修复项:', selectedRepairIds);

        try {
            const dataStr = localStorage.getItem('gist_data') || localStorage.getItem('cached_gist_data');
            if (!dataStr) {
                throw new Error('数据不存在');
            }

            const data = JSON.parse(dataStr);
            console.log('📊 修复前的数据:', data);

            const result = await repairAndSync(data, repairPlan, selectedRepairIds, {
                createBackup: true,
                validateAfterRepair: true,
                autoSync: true
            });

            console.log('✅ 修复结果:', result);
            console.log('🔧 已应用的修复数:', result.repairResult.appliedRepairs);
            console.log('📊 修复后的数据:', result.repairResult.repairedData);

            // 如果有隔离项，显示隔离项视图
            if (result.repairResult.isolatedItems.length > 0) {
                console.log('⚠️ 有隔离项需要手动处理:', result.repairResult.isolatedItems);
                setIsolatedItems(result.repairResult.isolatedItems);
                setShowIsolatedItems(true);
            }

            // 保存修复后的数据到 localStorage
            localStorage.setItem('gist_data', JSON.stringify(result.repairResult.repairedData));
            console.log('💾 已保存修复后的数据到 localStorage');

            // 重新分析数据
            console.log('🔄 重新分析数据...');
            await loadAndAnalyzeData();
        } catch (error) {
            console.error('❌ 修复失败:', error);
        }
    };

    const handlePreviewRepair = () => {
        setShowPreview(true);
    };

    const handleBackToSettings = () => {
        navigate('/settings');
    };

    const createTestData = () => {
        const testData = {
            questions: [
                {
                    id: 'q_test_001',
                    // title 字段被故意删除
                    description: '这是一个测试问题',
                    status: 'invalid_status',  // 无效状态
                    category: '测试',
                    summary: '',
                    // sub_questions 字段被故意删除
                    created_at: '2025-01-01T00:00:00Z',
                    updated_at: '2025-01-01T00:00:00Z'
                },
                {
                    id: 'q_test_002',
                    title: '正常的问题',
                    description: '这个问题是正常的',
                    status: 'unsolved',
                    category: '测试',
                    summary: '',
                    sub_questions: [],
                    // created_at 字段被故意删除
                    updated_at: '2025-01-01T00:00:00Z'
                }
            ],
            subQuestions: [],
            answers: [],
            resources: [],
            metadata: {
                version: '1.0.0',
                lastSync: new Date().toISOString()
            }
        };

        localStorage.setItem('gist_data', JSON.stringify(testData));
        console.log('✅ 已创建包含错误的测试数据');
        loadAndAnalyzeData();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingState message="正在分析数据..." />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <ErrorMessage
                        title="数据加载失败"
                        message={loadError}
                        onRetry={loadAndAnalyzeData}
                    />
                    <div className="mt-4 text-center space-x-4">
                        <button
                            onClick={handleBackToSettings}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            返回设置页面
                        </button>
                        {import.meta.env.DEV && (
                            <button
                                onClick={createTestData}
                                className="text-orange-600 hover:text-orange-700 font-medium"
                            >
                                创建测试数据
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* 页面标题 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">数据修复</h1>
                            <p className="text-gray-600 mt-2">
                                检测并修复 Gist 数据中的格式错误，确保数据完整性和一致性。
                            </p>
                        </div>
                        <button
                            onClick={handleBackToSettings}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            返回设置
                        </button>
                    </div>
                </div>

                {/* 数据健康状态 */}
                {detectionResult && (
                    <div className="mb-8">
                        {detectionResult.totalErrors === 0 ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <div className="flex items-center gap-3">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h2 className="text-xl font-semibold text-green-900">数据健康</h2>
                                        <p className="text-green-800 mt-1">您的数据没有发现任何问题，一切正常！</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={handleBackToSettings}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        返回设置
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* 错误摘要 */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <div>
                                            <h2 className="text-xl font-semibold text-red-900">发现数据问题</h2>
                                            <p className="text-red-800 mt-1">
                                                检测到 {detectionResult.totalErrors} 个问题，其中 {detectionResult.summary.autoRepairableErrors} 个可以自动修复。
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handlePreviewRepair}
                                            disabled={!repairPlan || isRepairing}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            预览修复
                                        </button>
                                        <button
                                            onClick={handleStartRepair}
                                            disabled={!repairPlan || selectedRepairIds.length === 0 || isRepairing}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isRepairing ? '修复中...' : '开始修复'}
                                        </button>
                                        <button
                                            onClick={loadAndAnalyzeData}
                                            disabled={isRepairing}
                                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                                        >
                                            重新检测
                                        </button>
                                    </div>
                                </div>

                                {/* 详细报告 */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">错误详情</h3>
                                    <div className="space-y-4">
                                        {Object.entries(detectionResult.errorsByType).map(([dataType, errors]) => {
                                            if (errors.length === 0) return null;
                                            return (
                                                <div key={dataType} className="border-l-4 border-blue-500 pl-4">
                                                    <h4 className="font-medium text-gray-900 mb-2">
                                                        {dataType} ({errors.length} 个错误)
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {errors.slice(0, 5).map((error, index) => (
                                                            <li key={index} className="text-sm text-gray-600">
                                                                • {error.message}
                                                            </li>
                                                        ))}
                                                        {errors.length > 5 && (
                                                            <li className="text-sm text-gray-500 italic">
                                                                还有 {errors.length - 5} 个错误...
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 隔离项按钮 */}
                {isolatedItems.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-yellow-900">需要手动处理</h3>
                                        <p className="text-yellow-800 text-sm">
                                            有 {isolatedItems.length} 个数据项无法自动修复，需要手动处理。
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowIsolatedItems(true)}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                >
                                    查看详情
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 修复预览模态框 */}
            {repairPlan && (
                <RepairPreviewModal
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    repairPlan={repairPlan}
                    selectedRepairs={selectedRepairIds}
                    onToggleRepair={(id) => {
                        setSelectedRepairIds(prev =>
                            prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
                        );
                    }}
                    onApplyRepairs={() => {
                        setShowPreview(false);
                        handleStartRepair();
                    }}
                    onSelectAll={() => {
                        setSelectedRepairIds(repairPlan.repairs.map(r => r.id));
                    }}
                    onSelectNone={() => {
                        setSelectedRepairIds([]);
                    }}
                    isApplying={isRepairing}
                />
            )}

            {/* 成功模态框 */}
            {lastResult && showSuccessModal && (
                <RepairSuccessModal
                    isOpen={showSuccessModal}
                    onClose={hideSuccessDetails}
                    result={lastResult}
                />
            )}

            {/* 隔离项视图 */}
            <IsolatedItemsView
                isOpen={showIsolatedItems}
                onClose={() => setShowIsolatedItems(false)}
                isolatedItems={isolatedItems}
                onItemFixed={(itemIndex, fixedData) => {
                    fixItem(itemIndex, fixedData);
                    // 重新分析数据
                    loadAndAnalyzeData();
                }}
                onRevalidate={() => {
                    revalidateAll();
                    loadAndAnalyzeData();
                }}
            />
        </div>
    );
}
