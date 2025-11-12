import { useState, useCallback } from 'react';
import type { AppError } from '../utils/errorUtils';
import { formatError } from '../utils/errorUtils';

interface UseErrorReturn {
    error: AppError | null;
    setError: (error: unknown) => void;
    clearError: () => void;
    hasError: boolean;
}

/**
 * useError Hook
 * 管理组件的错误状态
 */
export const useError = (): UseErrorReturn => {
    const [error, setErrorState] = useState<AppError | null>(null);

    const setError = useCallback((error: unknown) => {
        const formattedError = formatError(error);
        setErrorState(formattedError);
    }, []);

    const clearError = useCallback(() => {
        setErrorState(null);
    }, []);

    return {
        error,
        setError,
        clearError,
        hasError: error !== null,
    };
};

export default useError;
