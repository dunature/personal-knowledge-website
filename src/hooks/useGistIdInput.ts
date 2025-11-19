/**
 * useGistIdInput Hook
 * 提取 Gist ID 输入的核心逻辑，供多个组件复用
 * 包含性能优化：防抖验证、缓存等
 */

import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { gistService } from '@/services/gistService';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { validateGistData } from '@/utils/dataValidation';

// 防抖延迟时间（毫秒）
const DEBOUNCE_DELAY = 300;

interface UseGistIdInputOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

interface UseGistIdInputReturn {
    gistIdInput: string;
    setGistIdInput: (value: string) => void;
    isLoading: boolean;
    error: string | null;
    loadingProgress: number;
    loadingMessage: string;
    handleSubmit: () => Promise<void>;
    validateFormat: (id: string) => boolean;
    clearError: () => void;
}

// Gist ID 格式验证正则表达式（32位十六进制）
const GIST_ID_REGEX = /^[a-f0-9]{32}$/i;

export function useGistIdInput(options?: UseGistIdInputOptions): UseGistIdInputReturn {
    const { setGistId, switchMode } = useAuth();
    const [gistIdInput, setGistIdInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');

    /**
     * 验证 Gist ID 格式
     */
    const validateFormat = useCallback((id: string): boolean => {
        return GIST_ID_REGEX.test(id.trim());
    }, []);

    /**
     * 清除错误
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * 设置 Gist ID 输入值
     */
    const setGistIdInput = useCallback((value: string) => {
        setGistIdInputValue(value);
        // 清除之前的错误
        if (error) {
            setError(null);
        }
    }, [error]);

    /**
     * 处理 Gist ID 提交
     */
    const handleSubmit = useCallback(async () => {
        // Step 0: 基础验证
        if (!gistIdInput.trim()) {
            const errorMsg = '请输入 Gist ID';
            setError(errorMsg);
            options?.onError?.(errorMsg);
            return;
        }

        // Step 1: 验证格式
        if (!validateFormat(gistIdInput)) {
            const errorMsg = 'Gist ID 格式不正确，应该是32位十六进制字符';
            setError(errorMsg);
            options?.onError?.(errorMsg);
            return;
        }

        setIsLoading(true);
        setLoadingProgress(0);
        setLoadingMessage('正在连接到 GitHub...');
        setError(null);

        try {
            const trimmedGistId = gistIdInput.trim();

            // Step 2: 获取 Gist 数据
            setLoadingProgress(20);
            setLoadingMessage('正在加载知识库数据...');
            const gistData = await gistService.getGist(trimmedGistId);

            // Step 3: 验证数据格式
            setLoadingProgress(40);
            setLoadingMessage('正在验证数据...');
            if (!validateGistData(gistData)) {
                throw new Error('数据格式无效');
            }

            // Step 4: 保存到本地缓存
            setLoadingProgress(60);
            setLoadingMessage('正在保存数据...');
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, gistData.resources);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, gistData.questions);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, gistData.subQuestions);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, gistData.answers);
            await cacheService.saveData(STORAGE_KEYS.METADATA, gistData.metadata);

            // Step 5: 保存 Gist ID 并切换模式
            setLoadingProgress(80);
            setLoadingMessage('正在初始化...');
            setGistId(trimmedGistId);
            switchMode('visitor');

            // Step 6: 完成
            setLoadingProgress(100);
            setLoadingMessage('加载完成！');

            // 调用成功回调
            options?.onSuccess?.();
        } catch (err) {
            console.error('加载 Gist 失败:', err);
            setLoadingProgress(0);

            let errorMsg = '加载失败，请稍后重试';

            if (err instanceof Error) {
                if (err.message.includes('404')) {
                    errorMsg = 'Gist 不存在，请检查 ID 是否正确';
                } else if (err.message.includes('403')) {
                    errorMsg = 'Gist 是私有的，需要权限访问';
                } else if (err.message.includes('数据格式')) {
                    errorMsg = 'Gist 数据格式无效，可能不是知识库数据';
                } else if (err.message.includes('不存在') || err.message.includes('无权访问')) {
                    errorMsg = '无法访问该 Gist，请检查 ID 是否正确或 Gist 是否为公开';
                }
            }

            setError(errorMsg);
            options?.onError?.(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [gistIdInput, setGistId, switchMode, validateFormat, options]);

    return {
        gistIdInput,
        setGistIdInput,
        isLoading,
        error,
        loadingProgress,
        loadingMessage,
        handleSubmit,
        validateFormat,
        clearError,
    };
}
