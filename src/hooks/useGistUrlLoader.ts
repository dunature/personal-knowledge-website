/**
 * URL Gist 加载 Hook
 * 解析 URL 参数并自动加载 Gist 数据
 */

import { useState, useEffect, useCallback } from 'react';
import { gistService } from '@/services/gistService';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { validateGistData } from '@/utils/dataValidation';
import type { GistData } from '@/types/gist';

export interface UseGistUrlLoaderReturn {
    isLoading: boolean;
    error: string | null;
    gistId: string | null;
    hasLocalData: boolean;
    localDataStats: DataStats | null;
    remoteDataStats: DataStats | null;
    loadGistFromUrl: () => Promise<void>;
    confirmAndLoad: (useRemote: boolean) => Promise<void>;
    retry: () => void;
    dismiss: () => void;
}

export interface DataStats {
    resources: number;
    questions: number;
    subQuestions: number;
    answers: number;
}

type LoadState = 'idle' | 'loading' | 'conflict' | 'success' | 'error';

export function useGistUrlLoader(): UseGistUrlLoaderReturn {
    const [state, setState] = useState<LoadState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [gistId, setGistId] = useState<string | null>(null);
    const [localDataStats, setLocalDataStats] = useState<DataStats | null>(null);
    const [remoteDataStats, setRemoteDataStats] = useState<DataStats | null>(null);
    const [remoteData, setRemoteData] = useState<GistData | null>(null);

    // 计算数据统计
    const calculateStats = useCallback((data: GistData): DataStats => {
        return {
            resources: data.resources?.length || 0,
            questions: data.questions?.length || 0,
            subQuestions: data.subQuestions?.length || 0,
            answers: data.answers?.length || 0,
        };
    }, []);

    // 检查本地是否有数据
    const checkLocalData = useCallback(async (): Promise<boolean> => {
        const resources = await cacheService.getData(STORAGE_KEYS.RESOURCES);
        const questions = await cacheService.getData(STORAGE_KEYS.QUESTIONS);

        const hasData = (Array.isArray(resources) && resources.length > 0) ||
            (Array.isArray(questions) && questions.length > 0);

        if (hasData) {
            const subQuestions = await cacheService.getData(STORAGE_KEYS.SUB_QUESTIONS) || [];
            const answers = await cacheService.getData(STORAGE_KEYS.ANSWERS) || [];

            setLocalDataStats({
                resources: Array.isArray(resources) ? resources.length : 0,
                questions: Array.isArray(questions) ? questions.length : 0,
                subQuestions: Array.isArray(subQuestions) ? subQuestions.length : 0,
                answers: Array.isArray(answers) ? answers.length : 0,
            });
        }

        return hasData;
    }, []);

    // 保存 Gist 数据到本地
    const saveGistData = useCallback(async (data: GistData): Promise<void> => {
        await cacheService.saveData(STORAGE_KEYS.RESOURCES, data.resources || []);
        await cacheService.saveData(STORAGE_KEYS.QUESTIONS, data.questions || []);
        await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, data.subQuestions || []);
        await cacheService.saveData(STORAGE_KEYS.ANSWERS, data.answers || []);
        if (data.metadata) {
            await cacheService.saveData(STORAGE_KEYS.METADATA, data.metadata);
        }
    }, []);

    // 从 URL 加载 Gist
    const loadGistFromUrl = useCallback(async (): Promise<void> => {
        if (!gistId) return;

        setState('loading');
        setError(null);

        try {
            // 从 GitHub 加载 Gist 数据（公开 Gist 无需 token）
            console.log('Loading Gist from URL:', gistId);
            const data = await gistService.getGist(gistId, undefined);

            // 验证数据格式
            if (!validateGistData(data)) {
                throw new Error('数据格式不正确，请确保 Gist 包含有效的知识库数据');
            }

            // 计算远程数据统计
            const stats = calculateStats(data);
            setRemoteDataStats(stats);
            setRemoteData(data);

            // 检查本地是否有数据
            const hasLocal = await checkLocalData();

            if (hasLocal) {
                // 有本地数据，显示冲突对话框
                setState('conflict');
            } else {
                // 无本地数据，直接保存
                await saveGistData(data);
                setState('success');

                // 清除 URL 参数
                const url = new URL(window.location.href);
                url.searchParams.delete('gist');
                window.history.replaceState({}, '', url.toString());

                // 刷新页面以加载新数据
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        } catch (err) {
            console.error('Failed to load Gist:', err);

            // 根据错误类型设置错误消息
            if (err instanceof Error) {
                if (err.message.includes('404')) {
                    setError('Gist 不存在，请检查分享链接是否正确');
                } else if (err.message.includes('403') || err.message.includes('private')) {
                    setError('无法访问私有 Gist，请确保 Gist 是公开的');
                } else if (err.message.includes('network') || err.message.includes('fetch')) {
                    setError('网络错误，请检查网络连接后重试');
                } else {
                    setError(err.message);
                }
            } else {
                setError('加载失败，请重试');
            }

            setState('error');
        }
    }, [gistId, calculateStats, checkLocalData, saveGistData]);

    // 确认并加载（处理冲突）
    const confirmAndLoad = useCallback(async (useRemote: boolean): Promise<void> => {
        if (!remoteData) return;

        try {
            if (useRemote) {
                // 使用远程数据覆盖本地
                await saveGistData(remoteData);
                setState('success');

                // 清除 URL 参数
                const url = new URL(window.location.href);
                url.searchParams.delete('gist');
                window.history.replaceState({}, '', url.toString());

                // 刷新页面
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                // 保留本地数据，只清除 URL 参数
                const url = new URL(window.location.href);
                url.searchParams.delete('gist');
                window.history.replaceState({}, '', url.toString());

                setState('idle');
                setGistId(null);
            }
        } catch (err) {
            console.error('Failed to save data:', err);
            setError('保存数据失败，请重试');
            setState('error');
        }
    }, [remoteData, saveGistData]);

    // 重试
    const retry = useCallback(() => {
        setError(null);
        setState('idle');
        loadGistFromUrl();
    }, [loadGistFromUrl]);

    // 关闭/取消
    const dismiss = useCallback(() => {
        setState('idle');
        setError(null);
        setGistId(null);

        // 清除 URL 参数
        const url = new URL(window.location.href);
        url.searchParams.delete('gist');
        window.history.replaceState({}, '', url.toString());
    }, []);

    // 初始化：检查 URL 参数
    useEffect(() => {
        const url = new URL(window.location.href);
        const gistParam = url.searchParams.get('gist');

        if (gistParam && gistParam.trim()) {
            console.log('Detected gist parameter in URL:', gistParam);
            setGistId(gistParam.trim());
        }
    }, []);

    // 当检测到 gistId 时自动加载
    useEffect(() => {
        if (gistId && state === 'idle') {
            loadGistFromUrl();
        }
    }, [gistId, state, loadGistFromUrl]);

    return {
        isLoading: state === 'loading',
        error,
        gistId,
        hasLocalData: state === 'conflict',
        localDataStats,
        remoteDataStats,
        loadGistFromUrl,
        confirmAndLoad,
        retry,
        dismiss,
    };
}
