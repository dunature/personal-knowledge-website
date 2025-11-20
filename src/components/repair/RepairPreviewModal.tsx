/**
 * Repair Preview Modal Component
 * Displays before/after comparison for each repair with selection controls
 */

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { RepairAction, RepairPlan } from '@/types/dataRepair';

interface RepairPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    repairPlan: RepairPlan;
    selectedRepairs: string[];
    onToggleRepair: (repairId: string) => void;
    onApplyRepairs: () => void;
    onSelectAll: () => void;
    onSelectNone: () => void;
    isApplying?: boolean;
}

interface RepairItemPreviewProps {
    repair: RepairAction;
    isSelected: boolean;
    onToggle: () => void;
}

function RepairItemPreview({ repair, isSelected, onToggle }: RepairItemPreviewProps) {
    const [expanded, setExpanded] = useState(false);

    const riskColor =
        repair.riskLevel === 'none' ? 'text-green-600' :
            repair.riskLevel === 'low' ? 'text-blue-600' :
                repair.riskLevel === 'medium' ? 'text-yellow-600' :
                    'text-red-600';

    const riskBgColor =
        repair.riskLevel === 'none' ? 'bg-green-50 border-green-200' :
            repair.riskLevel === 'low' ? 'bg-blue-50 border-blue-200' :
                repair.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200';

    return (
        <div className={`border rounded-lg ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="p-4">
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggle}
                        className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{repair.error.message}</h4>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {expanded ? '收起' : '展开'}
                            </button>
                        </div>

                        <div className="flex items-center space-x-3 text-sm">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${repair.autoApplicable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {repair.autoApplicable ? '🤖 自动' : '👤 手动'}
                            </span>

                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${riskBgColor} ${riskColor}`}>
                                风险: {repair.riskLevel === 'none' ? '无' :
                                    repair.riskLevel === 'low' ? '低' :
                                        repair.riskLevel === 'medium' ? '中' : '高'}
                            </span>

                            {repair.strategy && (
                                <span className="text-xs text-gray-500">
                                    策略: {repair.strategy.name}
                                </span>
                            )}
                        </div>

                        {repair.error.suggestedFix && (
                            <p className="text-sm text-gray-600 mt-2">{repair.error.suggestedFix}</p>
                        )}
                    </div>
                </div>

                {expanded && repair.preview && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Before */}
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">修复前</h5>
                                <div className="bg-red-50 border border-red-200 rounded p-3">
                                    <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">
                                        {JSON.stringify(repair.preview.before, null, 2)}
                                    </pre>
                                </div>
                            </div>

                            {/* After */}
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">修复后</h5>
                                <div className="bg-green-50 border border-green-200 rounded p-3">
                                    <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">
                                        {JSON.stringify(repair.preview.after, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Changes */}
                        {repair.preview.changes && repair.preview.changes.length > 0 && (
                            <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">变更详情</h5>
                                <div className="space-y-2">
                                    {repair.preview.changes.map((change, index) => {
                                        const operationColor =
                                            change.operation === 'add' ? 'text-green-600' :
                                                change.operation === 'modify' ? 'text-blue-600' :
                                                    'text-red-600';

                                        const operationLabel =
                                            change.operation === 'add' ? '添加' :
                                                change.operation === 'modify' ? '修改' :
                                                    '删除';

                                        return (
                                            <div key={index} className="flex items-start space-x-2 text-sm">
                                                <span className={`font-medium ${operationColor}`}>
                                                    [{operationLabel}]
                                                </span>
                                                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                    {change.field}
                                                </code>
                                                {change.oldValue !== undefined && (
                                                    <>
                                                        <span className="text-gray-500">从</span>
                                                        <code className="bg-red-50 px-2 py-1 rounded text-xs text-red-700">
                                                            {JSON.stringify(change.oldValue)}
                                                        </code>
                                                    </>
                                                )}
                                                {change.newValue !== undefined && (
                                                    <>
                                                        <span className="text-gray-500">到</span>
                                                        <code className="bg-green-50 px-2 py-1 rounded text-xs text-green-700">
                                                            {JSON.stringify(change.newValue)}
                                                        </code>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export function RepairPreviewModal({
    isOpen,
    onClose,
    repairPlan,
    selectedRepairs,
    onToggleRepair,
    onApplyRepairs,
    onSelectAll,
    onSelectNone,
    isApplying = false,
}: RepairPreviewModalProps) {
    const selectedCount = selectedRepairs.length;
    const totalCount = repairPlan.repairs.length;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="修复预览" className="max-w-6xl">
            <div className="space-y-6">
                {/* Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-blue-900">修复计划概览</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                已选择 {selectedCount} / {totalCount} 个修复项
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={onSelectAll}
                                disabled={selectedCount === totalCount}
                            >
                                全选
                            </Button>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={onSelectNone}
                                disabled={selectedCount === 0}
                            >
                                全不选
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Risk Warning */}
                {repairPlan.dataLossRisk !== 'none' && (
                    <div className={`border rounded-lg p-4 ${repairPlan.dataLossRisk === 'high'
                        ? 'bg-red-50 border-red-200'
                        : repairPlan.dataLossRisk === 'medium'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}>
                        <div className="flex items-start space-x-3">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <h4 className={`font-medium ${repairPlan.dataLossRisk === 'high'
                                    ? 'text-red-900'
                                    : repairPlan.dataLossRisk === 'medium'
                                        ? 'text-yellow-900'
                                        : 'text-blue-900'
                                    }`}>
                                    数据风险提示
                                </h4>
                                <p className={`text-sm mt-1 ${repairPlan.dataLossRisk === 'high'
                                    ? 'text-red-700'
                                    : repairPlan.dataLossRisk === 'medium'
                                        ? 'text-yellow-700'
                                        : 'text-blue-700'
                                    }`}>
                                    此修复计划包含 {repairPlan.dataLossRisk === 'high' ? '高' :
                                        repairPlan.dataLossRisk === 'medium' ? '中' : '低'} 风险操作。
                                    请仔细审查每个修复项后再应用。
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Repair List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {repairPlan.repairs.map((repair) => (
                        <RepairItemPreview
                            key={repair.id}
                            repair={repair}
                            isSelected={selectedRepairs.includes(repair.id)}
                            onToggle={() => onToggleRepair(repair.id)}
                        />
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isApplying}
                    >
                        取消
                    </Button>
                    <Button
                        onClick={onApplyRepairs}
                        disabled={selectedCount === 0 || isApplying}
                        loading={isApplying}
                    >
                        {isApplying ? '应用中...' : `应用修复 (${selectedCount})`}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
