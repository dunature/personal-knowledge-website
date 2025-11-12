/**
 * 自动保存Hook
 * 实现3秒防抖自动保存功能
 */

import { useEffect, useRef, useState } from 'react';

export interface UseAutoSaveOptions {
    data: any;
    onSave: () => Promise<void> | void;
    delay?: number;
    enabled?: boolean;
}

export interface UseAutoSaveReturn {
    isSaving: boolean;
    lastSaved: Date | null;
    saveNow: () => Promise<void>;
}

export const useAutoSave = ({
    data,
    onSave,
    delay = 3000,
    enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn => {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const previousDataRef = useRef<any>(data);

    // 立即保存
    const saveNow = async () => {
        if (isSaving) return;

        setIsSaving(true);
        try {
            await onSave();
            setLastSaved(new Date());
        } catch (error) {
            console.error('Auto-save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // 防抖自动保存
    useEffect(() => {
        if (!enabled) return;

        // 检查数据是否变化
        const dataChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);

        if (!dataChanged) return;

        // 清除之前的定时器
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 设置新的定时器
        timeoutRef.current = setTimeout(() => {
            saveNow();
            previousDataRef.current = data;
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, enabled, delay]);

    return {
        isSaving,
        lastSaved,
        saveNow,
    };
};
