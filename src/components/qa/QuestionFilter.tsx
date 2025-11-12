/**
 * 问题筛选组件
 * 支持按状态和分类筛选
 */

import React from 'react';
import type { QuestionStatus } from '@/types/question';
import { STATUS_COLORS } from '@/types/question';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownOption } from '@/components/ui/Dropdown';

export type QuestionSortOption = 'newest' | 'oldest';

interface QuestionFilterProps {
    selectedStatus: QuestionStatus | 'all';
    selectedCategory: string;
    sortOption: QuestionSortOption;
    categories: string[];
    onStatusChange: (status: QuestionStatus | 'all') => void;
    onCategoryChange: (category: string) => void;
    onSortChange: (sort: QuestionSortOption) => void;
}

export const QuestionFilter: React.FC<QuestionFilterProps> = ({
    selectedStatus,
    selectedCategory,
    sortOption,
    categories,
    onStatusChange,
    onCategoryChange,
    onSortChange,
}) => {
    // 状态筛选选项
    const statusOptions: DropdownOption[] = [
        { value: 'all', label: '全部' },
        { value: 'unsolved', label: STATUS_COLORS.unsolved.label },
        { value: 'solving', label: STATUS_COLORS.solving.label },
        { value: 'solved', label: STATUS_COLORS.solved.label },
    ];

    // 分类筛选选项
    const categoryOptions: DropdownOption[] = [
        { value: '', label: '全部分类' },
        ...categories.map((cat) => ({ value: cat, label: cat })),
    ];

    // 排序选项
    const sortOptions: DropdownOption[] = [
        { value: 'newest', label: '最新更新' },
        { value: 'oldest', label: '最早更新' },
    ];

    return (
        <div className="flex gap-4 items-center p-4 bg-white border border-[#E0E0E0] rounded-lg">
            <span className="text-sm text-[#666] font-medium">筛选：</span>

            <div className="flex gap-3 flex-1">
                <Dropdown
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={(value) => onStatusChange(value as QuestionStatus | 'all')}
                    placeholder="状态"
                />

                <Dropdown
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={onCategoryChange}
                    placeholder="分类"
                />

                <Dropdown
                    options={sortOptions}
                    value={sortOption}
                    onChange={(value) => onSortChange(value as QuestionSortOption)}
                    placeholder="排序"
                />
            </div>
        </div>
    );
};
