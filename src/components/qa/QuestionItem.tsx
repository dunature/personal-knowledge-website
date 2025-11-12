/**
 * 问题列表项组件
 * 显示单个大问题的摘要信息
 */

import React from 'react';
import type { BigQuestion } from '@/types/question';
import { STATUS_COLORS } from '@/types/question';
import { Tag } from '@/components/ui/Tag';

interface QuestionItemProps {
    question: BigQuestion;
    subQuestionCount?: number;
    onClick: (id: string) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
    question,
    subQuestionCount = 0,
    onClick,
}) => {
    const statusConfig = STATUS_COLORS[question.status];
    const updateDate = new Date(question.updated_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\//g, '.');

    return (
        <div
            onClick={() => onClick(question.id)}
            className="
                flex items-center gap-4 p-4 
                bg-white border border-[#E0E0E0] rounded-lg
                hover:bg-[#F5F5F5] 
                transition-fast cursor-pointer
            "
        >
            {/* 状态标签 */}
            <Tag
                variant="status"
                color={{ bg: statusConfig.bg, text: statusConfig.text }}
            >
                {statusConfig.label}
            </Tag>

            {/* 标题 */}
            <h3 className="flex-1 text-base font-semibold text-[#333] truncate">
                {question.title}
            </h3>

            {/* 更新时间 */}
            <span className="text-sm text-[#999]">
                更新: {updateDate}
            </span>

            {/* 小问题数量 */}
            <span className="text-sm text-[#666]">
                小问题: {subQuestionCount}
            </span>
        </div>
    );
};
