/**
 * Error Detail View Component
 * Displays detailed list of errors organized by data type
 */

import React, { useState } from 'react';
import type { ItemError, ValidationResult } from '@/types/dataRepair';

interface ErrorDetailViewProps {
    validationResult: ValidationResult;
    onClose?: () => void;
}

interface ErrorItemProps {
    error: ItemError;
    index: number;
}

function ErrorItem({ error, index }: ErrorItemProps) {
    const [expanded, setExpanded] = useState(false);

    const errorTypeLabel =
        error.errorType === 'missing_field' ? '缺失字段' :
            error.errorType === 'invalid_value' ? '无效值' :
                error.errorType === 'invalid_format' ? '格式错误' :
                    error.errorType === 'invalid_type' ? '类型错误' : error.errorType;

    const errorTypeColor =
        error.errorType === 'missing_field' ? 'text-red-600' :
            error.errorType === 'invalid_value' ? 'text-orange-600' :
                error.errorType === 'invalid_format' ? 'text-yellow-600' :
                    'text-blue-600';

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                            #{index + 1}
                        </span>
                        <span className={`text-sm font-semibold ${errorTypeColor}`}>
                            {errorTypeLabel}
                        </span>
                        {error.itemId && (
                            <span className="text-xs text-gray-500">
                                ID: {error.itemId.substring(0, 8)}...
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">字段:</span>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {error.field}
                            </code>
                        </div>

                        <div className="text-sm text-gray-600">
                            <span className="font-medium">错误信息:</span> {error.message}
                        </div>

                        {error.currentValue !== undefined && (
                            <div className="flex items-start space-x-2">
                                <span className="text-sm font-medium text-gray-700">当前值:</span>
                                <code className="text-sm bg-red-50 px-2 py-1 rounded text-red-700 break-all">
                                    {JSON.stringify(error.currentValue)}
                                </code>
                            </div>
                        )}

                        {error.expectedFormat && (
                            <div className="flex items-start space-x-2">
                                <span className="text-sm font-medium text-gray-700">期望格式:</span>
                                <code className="text-sm bg-green-50 px-2 py-1 rounded text-green-700">
                                    {error.expectedFormat}
                                </code>
                            </div>
                        )}
                    </div>
                </div>

                {error.itemIndex !== undefined && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                        {expanded ? '收起' : '展开'}
                    </button>
                )}
            </div>

            {expanded && error.itemIndex !== undefined && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        <span className="font-medium">数据项索引:</span> {error.itemIndex}
                    </div>
                </div>
            )}
        </div>
    );
}

interface ErrorGroupProps {
    title: string;
    errors: ItemError[];
    icon: string;
    colorClass: string;
}

function ErrorGroup({ title, errors, icon, colorClass }: ErrorGroupProps) {
    const [collapsed, setCollapsed] = useState(false);

    if (errors.length === 0) return null;

    return (
        <div className={`border rounded-lg ${colorClass}`}>
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-between p-4 hover:bg-opacity-50 transition-colors"
            >
                <div className="flex items-center space-x-3">
                    <span className="text-xl">{icon}</span>
                    <h4 className="font-semibold">{title}</h4>
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                        {errors.length}
                    </span>
                </div>
                <span className="text-lg">
                    {collapsed ? '▼' : '▲'}
                </span>
            </button>

            {!collapsed && (
                <div className="p-4 pt-0 space-y-3">
                    {errors.map((error, index) => (
                        <ErrorItem key={index} error={error} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function ErrorDetailView({ validationResult, onClose }: ErrorDetailViewProps) {
    const { errorsByType } = validationResult;

    // Organize errors by data type
    const errorsByDataType: Record<string, ItemError[]> = {};

    Object.values(errorsByType).flat().forEach(error => {
        const dataType = error.dataType || 'unknown';
        if (!errorsByDataType[dataType]) {
            errorsByDataType[dataType] = [];
        }
        errorsByDataType[dataType].push(error);
    });

    const dataTypeConfig: Record<string, { title: string; icon: string; colorClass: string }> = {
        bigQuestion: {
            title: '大问题',
            icon: '❓',
            colorClass: 'bg-blue-50 border-blue-200',
        },
        subQuestion: {
            title: '子问题',
            icon: '🔹',
            colorClass: 'bg-purple-50 border-purple-200',
        },
        answer: {
            title: '答案',
            icon: '💬',
            colorClass: 'bg-green-50 border-green-200',
        },
        resource: {
            title: '资源',
            icon: '📚',
            colorClass: 'bg-yellow-50 border-yellow-200',
        },
        unknown: {
            title: '未知类型',
            icon: '❔',
            colorClass: 'bg-gray-50 border-gray-200',
        },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">错误详情</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        按数据类型组织的详细错误列表
                    </p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                )}
            </div>

            {/* Error Groups by Data Type */}
            <div className="space-y-4">
                {Object.entries(errorsByDataType).map(([dataType, errors]) => {
                    const config = dataTypeConfig[dataType] || dataTypeConfig.unknown;
                    return (
                        <ErrorGroup
                            key={dataType}
                            title={config.title}
                            errors={errors}
                            icon={config.icon}
                            colorClass={config.colorClass}
                        />
                    );
                })}
            </div>

            {/* Summary Footer */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">总错误数:</span>
                    <span className="font-semibold text-gray-900">
                        {Object.values(errorsByType).flat().length}
                    </span>
                </div>
            </div>
        </div>
    );
}
