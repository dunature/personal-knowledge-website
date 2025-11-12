/**
 * 小问题组件
 * 支持折叠/展开，显示时间线回答
 */

import React, { useState } from 'react';
import type { SubQuestion as SubQuestionType, TimelineAnswer as TimelineAnswerType } from '@/types/question';
import { STATUS_COLORS } from '@/types/question';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { TimelineAnswer } from './TimelineAnswer';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface SubQuestionProps {
    subQuestion: SubQuestionType;
    answers?: TimelineAnswerType[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onAddAnswer?: (subQuestionId: string) => void;
    onEditAnswer?: (answerId: string) => void;
    onDeleteAnswer?: (answerId: string) => void;
}

export const SubQuestion: React.FC<SubQuestionProps> = React.memo(({
    subQuestion,
    answers = [],
    onEdit,
    onDelete,
    onAddAnswer,
    onEditAnswer,
    onDeleteAnswer,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const statusConfig = STATUS_COLORS[subQuestion.status];

    // 按时间倒序排列（最新的在前）- 使用useMemo优化
    const sortedAnswers = React.useMemo(() => {
        return [...answers].sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    }, [answers]);

    return (
        <div className="border border-[#E0E0E0] rounded-lg overflow-hidden bg-white">
            {/* 小问题标题行 - 可点击展开/收起 */}
            <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#F5F5F5] transition-fast"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* 展开/收起箭头 */}
                <button
                    className="text-[#666] hover:text-[#333] transition-fast"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                >
                    {isExpanded ? (
                        <ChevronDown size={20} />
                    ) : (
                        <ChevronRight size={20} />
                    )}
                </button>

                {/* 状态标签 */}
                <Tag
                    variant="status"
                    color={{ bg: statusConfig.bg, text: statusConfig.text }}
                >
                    {statusConfig.label}
                </Tag>

                {/* 标题 */}
                <h4 className="flex-1 text-base font-semibold text-[#333]">
                    {subQuestion.title}
                </h4>

                {/* 回答数量 */}
                <span className="text-sm text-[#999]">
                    {answers.length} 个回答
                </span>

                {/* 编辑按钮 */}
                <Button
                    variant="text"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(subQuestion.id);
                    }}
                    className="text-[#0047AB]"
                >
                    编辑
                </Button>

                {/* 删除按钮 */}
                <Button
                    variant="text"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(subQuestion.id);
                    }}
                    className="text-[#E65100]"
                >
                    删除
                </Button>

                {/* 添加回答按钮 */}
                <Button
                    variant="outline"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddAnswer?.(subQuestion.id);
                    }}
                >
                    添加回答
                </Button>
            </div>

            {/* 时间线回答区域 - 展开时显示 */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-[#E0E0E0] animate-fadeIn">
                    {sortedAnswers.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-[#999]">暂无回答</p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {sortedAnswers.map((answer, index) => (
                                <TimelineAnswer
                                    key={answer.id}
                                    answer={answer}
                                    onEdit={onEditAnswer}
                                    onDelete={onDeleteAnswer}
                                    showDivider={index < sortedAnswers.length - 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});
