/**
 * 数据导入组件
 * 允许用户从 JSON 文件导入数据
 */

import { useState, useRef } from 'react';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { validateGistData } from '@/utils/dataValidation';
import { useToast } from '@/hooks/useToast';
import { SyncResultModal } from '@/components/common/SyncResultModal';

export function DataImport() {
    const { showToast } = useToast();
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

            // 修复缺失的字段
            const now = new Date().toISOString();

            const fixedResources = (resources || []).map((r: any) => ({
                ...r,
                id: r.id || `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                created_at: r.created_at || now,
                updated_at: r.updated_at || now,
            }));

            const fixedQuestions = (questions || []).map((q: any) => ({
                ...q,
                id: q.id || `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                created_at: q.created_at || now,
                updated_at: q.updated_at || now,
                sub_questions: q.sub_questions || [],
            }));

            const fixedSubQuestions = (subQuestions || []).map((sq: any) => ({
                ...sq,
                id: sq.id || `subquestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                created_at: sq.created_at || now,
                updated_at: sq.updated_at || now,
                answers: sq.answers || [],
            }));

            const fixedAnswers = (answers || []).map((a: any) => ({
                ...a,
                id: a.id || `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                created_at: a.created_at || now,
                updated_at: a.updated_at || now,
                timestamp: a.timestamp || now,
            }));

            // 验证数据
            const dataToValidate = {
                resources: fixedResources,
                questions: fixedQuestions,
                subQuestions: fixedSubQuestions,
                answers: fixedAnswers,
                metadata: metadata || {
                    version: '1.0.0',
                    lastSync: new Date().toISOString(),
                    owner: 'local'
                },
            };

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
                    `资源: ${fixedResources.length} 个\n` +
                    `问题: ${fixedQuestions.length} 个\n` +
                    `子问题: ${fixedSubQuestions.length} 个\n` +
                    `答案: ${fixedAnswers.length} 个\n\n` +
                    `这将覆盖当前的本地数据。`
                )
            ) {
                return;
            }

            // 保存数据
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, fixedResources);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, fixedQuestions);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, fixedSubQuestions);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, fixedAnswers);
            if (metadata) {
                await cacheService.saveData(STORAGE_KEYS.METADATA, metadata);
            }

            // 显示成功模态框
            setImportResult({
                show: true,
                type: 'success',
                title: '导入成功！',
                message: `已成功导入 ${fixedResources.length} 个资源和 ${fixedQuestions.length} 个问题，页面即将刷新...`,
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
