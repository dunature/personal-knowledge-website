/**
 * 资源Context
 * 管理资源列表、分类、标签筛选、搜索和排序状态
 */

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Resource } from '@/types/resource';
import type { SortOption } from '@/components/resource/SearchBar';

interface ResourceContextState {
    // 资源数据
    resources: Resource[];
    categories: string[];
    allTags: string[];

    // 筛选和搜索状态
    selectedCategory: string;
    selectedTags: string[];
    searchQuery: string;
    sortOption: SortOption;

    // 方法
    setResources: (resources: Resource[]) => void;
    addResource: (resource: Resource) => void;
    updateResource: (id: string, updates: Partial<Resource>) => void;
    deleteResource: (id: string) => void;

    setSelectedCategory: (category: string) => void;
    setSelectedTags: (tags: string[]) => void;
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    clearTags: () => void;

    setSearchQuery: (query: string) => void;
    setSortOption: (option: SortOption) => void;

    // 计算属性
    filteredResources: Resource[];
}

const ResourceContext = createContext<ResourceContextState | undefined>(undefined);

interface ResourceProviderProps {
    children: ReactNode;
    initialResources?: Resource[];
}

export const ResourceProvider: React.FC<ResourceProviderProps> = ({
    children,
    initialResources = [],
}) => {
    const [resources, setResources] = useState<Resource[]>(initialResources);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>('newest');

    // 获取所有分类
    const categories = React.useMemo(() => {
        const cats = new Set(resources.map(r => r.category));
        return Array.from(cats);
    }, [resources]);

    // 获取所有标签
    const allTags = React.useMemo(() => {
        const tags = new Set<string>();
        resources.forEach(r => {
            r.content_tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [resources]);

    // 添加资源
    const addResource = useCallback((resource: Resource) => {
        setResources(prev => [...prev, resource]);
    }, []);

    // 更新资源
    const updateResource = useCallback((id: string, updates: Partial<Resource>) => {
        setResources(prev =>
            prev.map(r => (r.id === id ? { ...r, ...updates } : r))
        );
    }, []);

    // 删除资源
    const deleteResource = useCallback((id: string) => {
        setResources(prev => prev.filter(r => r.id !== id));
    }, []);

    // 添加标签
    const addTag = useCallback((tag: string) => {
        setSelectedTags(prev => {
            if (prev.includes(tag)) return prev;
            return [...prev, tag];
        });
    }, []);

    // 移除标签
    const removeTag = useCallback((tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    }, []);

    // 清除所有标签
    const clearTags = useCallback(() => {
        setSelectedTags([]);
    }, []);

    // 筛选和排序资源
    const filteredResources = React.useMemo(() => {
        let filtered = resources;

        // 分类筛选
        if (selectedCategory) {
            filtered = filtered.filter(r => r.category === selectedCategory);
        }

        // 标签筛选（AND逻辑）
        if (selectedTags.length > 0) {
            filtered = filtered.filter(r =>
                selectedTags.every(tag => r.content_tags.includes(tag))
            );
        }

        // 搜索筛选
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r => {
                const matchTitle = r.title.toLowerCase().includes(query);
                const matchTags = r.content_tags.some(tag =>
                    tag.toLowerCase().includes(query)
                );
                const matchAuthor = r.author.toLowerCase().includes(query);
                const matchRecommendation = r.recommendation
                    .toLowerCase()
                    .includes(query);

                return matchTitle || matchTags || matchAuthor || matchRecommendation;
            });
        }

        // 排序
        const sorted = [...filtered].sort((a, b) => {
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

        return sorted;
    }, [resources, selectedCategory, selectedTags, searchQuery, sortOption]);

    const value: ResourceContextState = {
        resources,
        categories,
        allTags,
        selectedCategory,
        selectedTags,
        searchQuery,
        sortOption,
        setResources,
        addResource,
        updateResource,
        deleteResource,
        setSelectedCategory,
        setSelectedTags,
        addTag,
        removeTag,
        clearTags,
        setSearchQuery,
        setSortOption,
        filteredResources,
    };

    return (
        <ResourceContext.Provider value={value}>
            {children}
        </ResourceContext.Provider>
    );
};

// Hook to use ResourceContext
export const useResources = (): ResourceContextState => {
    const context = useContext(ResourceContext);
    if (!context) {
        throw new Error('useResources must be used within a ResourceProvider');
    }
    return context;
};
