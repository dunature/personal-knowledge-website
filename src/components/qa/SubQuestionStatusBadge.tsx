/**
 * 小问题状态统计徽章组件
 * 显示小问题的完成状态统计，支持展开查看详情
 */

import React, { useState, useMemo } from 'react';
import type { SubQuestion } from '@/types/question';
import { STATUS_COLORS } from '@/types/question';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Clock } from 'lucide-react';

interface SubQuestionStatusBadgeProps {
    subQuestions: SubQuestion[];
    onClick?: () => void;
    expanded?: boolean;
}

export const SubQuestionStatusBadge: React.FC<SubQuestionStatusBadgeProps> = ({
    subQuestions,
    onClick,
    expanded: controlledExpanded,
}) => {
    const [internalExpanded, setInternalExpanded] = useState(false);

    // 如果提供了 expanded prop，使用受控模式，否则使用内部状态
    const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

    // 计算状态统计
    const stats = useMemo(() => {
        const total = subQuestions.length;
        const solved = subQuestions.filter((sq) => sq.status === 'solved').length;
        const solving = subQuestions.filter((sq) => sq.status === 'solving').length;
        const unsolved = subQuestions.filter((sq) => sq.status === 'unsolved').length;
        const allSolved = solved === total && total > 0;

        return { total, solved, solving, unsolved, allSolved };
    }, [subQuestions]);

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            setInternalExpanded(!expanded);
        }
    };

    // 如果没有小问题，不显示
    if (stats.total === 0) {
        return null;
    }

    // 根据完成状态选择样式
    const containerClass = stats.allSolved
        ? 'bg-[#E8F5E9] border-[#2E7D32]'
        : 'bg-[#FFF9E6] border-[#F57F17]';

    const iconColor = stats.allSolved ? '#2E7D32' : '#F57F17';

    return (
        <div
            className={`border-2 rounded-lg overflow-hidden transition-all ${containerClass}`}
        >
            {/* 统计摘要 - 可点击展开 */}
            <button
                onClick={handleClick}
                className="w-full px-4 py-3 flex items-center justify-between hover:opacity-80 transition-opacity"
            >
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        {stats.allSolved ? (
                            <CheckCircle2 className="w-5 h-5" style={{ color: iconColor }} />
                        ) : (
                            <Clock className="w-5 h-5" style={{ color: iconColor }} />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-[#333]">
                            小问题状态: {stats.solved}/{stats.total} 已解决
                        </p>
                        {!stats.allSolved && (
                            <p className="text-sm text-[#666] mt-0.5">
                                {stats.solving > 0 && `${stats.solving} 个解决中`}
                                {stats.solving > 0 && stats.unsolved > 0 && '，'}
                                {stats.unsolved > 0 && `${stats.unsolved} 个未解决`}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0">
                    {expanded ? (
                        <ChevronUp className="w-5 h-5 text-[#666]" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-[#666]" />
                    )}
                </div>
            </button>

            {/* 详细列表 - 展开时显示 */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-current border-opacity-20">
                    <ul className="space-y-2 mt-3">
                        {subQuestions.map((sq) => {
                            const statusIcon =
                                sq.status === 'solved' ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                                ) : sq.status === 'solving' ? (
                                    <Clock className="w-4 h-4 text-[#F57F17]" />
                                ) : (
                                    <Circle className="w-4 h-4 text-[#E65100]" />
                                );

                            return (
                                <li key={sq.id} className="flex items-center gap-2">
                                    {statusIcon}
                                    <span
                                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                                        style={{
                                            backgroundColor: STATUS_COLORS[sq.status].bg,
                                            color: STATUS_COLORS[sq.status].text,
                                        }}
                                    >
                                        {STATUS_COLORS[sq.status].label}
                                    </span>
                                    <span className="text-sm text-[#666]">{sq.title}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};
