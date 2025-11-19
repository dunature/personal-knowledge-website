/**
 * 验证错误对话框组件
 * 显示大问题状态验证失败的详细信息
 */

import React from 'react';
import type { ValidationError } from '@/utils/questionStatusValidator';
import { STATUS_COLORS } from '@/types/question';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, X, AlertCircle } from 'lucide-react';

interface ValidationErrorDialogProps {
    isOpen: boolean;
    errors: ValidationError[];
    onClose: () => void;
}

export const ValidationErrorDialog: React.FC<ValidationErrorDialogProps> = ({
    isOpen,
    errors,
    onClose,
}) => {
    if (errors.length === 0) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
        >
            <div className="p-6">
                {/* 标题 */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-[#E65100]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#333]">
                            无法标记为已解决
                        </h3>
                        <p className="text-sm text-[#666] mt-1">
                            以下条件未满足，请完成后再标记为已解决
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-[#999] hover:text-[#333] transition-colors"
                        aria-label="关闭"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 错误列表 */}
                <div className="space-y-4 mb-6">
                    {errors.map((error, index) => (
                        <div
                            key={index}
                            className="bg-[#FFF9E6] border border-[#FFD700] rounded-lg p-4"
                        >
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-[#F57F17] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-[#333] mb-2">
                                        {error.message}
                                    </p>

                                    {/* 未解决小问题列表 */}
                                    {error.type === 'unsolvedSubQuestions' &&
                                        error.details?.unsolvedSubQuestions &&
                                        error.details.unsolvedSubQuestions.length > 0 && (
                                            <ul className="space-y-2 mt-3">
                                                {error.details.unsolvedSubQuestions.map((sq) => (
                                                    <li
                                                        key={sq.id}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <span
                                                            className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                                                            style={{
                                                                backgroundColor: STATUS_COLORS[sq.status].bg,
                                                                color: STATUS_COLORS[sq.status].text,
                                                            }}
                                                        >
                                                            {STATUS_COLORS[sq.status].label}
                                                        </span>
                                                        <span className="text-[#666]">{sq.title}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                    {/* 最终总结提示 */}
                                    {error.type === 'emptySummary' && (
                                        <p className="text-sm text-[#666] mt-2">
                                            请在"THE END - 最终总结"区域填写问题的总结内容
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 底部按钮 */}
                <div className="flex justify-end">
                    <Button
                        variant="primary"
                        onClick={onClose}
                    >
                        我知道了
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
