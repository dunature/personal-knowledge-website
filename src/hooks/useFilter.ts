/**
 * useFilter Hook
 * 封装通用的筛选逻辑
 */

import { useState, useCallback, useMemo } from 'react';

export interface FilterOptions<T> {
    items: T[];
    filterFn: (item: T, filters: Record<string, any>) => boolean;
    sortFn?: (a: T, b: T, sortKey: string) => number;
}

export interface UseFilterReturn<T> {
    filteredItems: T[];
    filters: Record<string, any>;
    sortKey: string;
    setFilter: (key: string, value: any) => void;
    clearFilter: (key: string) => void;
    clearAllFilters: () => void;
    setSortKey: (key: string) => void;
}

export const useFilter = <T,>({
    items,
    filterFn,
    sortFn,
}: FilterOptions<T>): UseFilterReturn<T> => {
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sortKey, setSortKey] = useState<string>('');

    // 设置单个筛选条件
    const setFilter = useCallback((key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    // 清除单个筛选条件
    const clearFilter = useCallback((key: string) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    }, []);

    // 清除所有筛选条件
    const clearAllFilters = useCallback(() => {
        setFilters({});
    }, []);

    // 筛选和排序
    const filteredItems = useMemo(() => {
        // 筛选
        let filtered = items.filter(item => filterFn(item, filters));

        // 排序
        if (sortFn && sortKey) {
            filtered = [...filtered].sort((a, b) => sortFn(a, b, sortKey));
        }

        return filtered;
    }, [items, filters, sortKey, filterFn, sortFn]);

    return {
        filteredItems,
        filters,
        sortKey,
        setFilter,
        clearFilter,
        clearAllFilters,
        setSortKey,
    };
};
