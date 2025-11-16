/**
 * 数据导出组件
 * 允许用户将数据导出为 JSON 文件
 */

import { useState } from 'react';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { useToast } from '@/hooks/useToast';
import { getButtonStyles } from '@/styles/buttonStyles';

export function DataExport() {
    const { showToast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);

            // 获取所有数据
            const resources = await cacheService.getData(STORAGE_KEYS.RESOURCES);
            const questions = await cacheService.getData(STORAGE_KEYS.QUESTIONS);
            const subQuestions = await cacheService.getData(STORAGE_KEYS.SUB_QUESTIONS);
            const answers = await cacheService.getData(STORAGE_KEYS.ANSWERS);
            const metadata = await cacheService.getData(STORAGE_KEYS.METADATA);

            // 构建导出数据
            const exportData = {
                version: '1.0.0',
                exportDate: new Date().toISOString(),
                data: {
                    resources: resources || [],
                    questions: questions || [],
                    subQuestions: subQuestions || [],
                    answers: answers || [],
                    metadata: metadata || {},
                },
            };

            // 转换为 JSON 字符串
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });

            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `liuliuliuliulang-backup-${new Date().toISOString().split('T')[0]}.json`;

            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 清理
            URL.revokeObjectURL(url);

            showToast('success', '数据导出成功');
        } catch (error) {
            console.error('导出数据失败:', error);
            showToast('error', '数据导出失败');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div>
            <p className="text-sm text-gray-600 mb-4">
                将所有数据导出为 JSON 文件，可用于备份或迁移到其他设备。
            </p>

            <button
                onClick={handleExport}
                disabled={isExporting}
                className={getButtonStyles('primary', 'medium', true)}
            >
                {isExporting ? '导出中...' : '导出数据'}
            </button>
        </div>
    );
}
