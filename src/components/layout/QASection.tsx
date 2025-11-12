/**
 * 问答板区域组件
 * 展示问题列表，支持展开查看全部
 */

import React, { useState, useMemo } from 'react';
import type { BigQuestion, QuestionStatus } from '@/types/question';
import { QuestionItem } from '@/components/qa/QuestionItem';
import { QuestionFilter } from '@/components/qa/QuestionFilter';
import type { QuestionSortOption } from '@/components/qa/QuestionFilter';
import { Button } from '@/components/ui/Button';

interface QASectionProps {
    questions: BigQuestion[];
    subQuestionCounts?: Record<string, number>;
    onQuestionClick: (id: string) => void;
}

export const QASection: React.FC<QASectionProps> = ({
    questions,
    subQuestionCounts = {},
    onQuestionClick,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<QuestionStatus | 'all'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortOption, setSortOption] = useState<QuestionSortOption>('newest');

    // 获取所有分类
    const categories = useMemo(() => {
        const cats = new Set(questions.map((q) => q.category));
        return Array.from(cats);
    }, [questions]);

    // 筛选和排序问题
    const filteredAndSortedQuestions = useMemo(() => {
        let filtered = questions;

        // 状态筛选
        if (selectedStatus !== 'all') {
            filtered = filtered.filter((q) => q.status === selectedStatus);
        }

        // 分类筛选
        if (selectedCategory) {
            filtered = filtered.filter((q) => q.category === selectedCategory);
        }

        // 排序
        const sorted = [...filtered].sort((a, b) => {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return sorted;
    }, [questions, selectedStatus, selectedCategory, sortOption]);

    // 首页显示最近3个问题
    const displayedQuestions = isExpanded
        ? filteredAndSortedQuestions
        : questions.slice(0, 3);

    return (
        <section className="w-full">
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-[#0047AB]">
                    我的QAQ
                </h2>

                {questions.length > 3 && (
                    <Button
                        variant="text"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[#0047AB] hover:text-[#003580]"
                    >
                        {isExpanded ? '收起' : '查看全部问题 →'}
                    </Button>
                )}
            </div>

            {/* 问题列表 */}
            <div className="space-y-3">
                {displayedQuestions.map((question) => (
                    <QuestionItem
                        key={question.id}
                        question={question}
                        subQuestionCount={subQuestionCounts[question.id] || 0}
                        onClick={onQuestionClick}
                    />
                ))}
            </div>

            {/* 空状态 */}
            {questions.length === 0 && (
                <div className="text-center py-12 bg-[#F5F5F5] rounded-lg">
                    <p className="text-lg text-[#999]">暂无问题</p>
                </div>
            )}

            {/* 展开模式下的筛选和排序功能 */}
            {isExpanded && (
                <div className="mt-6 space-y-4 animate-fadeIn">
                    {categories.length > 0 && (
                        <QuestionFilter
                            selectedStatus={selectedStatus}
                            selectedCategory={selectedCategory}
                            sortOption={sortOption}
                            categories={categories}
                            onStatusChange={setSelectedStatus}
                            onCategoryChange={setSelectedCategory}
                            onSortChange={setSortOption}
                        />
                    )}

                    {/* 添加大问题按钮 */}
                    <div className="flex justify-center">
                        <Button
                            variant="primary"
                            onClick={() => {
                                alert('添加大问题功能');
                            }}
                        >
                            + 添加大问题
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};
