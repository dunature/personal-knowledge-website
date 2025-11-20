/**
 * Repair Success Modal
 * 显示修复成功的详细信息
 */

import { Modal } from '../ui/Modal';
import type { RepairSyncResult } from '@/services/repair/RepairSyncIntegration';

interface RepairSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: RepairSyncResult;
}

export function RepairSuccessModal({ isOpen, onClose, result }: RepairSuccessModalProps) {
    const { repairResult, syncResult, backupCreated, validationAfterRepair } = result;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="修复成功">
            <div className="space-y-4">
                {/* 修复摘要 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-semibold text-green-900">
                            数据修复完成
                        </h3>
                    </div>
                    <p className="text-green-800">
                        成功修复了 <span className="font-bold">{repairResult.appliedRepairs}</span> 个问题
                    </p>
                </div>

                {/* 详细统计 */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">应用修复</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {repairResult.appliedRepairs}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">剩余错误</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {repairResult.remainingErrors.length}
                        </div>
                    </div>
                    {repairResult.isolatedItems.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                            <div className="text-sm text-yellow-800">隔离项</div>
                            <div className="text-2xl font-bold text-yellow-900">
                                {repairResult.isolatedItems.length}
                            </div>
                        </div>
                    )}
                </div>

                {/* 同步状态 */}
                {syncResult && (
                    <div className={`rounded-lg p-4 ${syncResult.success
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            {syncResult.success ? (
                                <svg
                                    className="w-5 h-5 text-blue-600"
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
                            ) : (
                                <svg
                                    className="w-5 h-5 text-yellow-600"
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
                            )}
                            <h4 className={`font-semibold ${syncResult.success ? 'text-blue-900' : 'text-yellow-900'
                                }`}>
                                {syncResult.success ? '已同步到 Gist' : '同步失败'}
                            </h4>
                        </div>
                        {syncResult.success ? (
                            <p className="text-sm text-blue-800">
                                修复后的数据已成功同步到云端
                            </p>
                        ) : (
                            <p className="text-sm text-yellow-800">
                                {syncResult.error || '同步过程中发生错误'}
                            </p>
                        )}
                    </div>
                )}

                {/* 备份信息 */}
                {backupCreated && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                />
                            </svg>
                            <span className="text-sm text-purple-800">
                                已创建数据备份，可在需要时恢复
                            </span>
                        </div>
                    </div>
                )}

                {/* 修复后验证 */}
                {validationAfterRepair && (
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">修复后验证</h4>
                        <div className="text-sm text-gray-600">
                            {validationAfterRepair.valid ? (
                                <div className="flex items-center gap-2 text-green-700">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    数据验证通过，无剩余错误
                                </div>
                            ) : (
                                <div className="text-yellow-700">
                                    仍有 {validationAfterRepair.totalErrors} 个错误需要手动处理
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 操作按钮 */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        完成
                    </button>
                </div>
            </div>
        </Modal>
    );
}
