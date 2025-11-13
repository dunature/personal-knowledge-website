/**
 * Gist 错误处理器
 * 提供统一的错误处理和恢复策略
 */

import { GistError } from '@/types/errors';
import type { GistErrorType, ErrorHandlingOptions } from '@/types/errors';

/**
 * 从 HTTP 状态码推断错误类型
 */
function inferErrorTypeFromStatus(statusCode: number): GistErrorType {
    switch (statusCode) {
        case 401:
            return 'UNAUTHORIZED';
        case 403:
            return 'FORBIDDEN';
        case 404:
            return 'NOT_FOUND';
        case 429:
            return 'RATE_LIMIT';
        case 408:
        case 504:
            return 'TIMEOUT';
        default:
            if (statusCode >= 500) {
                return 'NETWORK_ERROR';
            }
            return 'UNKNOWN';
    }
}

/**
 * 从错误消息推断错误类型
 */
function inferErrorTypeFromMessage(message: string): GistErrorType {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
        return 'NETWORK_ERROR';
    }
    if (lowerMessage.includes('offline')) {
        return 'OFFLINE';
    }
    if (lowerMessage.includes('timeout')) {
        return 'TIMEOUT';
    }
    if (lowerMessage.includes('unauthorized') || lowerMessage.includes('401')) {
        return 'UNAUTHORIZED';
    }
    if (lowerMessage.includes('token')) {
        return 'INVALID_TOKEN';
    }
    if (lowerMessage.includes('forbidden') || lowerMessage.includes('403')) {
        return 'FORBIDDEN';
    }
    if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
        return 'NOT_FOUND';
    }
    if (lowerMessage.includes('gist')) {
        return 'GIST_NOT_FOUND';
    }
    if (lowerMessage.includes('parse') || lowerMessage.includes('json')) {
        return 'PARSE_ERROR';
    }
    if (lowerMessage.includes('validation') || lowerMessage.includes('invalid')) {
        return 'VALIDATION_ERROR';
    }
    if (lowerMessage.includes('storage') || lowerMessage.includes('quota')) {
        return 'STORAGE_ERROR';
    }
    if (lowerMessage.includes('rate limit') || lowerMessage.includes('429')) {
        return 'RATE_LIMIT';
    }

    return 'UNKNOWN';
}

/**
 * 将标准错误转换为 GistError
 */
export function toGistError(error: unknown, context?: Record<string, any>): GistError {
    // 如果已经是 GistError，直接返回
    if (error instanceof GistError) {
        return error;
    }

    // 如果是标准 Error
    if (error instanceof Error) {
        // 检查是否有 response 属性（fetch 错误）
        const response = (error as any).response;
        const statusCode = response?.status;

        let errorType: GistErrorType = 'UNKNOWN';

        if (statusCode) {
            errorType = inferErrorTypeFromStatus(statusCode);
        } else {
            errorType = inferErrorTypeFromMessage(error.message);
        }

        // 判断是否可重试
        const isRetryable =
            errorType === 'NETWORK_ERROR' ||
            errorType === 'TIMEOUT' ||
            errorType === 'RATE_LIMIT' ||
            (statusCode && statusCode >= 500);

        return new GistError(errorType, error.message, {
            originalError: error,
            statusCode,
            context,
        }, isRetryable);
    }

    // 其他类型的错误
    const message = typeof error === 'string' ? error : '发生未知错误';
    return new GistError('UNKNOWN', message, { context });
}

/**
 * 处理 Gist 错误
 * 根据错误类型执行不同的处理策略
 */
export function handleGistError(
    error: unknown,
    options: ErrorHandlingOptions = {}
): GistError {
    const {
        showToast = true,
        logError = true,
        throwError = false,
        recovery,
    } = options;

    // 转换为 GistError
    const gistError = toGistError(error);

    // 记录错误
    if (logError) {
        console.error('[GistError]', {
            type: gistError.type,
            message: gistError.message,
            userMessage: gistError.getUserMessage(),
            details: gistError.details,
            isRetryable: gistError.isRetryable,
        });
    }

    // 显示通知（需要在调用处实现，因为这里无法访问 toast）
    // 这里只是标记需要显示
    if (showToast) {
        gistError.details.context = {
            ...gistError.details.context,
            shouldShowToast: true,
        };
    }

    // 执行恢复策略
    if (recovery) {
        executeRecoveryStrategy(gistError, recovery);
    }

    // 是否抛出错误
    if (throwError) {
        throw gistError;
    }

    return gistError;
}

/**
 * 执行错误恢复策略
 */
function executeRecoveryStrategy(
    error: GistError,
    strategy: NonNullable<ErrorHandlingOptions['recovery']>
): void {
    const { retry, fallback, notify } = strategy;

    // 如果错误可重试且策略允许重试
    if (retry && error.isRetryable) {
        console.log(`[Recovery] 错误可重试: ${error.type}`);
        // 重试逻辑由调用方实现
    }

    // 执行回退方案
    if (fallback) {
        try {
            fallback();
        } catch (fallbackError) {
            console.error('[Recovery] 回退方案执行失败:', fallbackError);
        }
    }

    // 通知用户
    if (notify) {
        console.log(`[Recovery] 通知用户: ${error.getUserMessage()}`);
    }
}

/**
 * 创建特定类型的 Gist 错误
 */
export function createGistError(
    type: GistErrorType,
    message?: string,
    details?: Record<string, any>
): GistError {
    const defaultMessages: Record<GistErrorType, string> = {
        NETWORK_ERROR: '网络连接失败',
        OFFLINE: '当前处于离线状态',
        TIMEOUT: '请求超时',
        UNAUTHORIZED: '未授权',
        INVALID_TOKEN: 'Token 无效',
        TOKEN_EXPIRED: 'Token 已过期',
        FORBIDDEN: '没有权限',
        NOT_FOUND: '资源不存在',
        GIST_NOT_FOUND: 'Gist 不存在',
        INVALID_GIST_ID: 'Gist ID 无效',
        INVALID_DATA: '数据无效',
        VALIDATION_ERROR: '验证失败',
        PARSE_ERROR: '解析失败',
        STORAGE_FULL: '存储空间已满',
        STORAGE_ERROR: '存储错误',
        SYNC_FAILED: '同步失败',
        CONFLICT: '数据冲突',
        RATE_LIMIT: 'API 请求过于频繁',
        UNKNOWN: '未知错误',
    };

    const errorMessage = message || defaultMessages[type];
    const isRetryable =
        type === 'NETWORK_ERROR' ||
        type === 'TIMEOUT' ||
        type === 'RATE_LIMIT';

    return new GistError(type, errorMessage, details, isRetryable);
}

/**
 * 检查错误是否为特定类型
 */
export function isGistErrorType(error: unknown, type: GistErrorType): boolean {
    return error instanceof GistError && error.type === type;
}

/**
 * 检查错误是否可重试
 */
export function isRetryableError(error: unknown): boolean {
    return error instanceof GistError && error.isRetryable;
}

/**
 * 获取用户友好的错误消息
 */
export function getUserErrorMessage(error: unknown): string {
    if (error instanceof GistError) {
        return error.getUserMessage();
    }

    if (error instanceof Error) {
        return error.message;
    }

    return '发生未知错误';
}

/**
 * 处理 API 响应错误
 */
export async function handleApiError(response: Response): Promise<GistError> {
    const statusCode = response.status;
    let message = response.statusText;

    // 尝试解析错误消息
    try {
        const data = await response.json();
        if (data.message) {
            message = data.message;
        }
    } catch {
        // 忽略解析错误
    }

    const errorType = inferErrorTypeFromStatus(statusCode);
    const isRetryable = statusCode >= 500 || statusCode === 429;

    return new GistError(errorType, message, { statusCode }, isRetryable);
}

/**
 * 包装异步函数，自动处理错误
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: ErrorHandlingOptions = {}
): T {
    return (async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            return handleGistError(error, options);
        }
    }) as T;
}
