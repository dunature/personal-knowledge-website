/**
 * 数据导出组件
 * 允许用户将数据导出为 JSON 文件
 */

import { useState } from 'react';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { SyncResultModal } from '@/components/common/SyncResultModal';

export function DataExport() {
    const [isExporting, setIsExporting] = useState(false);
    const [exportResult, setExportResult] = useState<{
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

            // 显示成功模态框
            const resourceCount = (resources as any[])?.length || 0;
            const questionCount = (questions as any[])?.length || 0;
            setExportResult({
                show: true,
                type: 'success',
                title: '导出成功！',
                message: `已成功导出 ${resourceCount} 个资源和 ${questionCount} 个问题到文件`,
            });
        } catch (error) {
            console.error('导出数据失败:', error);
            // 显示失败模态框
            setExportResult({
                show: true,
                type: 'error',
                title: '导出失败',
                message: '数据导出失败，请重试',
            });
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
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${isExporting
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
            >
                {isExporting ? (
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
                        导出中...
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        导出数据
                    </>
                )}
            </button>

            {/* 导出结果模态框 */}
            <SyncResultModal
                isOpen={exportResult.show}
                type={exportResult.type}
                title={exportResult.title}
                message={exportResult.message}
                onClose={() => setExportResult({ ...exportResult, show: false })}
                autoClose={true}
                autoCloseDelay={3000}
            />
        </div>
    );
}
