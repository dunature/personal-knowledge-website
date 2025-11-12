/**
 * 错误处理工具函数
 */

export interface AppError {
    type: 'network' | 'validation' | 'notFound' | 'permission' | 'general';
    message: string;
    code?: string;
    details?: unknown;
}

/**
 * 创建应用错误对象
 */
export const createError = (
    type: AppError['type'],
    message: string,
    code?: string,
    details?: unknown
): AppError => {
    return {
        type,
        message,
        code,
        details,
    };
};

/**
 * 判断是否为网络错误
 */
export const isNetworkError = (error: unknown): boolean => {
    if (error instanceof Error) {
        return (
            error.message.includes('fetch') ||
            error.message.includes('network') ||
            error.message.includes('Failed to fetch')
        );
    }
    return false;
};

/**
 * 判断是否为验证错误
 */
export const isValidationError = (error: unknown): boolean => {
    if (error instanceof Error) {
        return error.message.includes('validation') || error.message.includes('invalid');
    }
    return false;
};

/**
 * 获取错误消息
 */
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    }
    return '发生了一个未知错误';
};

/**
 * 格式化错误对象
 */
export const formatError = (error: unknown): AppError => {
    if (isNetworkError(error)) {
        return createError('network', '网络连接失败，请检查您的网络设置');
    }

    if (isValidationError(error)) {
        return createError('validation', getErrorMessage(error));
    }

    return createError('general', getErrorMessage(error));
};

/**
 * 记录错误到控制台（开发环境）
 */
export const logError = (error: unknown, context?: string): void => {
    if (import.meta.env.DEV) {
        console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    }
};

/**
 * 处理异步错误
 */
export const handleAsyncError = async <T>(
    promise: Promise<T>,
    errorHandler?: (error: unknown) => void
): Promise<[T | null, AppError | null]> => {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        const formattedError = formatError(error);
        logError(error);

        if (errorHandler) {
            errorHandler(formattedError);
        }

        return [null, formattedError];
    }
};

/**
 * 重试函数
 */
export const retry = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> => {
    let lastError: unknown;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            logError(error, `Retry ${i + 1}/${maxRetries}`);

            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }

    throw lastError;
};

/**
 * 验证必填字段
 */
export const validateRequired = (
    value: unknown,
    fieldName: string
): void => {
    if (value === null || value === undefined || value === '') {
        throw createError('validation', `${fieldName}不能为空`);
    }
};

/**
 * 验证字符串长度
 */
export const validateLength = (
    value: string,
    fieldName: string,
    min?: number,
    max?: number
): void => {
    if (min !== undefined && value.length < min) {
        throw createError('validation', `${fieldName}长度不能少于${min}个字符`);
    }
    if (max !== undefined && value.length > max) {
        throw createError('validation', `${fieldName}长度不能超过${max}个字符`);
    }
};

/**
 * 验证URL格式
 */
export const validateUrl = (value: string, fieldName: string): void => {
    try {
        new URL(value);
    } catch {
        throw createError('validation', `${fieldName}格式不正确`);
    }
};

/**
 * 验证邮箱格式
 */
export const validateEmail = (value: string, fieldName: string): void => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        throw createError('validation', `${fieldName}格式不正确`);
    }
};

/**
 * 批量验证
 */
export const validateAll = (
    validators: Array<() => void>
): AppError[] => {
    const errors: AppError[] = [];

    for (const validator of validators) {
        try {
            validator();
        } catch (error) {
            if (error && typeof error === 'object' && 'type' in error) {
                errors.push(error as AppError);
            } else {
                errors.push(formatError(error));
            }
        }
    }

    return errors;
};

export default {
    createError,
    isNetworkError,
    isValidationError,
    getErrorMessage,
    formatError,
    logError,
    handleAsyncError,
    retry,
    validateRequired,
    validateLength,
    validateUrl,
    validateEmail,
    validateAll,
};
