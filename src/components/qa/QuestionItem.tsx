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

export const QuestionItem: React.FC<QuestionItemProps> = React.memo(({
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
                flex items-center gap-4 p-6
                bg-white rounded-lg shadow-card
                hover:shadow-cardHover hover:bg-gray-50
                transition-all duration-200 ease-out
                cursor-pointer
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
            <h3 className="flex-1 text-base font-semibold text-text-primary truncate">
                {question.title}
            </h3>

            {/* 更新时间 */}
            <span className="text-sm text-text-tertiary">
                更新: {updateDate}
            </span>

            {/* 小问题数量 */}
            <span className="text-sm text-text-secondary">
                小问题: {subQuestionCount}
            </span>
        </div>
    );
});
