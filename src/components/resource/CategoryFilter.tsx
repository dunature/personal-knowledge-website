/**
 * 分类筛选组件
 * 显示分类标签列表，支持选择和切换
 */

import React from 'react';

export interface Category {
    id: string;
    name: string;
    color?: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onCategoryChange,
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
                const isSelected = selectedCategory === category.id;

                return (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`
                            px-3 py-1.5 rounded text-sm font-medium
                            transition-fast
                            ${isSelected
                                ? 'bg-[#E3F2FD] text-[#0047AB] font-bold border-2 border-[#0047AB]'
                                : 'bg-[#F5F5F5] text-[#666] border-2 border-transparent hover:bg-[#EEEEEE] hover:text-[#333]'
                            }
                        `}
                    >
                        {category.name}
                    </button>
                );
            })}
        </div>
    );
};
