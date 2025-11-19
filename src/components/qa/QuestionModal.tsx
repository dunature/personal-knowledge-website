/**
 * 大问题详情弹窗组件
 * 全屏显示大问题的详细信息、小问题和时间线回答
 */

import React, { useState, useMemo } from 'react';
import type { BigQuestion, SubQuestion, TimelineAnswer, QuestionStatus } from '@/types/question';
import { STATUS_COLORS } from '@/types/question';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownOption } from '@/components/ui/Dropdown';
import { MarkdownPreview } from '@/components/common/MarkdownPreview';
import { SubQuestion as SubQuestionComponent } from './SubQuestion';
import { ValidationErrorDialog } from './ValidationErrorDialog';
import { QuestionStatusValidator } from '@/utils/questionStatusValidator';

interface QuestionModalProps {
    question: BigQuestion;
    subQuestions?: SubQuestion[];
    answers?: Record<string, TimelineAnswer[]>;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onStatusChange?: (status: QuestionStatus) => void;
    onEditSummary?: () => void;
    onEditSubQuestion?: (id: string) => void;
    onDeleteSubQuestion?: (id: string) => void;
    onAddAnswer?: (subQuestionId: string) => void;
    onEditAnswer?: (answerId: string) => void;
    onDeleteAnswer?: (answerId: string) => void;
    onAddSubQuestion?: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
    question,
    subQuestions = [],
    answers = {},
    isOpen,
    onClose,
    onEdit,
    onDelete,
    onStatusChange,
    onEditSummary,
    onEditSubQuestion,
    onDeleteSubQuestion,
    onAddAnswer,
    onEditAnswer,
    onDeleteAnswer,
    onAddSubQuestion,
}) => {
    const [showValidationError, setShowValidationError] = useState(false);
    const [validationResult, setValidationResult] = useState<ReturnType<typeof QuestionStatusValidator.validateStatusChange> | null>(null);

    // 验证状态变更
    const handleStatusChange = (newStatus: QuestionStatus) => {
        const result = QuestionStatusValidator.validateStatusChange(
            newStatus,
            question.status,
            subQuestions,
            question.summary || ''
        );

        if (!result.isValid) {
            setValidationResult(result);
            setShowValidationError(true);
            return;
        }

        onStatusChange?.(newStatus);
    };

    // 动态生成状态选项，根据验证结果禁用"已解决"选项
    const statusOptions: DropdownOption[] = useMemo(() => {
        const solvedValidation = QuestionStatusValidator.validateStatusChange(
            'solved',
            question.status,
            subQuestions,
            question.summary || ''
        );

        return [
            { value: 'unsolved', label: STATUS_COLORS.unsolved.label },
            { value: 'solving', label: STATUS_COLORS.solving.label },
            {
                value: 'solved',
                label: STATUS_COLORS.solved.label,
                disabled: !solvedValidation.isValid,
                disabledReason: solvedValidation.errors.length > 0
                    ? solvedValidation.errors[0].message
                    : undefined,
            },
        ];
    }, [question, subQuestions]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            fullScreen={true}
            title=""
        >
            <div className="h-full flex flex-col">
                {/* 顶部栏 */}
                <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0] bg-white sticky top-0 z-10">
                    {/* 左侧：返回按钮 */}
                    <Button
                        variant="text"
                        onClick={onClose}
                        className="text-[#0047AB] hover:text-[#003580]"
                    >
                        ← 返回
                    </Button>

                    {/* 中间：标题 */}
                    <h2 className="text-2xl font-bold text-[#333] flex-1 text-center px-8">
                        {question.title}
                    </h2>

                    {/* 右侧：编辑、删除、状态、关闭按钮 */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="small"
                            onClick={onEdit}
                        >
                            编辑
                        </Button>

                        <Button
                            variant="outline"
                            size="small"
                            onClick={onDelete}
                            className="text-[#E65100] border-[#E65100] hover:bg-[#FFF3E0]"
                        >
                            删除
                        </Button>

                        <Dropdown
                            options={statusOptions}
                            value={question.status}
                            onChange={(value) => handleStatusChange(value as QuestionStatus)}
                        />

                        <Button
                            variant="text"
                            onClick={onClose}
                            className="text-[#666] hover:text-[#333] text-xl"
                        >
                            ×
                        </Button>
                    </div>
                </div>

                {/* 内容区域 - 可独立滚动 */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* 大问题描述 */}
                        <section className="bg-white p-6 rounded-lg border border-[#E0E0E0]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[#333]">问题描述</h3>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={onEdit}
                                    className="text-[#0047AB]"
                                >
                                    编辑
                                </Button>
                            </div>
                            <MarkdownPreview content={question.description} />
                        </section>

                        {/* THE END 最终总结 */}
                        <section className="bg-[#FFF9E6] p-6 rounded-lg border-2 border-[#FFD700]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[#333]">
                                    THE END - 最终总结
                                </h3>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={onEditSummary}
                                    className="text-[#0047AB]"
                                >
                                    编辑
                                </Button>
                            </div>
                            <MarkdownPreview content={question.summary || '暂无总结'} />
                        </section>

                        {/* 小问题列表 */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#333] mb-4">
                                小问题列表
                            </h3>
                            <div className="space-y-3">
                                {subQuestions.length === 0 ? (
                                    <div className="text-center py-8 bg-[#F5F5F5] rounded-lg">
                                        <p className="text-[#999]">暂无小问题</p>
                                    </div>
                                ) : (
                                    subQuestions.map((subQuestion) => (
                                        <SubQuestionComponent
                                            key={subQuestion.id}
                                            subQuestion={subQuestion}
                                            answers={answers[subQuestion.id] || []}
                                            onEdit={onEditSubQuestion}
                                            onDelete={onDeleteSubQuestion}
                                            onAddAnswer={onAddAnswer}
                                            onEditAnswer={onEditAnswer}
                                            onDeleteAnswer={onDeleteAnswer}
                                        />
                                    ))
                                )}
                            </div>

                            {/* 添加小问题按钮 */}
                            <div className="mt-4 flex justify-center">
                                <Button
                                    variant="outline"
                                    onClick={onAddSubQuestion}
                                >
                                    + 添加小问题
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* 验证错误对话框 */}
            <ValidationErrorDialog
                isOpen={showValidationError}
                onClose={() => setShowValidationError(false)}
                errors={validationResult?.errors || []}
            />
        </Modal>
    );
};
