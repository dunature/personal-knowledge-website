/**
 * 错误类型定义
 */

/**
 * 错误类型常量
 */
export const ErrorType = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    STORAGE_ERROR: 'STORAGE_ERROR',
    PARSE_ERROR: 'PARSE_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

/**
 * 应用错误接口
 */
export interface AppError {
    type: ErrorType;
    message: string;
    details?: any;
    timestamp?: string;
}

/**
 * 验证错误
 */
export interface ValidationError {
    field: string;
    message: string;
}

/**
 * 表单错误状态
 */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * 错误处理器类型
 */
export type ErrorHandler = (error: AppError) => void;

/**
 * 创建应用错误
 */
export function createAppError(
    type: ErrorType,
    message: string,
    details?: any
): AppError {
    return {
        type,
        message,
        details,
        timestamp: new Date().toISOString(),
    };
}

/**
 * 错误消息映射
 */
export const ERROR_MESSAGES: Record<ErrorType, string> = {
    [ErrorType.NETWORK_ERROR]: '网络连接失败，请检查网络后重试',
    [ErrorType.VALIDATION_ERROR]: '输入数据验证失败',
    [ErrorType.NOT_FOUND]: '请求的资源不存在',
    [ErrorType.PERMISSION_DENIED]: '权限不足，无法执行此操作',
    [ErrorType.STORAGE_ERROR]: '数据存储失败',
    [ErrorType.PARSE_ERROR]: '数据解析失败',
    [ErrorType.UNKNOWN_ERROR]: '发生未知错误，请稍后重试',
};
