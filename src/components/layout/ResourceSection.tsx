/**
 * 资源导航区域组件
 * 展示资源卡片网格，支持分类筛选和标签筛选
 */

import React, { useState, useMemo } from 'react';
import { permissionService } from '@/services/permissionService';
import type { Resource } from '@/types/resource';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { CategoryFilter } from '@/components/resource/CategoryFilter';
import type { Category } from '@/components/resource/CategoryFilter';
import { TagFilter } from '@/components/resource/TagFilter';
import { SearchBar } from '@/components/resource/SearchBar';
import type { SortOption } from '@/components/resource/SearchBar';
import { Button } from '@/components/ui/Button';

interface ResourceSectionProps {
    resources: Resource[];
    categories?: Category[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onAdd?: () => void;
    onTagClick?: (tag: string) => void;
}

export const ResourceSection: React.FC<ResourceSectionProps> = ({
    resources,
    categories = [],
    onEdit,
    onDelete,
    onAdd,
    onTagClick,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const canAdd = permissionService.shouldShowAddButtons();

    // 获取二级标题
    const getSubtitle = () => {
        if (!isExpanded) {
            return '流放中';
        }
        if (selectedCategory) {
            return selectedCategory;
        }
        return '全部的';
    };

    // 切换展开/收起状态
    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
        // 收起时清除分类选择
        if (isExpanded) {
            setSelectedCategory('');
        }
    };

    // 处理分类切换
    const handleCategoryChange = (categoryId: string) => {
        // 空字符串表示"全部"
        setSelectedCategory(categoryId);
    };

    // 处理标签点击 - 自动切换到ALL TIME模式并添加标签筛选
    const handleTagClick = (tag: string) => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        onTagClick?.(tag);
    };

    // 移除单个标签
    const handleRemoveTag = (tag: string) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    // 清除所有标签筛选
    const handleClearTags = () => {
        setSelectedTags([]);
    };

    // 处理搜索
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // 处理排序变化
    const handleSortChange = (sort: SortOption) => {
        setSortOption(sort);
    };

    // 根据选中的分类、标签和搜索关键词筛选并排序资源
    const filteredAndSortedResources = useMemo(() => {
        // 1. 筛选
        let filtered = resources.filter((resource) => {
            // 分类筛选
            if (selectedCategory && resource.category !== selectedCategory) {
                return false;
            }
            // 标签筛选（AND逻辑：资源必须包含所有选中的标签）
            if (selectedTags.length > 0) {
                const hasAllTags = selectedTags.every((tag) =>
                    resource.content_tags.includes(tag)
                );
                if (!hasAllTags) return false;
            }
            // 搜索筛选（搜索标题、标签、作者、推荐语）
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchTitle = resource.title.toLowerCase().includes(query);
                const matchTags = resource.content_tags.some((tag) =>
                    tag.toLowerCase().includes(query)
                );
                const matchAuthor = resource.author.toLowerCase().includes(query);
                const matchRecommendation = resource.recommendation
                    .toLowerCase()
                    .includes(query);

                if (!matchTitle && !matchTags && !matchAuthor && !matchRecommendation) {
                    return false;
                }
            }
            return true;
        });

        // 2. 排序
        filtered.sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'name_asc':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [resources, selectedCategory, selectedTags, searchQuery, sortOption]);

    return (
        <section className="w-full">
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[#0047AB]">
                        我的流浪记录
                    </h2>
                    <p className="text-lg text-[#666] mt-2">
                        {getSubtitle()}
                    </p>
                </div>

                {/* all time / ALL TIME 切换按钮 */}
                <Button
                    variant={isExpanded ? 'primary' : 'outline'}
                    onClick={handleToggleExpand}
                    className="min-w-[120px] transition-normal"
                >
                    {isExpanded ? 'ALL TIME' : 'all time'}
                </Button>
            </div>

            {/* 分类筛选栏 - 仅在展开模式显示 */}
            {isExpanded && categories.length > 0 && (
                <div className="mb-6 animate-fadeIn">
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>
            )}

            {/* 标签筛选栏 - 显示已选标签 */}
            {selectedTags.length > 0 && (
                <div className="mb-6">
                    <TagFilter
                        selectedTags={selectedTags}
                        onRemoveTag={handleRemoveTag}
                        onClearAll={handleClearTags}
                    />
                </div>
            )}

            {/* 搜索和排序栏 - 仅在展开模式显示 */}
            {isExpanded && (
                <div className="mb-6 animate-fadeIn">
                    <SearchBar
                        onSearch={handleSearch}
                        onSortChange={handleSortChange}
                    />

                    {/* 添加资源按钮 - 仅在拥有者模式显示 */}
                    {onAdd && canAdd && (
                        <div className="flex justify-center mt-4">
                            <Button
                                variant="primary"
                                onClick={onAdd}
                            >
                                + 添加资源
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* 资源卡片网格 */}
            <div className="grid grid-cols-3 gap-x-5 gap-y-6">
                {filteredAndSortedResources.map((resource) => (
                    <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onTagClick={handleTagClick}
                    />
                ))}
            </div>

            {/* 空状态 */}
            {filteredAndSortedResources.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-[#999]">
                        {searchQuery.trim()
                            ? '未找到相关资源，请尝试其他关键词'
                            : '暂无资源'}
                    </p>
                </div>
            )}
        </section>
    );
};
