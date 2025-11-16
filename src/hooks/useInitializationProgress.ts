/**
 * 初始化进度管理 Hook
 * 管理初始化过程中的进度状态
 */

import { useState, useCallback } from 'react';
import type { InitializationState, InitStep } from '@/types/sync';

export function useInitializationProgress() {
    const [state, setState] = useState<InitializationState>({
        status: 'idle',
        progress: 0,
        currentStep: '准备初始化...',
    });

    /**
     * 更新进度
     */
    const updateProgress = useCallback((progress: number, message: string) => {
        setState((prev) => ({
            ...prev,
            progress,
            currentStep: message,
        }));
    }, []);

    /**
     * 设置状态
     */
    const setStatus = useCallback((status: InitStep) => {
        setState((prev) => ({
            ...prev,
            status,
        }));
    }, []);

    /**
     * 设置错误
     */
    const setError = useCallback((error: string) => {
        setState((prev) => ({
            ...prev,
            status: 'error',
            error,
            progress: 0,
        }));
    }, []);

    /**
     * 设置 Gist ID
     */
    const setGistId = useCallback((gistId: string) => {
        setState((prev) => ({
            ...prev,
            gistId,
        }));
    }, []);

    /**
     * 重置状态
     */
    const reset = useCallback(() => {
        setState({
            status: 'idle',
            progress: 0,
            currentStep: '准备初始化...',
        });
    }, []);

    /**
     * 完成初始化
     */
    const complete = useCallback(() => {
        setState((prev) => ({
            ...prev,
            status: 'complete',
            progress: 100,
            currentStep: '初始化完成！',
        }));
    }, []);

    return {
        state,
        updateProgress,
        setStatus,
        setError,
        setGistId,
        reset,
        complete,
    };
}
