/**
 * Data Validation Report Component
 * Displays error summary with counts by category and provides action buttons
 */

import { useState } from 'react';
import { Button } from '../ui/Button';
import type { DetectionResult } from '@/types/dataRepair';

interface DataValidationReportProps {
    validationResult: DetectionResult;
    onViewDetails?: () => void;
    onAutoRepair?: () => void;
    onExportReport?: (format: 'json' | 'text') => void;
    isRepairing?: boolean;
}

export function DataValidationReport({
    validationResult,
    onViewDetails,
    onAutoRepair,
    onExportReport,
    isRepairing = false,
}: DataValidationReportProps) {
    const [showExportMenu, setShowExportMenu] = useState(false);

    const {
        valid,
        totalErrors,
        errorsByType,
        summary,
    } = validationResult;

    // Calculate statistics
    const criticalErrors = summary.criticalErrors;
    const autoRepairableErrors = summary.autoRepairableErrors;
    const manualRepairErrors = totalErrors - autoRepairableErrors;
    const autoRepairPercentage = totalErrors > 0
        ? Math.round((autoRepairableErrors / totalErrors) * 100)
        : 0;

    if (valid) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="text-3xl">✅</span>
                        <div>
                            <h3 className="text-green-900 font-semibold text-lg">数据验证通过</h3>
                            <p className="text-green-700 text-sm mt-1">
                                所有数据项都符合预期格式，无需修复。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Status */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-3xl">🚨</span>
                        <div>
                            <h3 className="text-red-900 font-semibold text-lg">检测到数据错误</h3>
                            <p className="text-red-700 text-sm mt-1">
                                发现 {totalErrors} 个错误，建议尽快修复以确保数据完整性。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-600">{totalErrors}</div>
                        <div className="text-sm text-gray-600 mt-1">总错误数</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-600">{criticalErrors}</div>
                        <div className="text-sm text-gray-600 mt-1">严重错误</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{autoRepairableErrors}</div>
                        <div className="text-sm text-gray-600 mt-1">可自动修复</div>
                        <div className="text-xs text-gray-500 mt-1">({autoRepairPercentage}%)</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-600">{manualRepairErrors}</div>
                        <div className="text-sm text-gray-600 mt-1">需手动处理</div>
                    </div>
                </div>
            </div>

            {/* Error Breakdown by Data Type */}
            {summary && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">按数据类型分类</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(summary.errorsByType).map(([type, count]) => (
                            <div key={type} className="border border-gray-200 rounded-lg p-4 text-center">
                                <div className="text-xl font-bold text-gray-900">{String(count)}</div>
                                <div className="text-sm text-gray-600 mt-1 capitalize">
                                    {type === 'bigQuestion' ? '大问题' :
                                        type === 'subQuestion' ? '子问题' :
                                            type === 'answer' ? '答案' :
                                                type === 'resource' ? '资源' : type}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Breakdown by Error Type */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">按错误类型分类</h4>
                <div className="space-y-3">
                    {Object.entries(errorsByType).map(([type, errors]) => {
                        if (errors.length === 0) return null;

                        const typeLabel =
                            type === 'missing_field' ? '缺失字段' :
                                type === 'invalid_value' ? '无效值' :
                                    type === 'invalid_format' ? '格式错误' :
                                        type === 'invalid_type' ? '类型错误' : type;

                        const typeColor =
                            type === 'missing_field' ? 'bg-red-100 text-red-800 border-red-200' :
                                type === 'invalid_value' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                    type === 'invalid_format' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                        'bg-blue-100 text-blue-800 border-blue-200';

                        return (
                            <div key={type} className={`border rounded-lg p-4 ${typeColor}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="font-medium">{typeLabel}</span>
                                        <span className="px-2 py-1 bg-white rounded-full text-xs font-semibold">
                                            {errors.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                {onViewDetails && (
                    <Button
                        variant="secondary"
                        onClick={onViewDetails}
                    >
                        📋 查看详情
                    </Button>
                )}

                {onAutoRepair && autoRepairableErrors > 0 && (
                    <Button
                        onClick={onAutoRepair}
                        disabled={isRepairing}
                        loading={isRepairing}
                    >
                        {isRepairing ? '修复中...' : `🔧 自动修复 (${autoRepairableErrors})`}
                    </Button>
                )}

                {onExportReport && (
                    <div className="relative">
                        <Button
                            variant="secondary"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                        >
                            💾 导出报告
                        </Button>

                        {showExportMenu && (
                            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                                <button
                                    onClick={() => {
                                        onExportReport('json');
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                >
                                    JSON 格式
                                </button>
                                <button
                                    onClick={() => {
                                        onExportReport('text');
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-t border-gray-100"
                                >
                                    文本格式
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recommendations */}
            {autoRepairableErrors > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <span className="text-blue-500 text-xl">💡</span>
                        <div>
                            <h5 className="font-medium text-blue-900">建议</h5>
                            <p className="text-blue-700 text-sm mt-1">
                                系统可以自动修复 {autoRepairableErrors} 个错误。
                                建议先使用自动修复功能，然后手动处理剩余的 {manualRepairErrors} 个错误。
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
