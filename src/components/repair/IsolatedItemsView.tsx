/**
 * Isolated Items View
 * 显示无法自动修复的数据项，提供手动编辑功能
 */

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import type { IsolatedItem } from '@/types/dataRepair';

interface IsolatedItemsViewProps {
    isOpen: boolean;
    onClose: () => void;
    isolatedItems: IsolatedItem[];
    onItemFixed: (itemIndex: number, fixedData: any) => void;
    onRevalidate: () => void;
}

export function IsolatedItemsView({
    isOpen,
    onClose,
    isolatedItems,
    onItemFixed,
    onRevalidate
}: IsolatedItemsViewProps) {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [editingJson, setEditingJson] = useState<string>('');
    const [jsonError, setJsonError] = useState<string | null>(null);

    const selectedItem = selectedItemIndex !== null ? isolatedItems[selectedItemIndex] : null;

    const handleSelectItem = (index: number) => {
        const item = isolatedItems[index];
        if (item) {
            setSelectedItemIndex(index);
            setEditingJson(JSON.stringify(item.originalItem, null, 2));
            setJsonError(null);
        }
    };

    const handleJsonChange = (value: string) => {
        setEditingJson(value);
        setJsonError(null);
    };

    const handleSaveEdit = () => {
        if (selectedItemIndex === null) return;

        try {
            const parsedData = JSON.parse(editingJson);
            onItemFixed(selectedItemIndex, parsedData);
            setSelectedItemIndex(null);
            setEditingJson('');
            setJsonError(null);
        } catch (error) {
            setJsonError(error instanceof Error ? error.message : 'JSON 格式错误');
        }
    };

    const handleCancelEdit = () => {
        setSelectedItemIndex(null);
        setEditingJson('');
        setJsonError(null);
    };

    const getErrorTypeLabel = (errorType: string) => {
        const labels: Record<string, string> = {
            missing_field: '缺少字段',
            invalid_value: '无效值',
            invalid_type: '类型错误',
            invalid_format: '格式错误',
            constraint_violation: '约束违反',
            unknown: '未知错误'
        };
        return labels[errorType] || errorType;
    };

    const getDataTypeLabel = (item: any) => {
        // 根据数据结构推断类型
        if (item.question && item.subQuestions) return '大问题';
        if (item.subQuestion && item.answer) return '子问题';
        if (item.answer && !item.subQuestion) return '答案';
        if (item.title && item.url) return '资源';
        return '未知类型';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="手动修复数据">
            <div className="space-y-4">
                {/* 说明 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                            <h4 className="font-semibold text-yellow-900 mb-1">需要手动修复</h4>
                            <p className="text-sm text-yellow-800">
                                以下数据项存在严重问题，无法自动修复。请手动编辑 JSON 数据，修复后点击"保存修复"。
                            </p>
                        </div>
                    </div>
                </div>

                {/* 统计信息 */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">
                        共 <span className="font-semibold text-gray-900">{isolatedItems.length}</span> 个数据项需要手动修复
                    </span>
                    <button
                        onClick={onRevalidate}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        重新验证
                    </button>
                </div>

                {/* 数据项列表 */}
                {isolatedItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>太好了！所有数据项都已修复</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {isolatedItems.map((item, index) => (
                            <div
                                key={index}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedItemIndex === index
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleSelectItem(index)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                            {getDataTypeLabel(item.originalItem)}
                                        </span>
                                        <span className="ml-2 text-sm text-gray-600">
                                            索引: {index}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {item.errors.length} 个错误
                                    </span>
                                </div>

                                {/* 错误列表 */}
                                <div className="space-y-1">
                                    {item.errors.slice(0, 3).map((error, errorIndex) => (
                                        <div key={errorIndex} className="flex items-start gap-2 text-sm">
                                            <span className="text-red-500 mt-0.5">•</span>
                                            <div className="flex-1">
                                                <span className="font-medium text-gray-700">{error.field}:</span>
                                                <span className="text-gray-600 ml-1">{getErrorTypeLabel(error.errorType)}</span>
                                                {error.message && (
                                                    <span className="text-gray-500 ml-1">- {error.message}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {item.errors.length > 3 && (
                                        <div className="text-xs text-gray-500 ml-4">
                                            还有 {item.errors.length - 3} 个错误...
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* JSON 编辑器 */}
                {selectedItem && (
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">编辑数据</h4>

                        {/* 错误详情 */}
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <h5 className="text-sm font-medium text-red-900 mb-2">错误详情：</h5>
                            <ul className="space-y-1">
                                {selectedItem.errors.map((error, index) => (
                                    <li key={index} className="text-sm text-red-800">
                                        <span className="font-medium">{error.field}:</span> {error.message}
                                        {error.currentValue !== undefined && (
                                            <span className="text-red-600 ml-1">
                                                (当前值: {JSON.stringify(error.currentValue)})
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* JSON 编辑器 */}
                        <textarea
                            value={editingJson}
                            onChange={(e) => handleJsonChange(e.target.value)}
                            className={`w-full h-64 p-3 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 ${jsonError
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            spellCheck={false}
                        />

                        {/* JSON 错误提示 */}
                        {jsonError && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                                {jsonError}
                            </div>
                        )}

                        {/* 编辑操作按钮 */}
                        <div className="flex justify-end gap-3 mt-3">
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                保存修复
                            </button>
                        </div>
                    </div>
                )}

                {/* 底部操作按钮 */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </Modal>
    );
}
