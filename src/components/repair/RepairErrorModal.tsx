/**
 * Repair Error Modal
 * 修复错误模态框 - 显示修复过程中的错误信息
 */

import { Modal } from '@/components/ui/Modal';
import type { RepairSyncResult } from '@/hooks/useDataRepairSync';

interface RepairErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    error: Error;
    result: RepairSyncResult | null;
    onRetry?: () => void;
    onReportIssue?: () => void;
}

export function RepairErrorModal({
    isOpen,
    onClose,
    error,
    result,
    onRetry,
    onReportIssue
}: RepairErrorModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="修复失败">
            <div className="space-y-6">
                {/* 错误信息 */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 mb-2">发生错误</h3>
                            <p className="text-red-800 text-sm">{error.message}</p>
                        </div>
                    </div>
                </div>

                {/* 修复结果（如果有） */}
                {result && (
                    <div className="space-y-4">
                        <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-3">修复进度</h4>
                            <div className="space-y-2 text-sm">
                                {result.repairResult && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">已修复项目：</span>
                                            <span className="font-medium">{result.repairResult.appliedRepairs}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">隔离项目：</span>
                                            <span className="font-medium">{result.repairResult.isolatedItems.length}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 技术信息 */}
                <details className="border rounded-lg">
                    <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-medium text-sm">
                        查看技术详情
                    </summary>
                    <div className="px-4 py-3 border-t bg-gray-50">
                        <pre className="text-xs text-gray-700 overflow-auto max-h-40">
                            {error.stack || error.message}
                        </pre>
                    </div>
                </details>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            重试
                        </button>
                    )}
                    {onReportIssue && (
                        <button
                            onClick={onReportIssue}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            报告问题
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </Modal>
    );
}
