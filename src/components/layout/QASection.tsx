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
    onAddQuestion?: () => void;
}

export const QASection: React.FC<QASectionProps> = ({
    questions,
    subQuestionCounts = {},
    onQuestionClick,
    onAddQuestion,
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

    // 获取二级标题
    const getSubtitle = () => {
        if (!isExpanded) {
            return '解决中';
        }
        if (selectedCategory) {
            return selectedCategory;
        }
        return '全部的';
    };

    // 切换展开/收起状态
    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
        // 收起时重置为默认状态
        if (isExpanded) {
            setSelectedStatus('all');
            setSelectedCategory('');
        }
    };

    // 处理状态切换
    const handleStatusChange = (status: QuestionStatus | 'all') => {
        setSelectedStatus(status);
    };

    // 处理分类切换
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

    // 处理排序变化
    const handleSortChange = (sort: QuestionSortOption) => {
        setSortOption(sort);
    };

    // 筛选和排序问题
    const filteredAndSortedQuestions = useMemo(() => {
        let filtered = questions;

        // 默认模式：只显示"解决中"状态的问题
        if (!isExpanded) {
            filtered = filtered.filter((q) => q.status === 'solving');
        } else {
            // 展开模式：根据选择的状态筛选
            if (selectedStatus !== 'all') {
                filtered = filtered.filter((q) => q.status === selectedStatus);
            }

            // 分类筛选
            if (selectedCategory) {
                filtered = filtered.filter((q) => q.category === selectedCategory);
            }
        }

        // 排序
        const sorted = [...filtered].sort((a, b) => {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return sorted;
    }, [questions, isExpanded, selectedStatus, selectedCategory, sortOption]);

    const displayedQuestions = filteredAndSortedQuestions;

    return (
        <section className="w-full">
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[#0047AB]">
                        我的QAQ
                    </h2>
                    <p className="text-lg text-[#666] mt-2">
                        {getSubtitle()}
                    </p>
                </div>

                {/* 正在解决中 / 全部的 切换按钮 */}
                <Button
                    variant={isExpanded ? 'primary' : 'outline'}
                    onClick={handleToggleExpand}
                    className="min-w-[120px] transition-normal"
                >
                    {isExpanded ? '全部的' : '正在解决中'}
                </Button>
            </div>

            {/* 展开模式下的筛选和排序功能 */}
            {isExpanded && (
                <div className="mb-6 animate-fadeIn">
                    <QuestionFilter
                        selectedStatus={selectedStatus}
                        selectedCategory={selectedCategory}
                        sortOption={sortOption}
                        categories={categories}
                        onStatusChange={handleStatusChange}
                        onCategoryChange={handleCategoryChange}
                        onSortChange={handleSortChange}
                    />
                </div>
            )}

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
            {displayedQuestions.length === 0 && (
                <div className="text-center py-12 bg-[#F5F5F5] rounded-lg">
                    <p className="text-lg text-[#999]">
                        {isExpanded ? '暂无符合条件的问题' : '暂无解决中的问题'}
                    </p>
                </div>
            )}

            {/* 添加大问题按钮 - 仅在展开模式显示 */}
            {isExpanded && onAddQuestion && (
                <div className="flex justify-center mt-6">
                    <Button
                        variant="primary"
                        onClick={onAddQuestion}
                    >
                        + 添加大问题
                    </Button>
                </div>
            )}
        </section>
    );
};
