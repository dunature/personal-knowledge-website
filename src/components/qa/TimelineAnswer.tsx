/**
 * 时间线回答组件
 * 显示单个回答的时间戳和内容
 */

import React from 'react';
import type { TimelineAnswer as TimelineAnswerType } from '@/types/question';
import { MarkdownPreview } from '@/components/common/MarkdownPreview';
import { Button } from '@/components/ui/Button';

interface TimelineAnswerProps {
    answer: TimelineAnswerType;
    onEdit?: (id: string) => void;
    showDivider?: boolean;
}

export const TimelineAnswer: React.FC<TimelineAnswerProps> = ({
    answer,
    onEdit,
    showDivider = true,
}) => {
    // 格式化时间戳为 YYYY.MM.DD HH:MM
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    return (
        <div className="animate-fadeIn">
            <div className="py-4">
                {/* 时间戳和编辑按钮 */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#999]">
                        {formatTimestamp(answer.timestamp)}
                    </span>
                    {onEdit && (
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => onEdit(answer.id)}
                            className="text-[#0047AB] text-xs"
                        >
                            编辑
                        </Button>
                    )}
                </div>

                {/* 回答内容 */}
                <MarkdownPreview content={answer.content} />
            </div>

            {/* 分隔线 */}
            {showDivider && (
                <div className="border-t border-dashed border-[#E0E0E0]" />
            )}
        </div>
    );
};
