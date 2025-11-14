/**
 * 数据导入组件
 * 允许用户从 JSON 文件导入数据
 */

import { useState, useRef } from 'react';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { validateGistData } from '@/utils/dataValidation';
import { useToast } from '@/hooks/useToast';

export function DataImport() {
    const { showToast } = useToast();
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

            // 验证数据
            const dataToValidate = {
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
                    `资源: ${resources?.length || 0} 个\n` +
                    `问题: ${questions?.length || 0} 个\n` +
                    `子问题: ${subQuestions?.length || 0} 个\n` +
                    `答案: ${answers?.length || 0} 个\n\n` +
                    `这将覆盖当前的本地数据。`
                )
            ) {
                return;
            }

            // 保存数据
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, resources || []);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, questions || []);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, subQuestions || []);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, answers || []);
            if (metadata) {
                await cacheService.saveData(STORAGE_KEYS.METADATA, metadata);
            }

            showToast('success', '数据导入成功');

            // 刷新页面以加载新数据
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('导入数据失败:', error);
            showToast('error', error instanceof Error ? error.message : '数据导入失败');
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
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isImporting ? '导入中...' : '导入数据'}
            </button>

            <p className="mt-2 text-xs text-gray-500">
                ⚠️ 导入数据将覆盖当前的本地数据，请确保已备份重要数据。
            </p>
        </div>
    );
}
