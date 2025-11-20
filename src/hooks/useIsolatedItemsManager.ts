/**
 * Hook for managing isolated items manual repair
 * 管理隔离项的手动修复
 */

import { useState, useCallback } from 'react';
import { dataDetector } from '@/services/repair';
import type { IsolatedItem } from '@/types/dataRepair';

interface UseIsolatedItemsManagerState {
    isolatedItems: IsolatedItem[];
    isValidating: boolean;
}

export function useIsolatedItemsManager(initialItems: IsolatedItem[] = []) {
    const [state, setState] = useState<UseIsolatedItemsManagerState>({
        isolatedItems: initialItems,
        isValidating: false
    });

    /**
     * 修复单个隔离项
     */
    const fixItem = useCallback((itemIndex: number, fixedData: any) => {
        setState(prev => {
            const item = prev.isolatedItems[itemIndex];
            if (!item) return prev;

            // 验证修复后的数据
            const errors = validateItem(fixedData);

            if (errors.length === 0) {
                // 修复成功，从隔离列表中移除
                const newIsolatedItems = prev.isolatedItems.filter((_, index) => index !== itemIndex);
                return {
                    ...prev,
                    isolatedItems: newIsolatedItems
                };
            } else {
                // 仍有错误，更新错误列表
                const newIsolatedItems = [...prev.isolatedItems];
                newIsolatedItems[itemIndex] = {
                    ...item,
                    originalItem: fixedData,
                    errors,
                    reason: `仍有 ${errors.length} 个错误需要修复`
                };
                return {
                    ...prev,
                    isolatedItems: newIsolatedItems
                };
            }
        });
    }, []);

    /**
     * 重新验证所有隔离项
     */
    const revalidateAll = useCallback(() => {
        setState(prev => {
            const revalidatedItems = prev.isolatedItems
                .map(item => {
                    const errors = validateItem(item.originalItem);
                    if (errors.length === 0) {
                        return null; // 已修复，将被过滤掉
                    }
                    return {
                        ...item,
                        errors,
                        reason: `仍有 ${errors.length} 个错误需要修复`
                    };
                })
                .filter((item): item is IsolatedItem => item !== null);

            return {
                ...prev,
                isolatedItems: revalidatedItems
            };
        });
    }, []);

    /**
     * 更新隔离项列表
     */
    const setIsolatedItems = useCallback((items: IsolatedItem[]) => {
        setState(prev => ({
            ...prev,
            isolatedItems: items
        }));
    }, []);

    /**
     * 获取已修复的项（用于合并回主数据）
     */
    const getFixedItems = useCallback(() => {
        // 这个方法在实际使用中需要跟踪哪些项已被修复
        // 目前我们通过从列表中移除来表示修复
        return [];
    }, []);

    return {
        isolatedItems: state.isolatedItems,
        isValidating: state.isValidating,
        fixItem,
        revalidateAll,
        setIsolatedItems,
        getFixedItems
    };
}

/**
 * 验证单个数据项
 */
function validateItem(item: any) {
    // 根据数据类型进行验证
    if (item.question && item.subQuestions) {
        // 大问题
        const result = dataDetector.detectErrors({ questions: [item] });
        return result.errorsByType.questions.filter(
            (error: any) => error.itemIndex === 0
        );
    } else if (item.subQuestion && item.answer) {
        // 子问题
        const result = dataDetector.detectErrors({
            questions: [{
                id: 'temp',
                question: 'temp',
                subQuestions: [item],
                status: 'unsolved',
                createdAt: new Date().toISOString()
            }]
        });
        return result.errorsByType.subQuestions;
    } else if (item.title && item.url) {
        // 资源
        const result = dataDetector.detectErrors({ resources: [item] });
        return result.errorsByType.resources.filter(
            (error: any) => error.itemIndex === 0
        );
    }

    return [];
}
