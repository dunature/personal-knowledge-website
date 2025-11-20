/**
 * 数据导入组件
 * 允许用户从 JSON 文件导入数据
 */

import { useState, useRef } from 'react';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { validateGistData } from '@/utils/dataValidation';
import { SyncResultModal } from '@/components/common/SyncResultModal';
import { dataDetector, dataRepairer, repairAnalyzer } from '@/services/repair';

export function DataImport() {
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importResult, setImportResult] = useState<{
        show: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({
        show: false,
        type: 'success',
        title: '',
        message: '',
    });

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsImporting(true);

            // 读取文件
            const text = await file.text();
            const importData = JSON.parse(text);

            // 验证数据格式
            if (!importData.data) {
                throw new Error('无效的数据格式');
            }

            const { resources, questions, subQuestions, answers, metadata } = importData.data;

            // 构建原始数据对象
            const rawData = {
                resources: resources || [],
                questions: questions || [],
                subQuestions: subQuestions || [],
                answers: answers || [],
                metadata: metadata || {
                    version: '1.0.0',
                    lastSync: new Date().toISOString(),
                    owner: 'local'
                },
            };

            // 1. 检测错误
            console.log('[DataImport] 开始检测数据错误...');
            const detectionResult = dataDetector.detectErrors(rawData);

            let dataToValidate = rawData;

            if (!detectionResult.valid && detectionResult.totalErrors > 0) {
                console.log(`[DataImport] 检测到 ${detectionResult.totalErrors} 个数据错误，开始自动修复`);
                console.log('[DataImport] 错误摘要:', detectionResult.summary);

                // 2. 分析错误并生成修复计划
                const allErrors = Object.values(detectionResult.errorsByType).flat();
                const repairPlan = repairAnalyzer.analyzeErrors(allErrors, rawData);

                console.log(`[DataImport] 生成修复计划: ${repairPlan.autoRepairableCount} 个可自动修复, ${repairPlan.manualRepairCount} 个需要手动修复`);

                // 3. 自动应用所有安全的修复
                const repairsToApply = repairPlan.repairs.filter(repair => repair.autoApplicable);
                const repairResult = dataRepairer.applyRepairs(rawData, repairsToApply);

                if (repairResult.success) {
                    console.log(`[DataImport] 成功应用 ${repairResult.appliedRepairs} 个修复`);

                    if (repairResult.remainingErrors.length > 0) {
                        console.warn(`[DataImport] 仍有 ${repairResult.remainingErrors.length} 个错误无法自动修复`);
                    }

                    if (repairResult.isolatedItems.length > 0) {
                        console.warn(`[DataImport] ${repairResult.isolatedItems.length} 个数据项被隔离，需要手动处理`);
                    }

                    dataToValidate = repairResult.repairedData;
                } else {
                    console.error('[DataImport] 数据修复失败，使用原始数据');
                }
            } else {
                console.log('[DataImport] 数据验证通过，无需修复');
            }

            // 最终验证
            const isValid = validateGistData(dataToValidate);

            if (!isValid) {
                // 提供更详细的错误信息
                const errors: string[] = [];
                if (!Array.isArray(dataToValidate.resources)) {
                    errors.push('resources 必须是数组');
                }
                if (!Array.isArray(dataToValidate.questions)) {
                    errors.push('questions 必须是数组');
                }
                if (!Array.isArray(dataToValidate.subQuestions)) {
                    errors.push('subQuestions 必须是数组');
                }
                if (!Array.isArray(dataToValidate.answers)) {
                    errors.push('answers 必须是数组');
                }
                if (!dataToValidate.metadata || typeof dataToValidate.metadata !== 'object') {
                    errors.push('metadata 必须是对象');
                }

                throw new Error(`数据验证失败:\n${errors.join('\n') || '数据格式不符合要求，请检查所有字段是否完整'}`);
            }

            // 确认导入
            if (
                !confirm(
                    `确定要导入数据吗？\n\n` +
                    `资源: ${dataToValidate.resources.length} 个\n` +
                    `问题: ${dataToValidate.questions.length} 个\n` +
                    `子问题: ${dataToValidate.subQuestions.length} 个\n` +
                    `答案: ${dataToValidate.answers.length} 个\n\n` +
                    `这将覆盖当前的本地数据。`
                )
            ) {
                return;
            }

            // 保存数据
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, dataToValidate.resources);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, dataToValidate.questions);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, dataToValidate.subQuestions);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, dataToValidate.answers);
            await cacheService.saveData(STORAGE_KEYS.METADATA, dataToValidate.metadata);

            // 显示成功模态框
            setImportResult({
                show: true,
                type: 'success',
                title: '导入成功！',
                message: `已成功导入 ${dataToValidate.resources.length} 个资源和 ${dataToValidate.questions.length} 个问题，页面即将刷新...`,
            });

            // 刷新页面以加载新数据
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('导入数据失败:', error);
            // 显示失败模态框
            setImportResult({
                show: true,
                type: 'error',
                title: '导入失败',
                message: error instanceof Error ? error.message : '数据导入失败，请检查文件格式',
            });
        } finally {
            setIsImporting(false);
            // 重置文件输入
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <p className="text-sm text-gray-600 mb-4">
                从 JSON 文件导入数据。导入的数据将覆盖当前的本地数据。
            </p>

            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
            />

            <button
                onClick={handleClick}
                disabled={isImporting}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${isImporting
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
            >
                {isImporting ? (
                    <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        导入中...
                    </>
                ) : (
                    <>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                        </svg>
                        导入数据
                    </>
                )}
            </button>

            <p className="mt-2 text-xs text-gray-500">
                ⚠️ 导入数据将覆盖当前的本地数据，请确保已备份重要数据。
            </p>

            {/* 导入结果模态框 */}
            <SyncResultModal
                isOpen={importResult.show}
                type={importResult.type}
                title={importResult.title}
                message={importResult.message}
                onClose={() => setImportResult({ ...importResult, show: false })}
                autoClose={true}
                autoCloseDelay={3000}
            />
        </div>
    );
}
