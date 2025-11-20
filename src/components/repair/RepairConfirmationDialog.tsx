/**
 * Repair Confirmation Dialog Component
 * Shows summary of selected repairs and warns about data changes
 */


import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { RepairAction } from '@/types/dataRepair';

interface RepairConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onPreviewAgain: () => void;
    selectedRepairs: RepairAction[];
    isApplying?: boolean;
}

export function RepairConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    onPreviewAgain,
    selectedRepairs,
    isApplying = false,
}: RepairConfirmationDialogProps) {
    // Calculate statistics
    const autoRepairCount = selectedRepairs.filter(r => r.autoApplicable).length;
    const manualRepairCount = selectedRepairs.length - autoRepairCount;

    const riskCounts = {
        none: selectedRepairs.filter(r => r.riskLevel === 'none').length,
        low: selectedRepairs.filter(r => r.riskLevel === 'low').length,
        medium: selectedRepairs.filter(r => r.riskLevel === 'medium').length,
        high: selectedRepairs.filter(r => r.riskLevel === 'high').length,
    };

    const hasHighRisk = riskCounts.high > 0;
    const hasMediumRisk = riskCounts.medium > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="确认修复操作">
            <div className="space-y-6">
                {/* Warning Banner */}
                <div className={`border rounded-lg p-4 ${hasHighRisk
                    ? 'bg-red-50 border-red-200'
                    : hasMediumRisk
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">
                            {hasHighRisk ? '⚠️' : hasMediumRisk ? '⚡' : 'ℹ️'}
                        </span>
                        <div>
                            <h3 className={`font-semibold ${hasHighRisk
                                ? 'text-red-900'
                                : hasMediumRisk
                                    ? 'text-yellow-900'
                                    : 'text-blue-900'
                                }`}>
                                {hasHighRisk
                                    ? '高风险操作警告'
                                    : hasMediumRisk
                                        ? '中风险操作提示'
                                        : '即将修复数据'}
                            </h3>
                            <p className={`text-sm mt-1 ${hasHighRisk
                                ? 'text-red-700'
                                : hasMediumRisk
                                    ? 'text-yellow-700'
                                    : 'text-blue-700'
                                }`}>
                                {hasHighRisk
                                    ? '此操作包含高风险修复，可能导致数据丢失或不可预期的变更。请确保已仔细审查所有修复项。'
                                    : hasMediumRisk
                                        ? '此操作包含中风险修复，可能会对数据进行重要变更。请确认您已了解所有修复内容。'
                                        : '即将对您的数据应用选定的修复操作。此操作将修改您的数据。'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">修复摘要</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-gray-600">总修复项</div>
                            <div className="text-2xl font-bold text-gray-900">{selectedRepairs.length}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">自动修复</div>
                            <div className="text-2xl font-bold text-green-600">{autoRepairCount}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">手动修复</div>
                            <div className="text-2xl font-bold text-yellow-600">{manualRepairCount}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">高风险项</div>
                            <div className={`text-2xl font-bold ${riskCounts.high > 0 ? 'text-red-600' : 'text-gray-400'
                                }`}>
                                {riskCounts.high}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Breakdown */}
                {(riskCounts.medium > 0 || riskCounts.high > 0) && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">风险分布</h4>
                        <div className="space-y-2">
                            {riskCounts.high > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-red-600 font-medium">高风险</span>
                                    <span className="text-red-600 font-semibold">{riskCounts.high} 项</span>
                                </div>
                            )}
                            {riskCounts.medium > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-yellow-600 font-medium">中风险</span>
                                    <span className="text-yellow-600 font-semibold">{riskCounts.medium} 项</span>
                                </div>
                            )}
                            {riskCounts.low > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-blue-600 font-medium">低风险</span>
                                    <span className="text-blue-600 font-semibold">{riskCounts.low} 项</span>
                                </div>
                            )}
                            {riskCounts.none > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-green-600 font-medium">无风险</span>
                                    <span className="text-green-600 font-semibold">{riskCounts.none} 项</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Important Notes */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">重要提示</h4>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>修复操作将直接修改您的数据</li>
                        <li>建议在应用修复前导出数据备份</li>
                        <li>修复后的数据将自动同步到 Gist（如已配置）</li>
                        <li>如有疑问，可以点击"再次预览"查看详细变更</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isApplying}
                    >
                        取消
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onPreviewAgain}
                        disabled={isApplying}
                    >
                        再次预览
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isApplying}
                        loading={isApplying}
                    >
                        {isApplying ? '应用中...' : '确认并应用'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
