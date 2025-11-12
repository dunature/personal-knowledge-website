/**
 * 搜索栏组件
 * 支持实时搜索和排序选项
 */

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownOption } from '@/components/ui/Dropdown';

export type SortOption = 'newest' | 'oldest' | 'name_asc';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onSortChange: (sort: SortOption) => void;
    placeholder?: string;
    debounceMs?: number;
}

const sortOptions: DropdownOption[] = [
    { value: 'newest', label: '最新' },
    { value: 'oldest', label: '最旧' },
    { value: 'name_asc', label: '名称 A→Z' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    onSortChange,
    placeholder = '搜索资源标题、标签、作者...',
    debounceMs = 300,
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [sortValue, setSortValue] = useState<SortOption>('newest');

    // 防抖搜索
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchValue);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchValue, debounceMs, onSearch]);

    // 处理排序变化
    const handleSortChange = (value: string) => {
        const newSort = value as SortOption;
        setSortValue(newSort);
        onSortChange(newSort);
    };

    return (
        <div className="flex gap-4 items-center mb-6">
            <div className="flex-1">
                <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={placeholder}
                    fullWidth
                />
            </div>
            <div className="min-w-[200px]">
                <Dropdown
                    options={sortOptions}
                    value={sortValue}
                    onChange={handleSortChange}
                    placeholder="排序方式"
                    className="w-full"
                />
            </div>
        </div>
    );
};
