/**
 * Sync Failure Dialog
 * 同步失败时的对话框，提供下载备份和重试选项
 */

import { Modal } from '../ui/Modal';
import type { RepairSyncResult } from '@/services/repair/RepairSyncIntegration';

interface SyncFailureDialogProps {
    isOpen: boolean;
    onClose: () => void;
    result: RepairSyncResult;
    onRetry: () => void;
    onDownloadBackup: () => void;
}

export function SyncFailureDialog({
    isOpen,
    onClose,
    result,
    onRetry,
    onDownloadBackup
}: SyncFailureDialogProps) {
    const { repairResult, syncResult } = result;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="同步失败">
            <div className="space-y-4">
                {/* 错误信息 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg
                            className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-yellow-900 mb-1">
                                数据修复成功，但同步失败
                            </h3>
                            <p className="text-sm text-yellow-800">
                                {syncResult?.error || '无法连接到 GitHub Gist 服务'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 修复摘要 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">修复已完成</h4>
                    <div className="text-sm text-green-800 space-y-1">
                        <div>✓ 成功修复 {repairResult.appliedRepairs} 个问题</div>
                        {repairResult.remainingErrors.length > 0 && (
                            <div>⚠ 剩余 {repairResult.remainingErrors.length} 个错误需要手动处理</div>
                        )}
                    </div>
                </div>

                {/* 说明 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">您的数据是安全的</h4>
                    <p className="text-sm text-blue-800">
                        修复后的数据已保存在本地。您可以：
                    </p>
                    <ul className="text-sm text-blue-800 list-disc list-inside mt-2 space-y-1">
                        <li>重试同步到 Gist</li>
                        <li>下载修复后的数据作为备份</li>
                        <li>稍后在网络恢复后再次尝试同步</li>
                    </ul>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t">
                    <button
                        onClick={onDownloadBackup}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
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
                        下载备份
                    </button>
                    <button
                        onClick={onRetry}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        重试同步
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        稍后处理
                    </button>
                </div>
            </div>
        </Modal>
    );
}
