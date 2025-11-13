/**
 * Gist 错误类型定义
 * 定义与 GitHub Gist 集成相关的错误类型和处理
 */

/**
 * Gist 错误类型
 */
export type GistErrorType =
    // 网络相关错误
    | 'NETWORK_ERROR'
    | 'OFFLINE'
    | 'TIMEOUT'
    // 认证相关错误
    | 'UNAUTHORIZED'
    | 'INVALID_TOKEN'
    | 'TOKEN_EXPIRED'
    | 'FORBIDDEN'
    // 资源相关错误
    | 'NOT_FOUND'
    | 'GIST_NOT_FOUND'
    | 'INVALID_GIST_ID'
    // 数据相关错误
    | 'INVALID_DATA'
    | 'VALIDATION_ERROR'
    | 'PARSE_ERROR'
    // 存储相关错误
    | 'STORAGE_FULL'
    | 'STORAGE_ERROR'
    // 同步相关错误
    | 'SYNC_FAILED'
    | 'CONFLICT'
    // 速率限制
    | 'RATE_LIMIT'
    // 未知错误
    | 'UNKNOWN';

/**
 * Gist 错误类型常量
 */
export const GistErrorTypes = {
    NETWORK_ERROR: 'NETWORK_ERROR' as const,
    OFFLINE: 'OFFLINE' as const,
    TIMEOUT: 'TIMEOUT' as const,
    UNAUTHORIZED: 'UNAUTHORIZED' as const,
    INVALID_TOKEN: 'INVALID_TOKEN' as const,
    TOKEN_EXPIRED: 'TOKEN_EXPIRED' as const,
    FORBIDDEN: 'FORBIDDEN' as const,
    NOT_FOUND: 'NOT_FOUND' as const,
    GIST_NOT_FOUND: 'GIST_NOT_FOUND' as const,
    INVALID_GIST_ID: 'INVALID_GIST_ID' as const,
    INVALID_DATA: 'INVALID_DATA' as const,
    VALIDATION_ERROR: 'VALIDATION_ERROR' as const,
    PARSE_ERROR: 'PARSE_ERROR' as const,
    STORAGE_FULL: 'STORAGE_FULL' as const,
    STORAGE_ERROR: 'STORAGE_ERROR' as const,
    SYNC_FAILED: 'SYNC_FAILED' as const,
    CONFLICT: 'CONFLICT' as const,
    RATE_LIMIT: 'RATE_LIMIT' as const,
    UNKNOWN: 'UNKNOWN' as const,
};

/**
 * 错误详情接口
 */
export interface ErrorDetails {
    code?: string;
    statusCode?: number;
    message: string;
    originalError?: Error;
    timestamp: string;
    context?: Record<string, any>;
}

/**
 * Gist 错误类
 * 扩展标准 Error 类，添加 Gist 特定的错误信息
 */
export class GistError extends Error {
    public readonly type: GistErrorType;
    public readonly details: ErrorDetails;
    public readonly isRetryable: boolean;

    constructor(
        type: GistErrorType,
        message: string,
        details?: Partial<ErrorDetails>,
        isRetryable = false
    ) {
        super(message);
        this.name = 'GistError';
        this.type = type;
        this.isRetryable = isRetryable;

        this.details = {
            message,
            timestamp: new Date().toISOString(),
            ...details,
        };

        // 保持正确的原型链
        Object.setPrototypeOf(this, GistError.prototype);
    }

    /**
     * 获取用户友好的错误消息
     */
    getUserMessage(): string {
        switch (this.type) {
            case 'NETWORK_ERROR':
                return '网络连接失败，请检查您的网络设置';
            case 'OFFLINE':
                return '当前处于离线状态，变更将在网络恢复后同步';
            case 'TIMEOUT':
                return '请求超时，请稍后重试';
            case 'UNAUTHORIZED':
                return '未授权，请重新登录';
            case 'INVALID_TOKEN':
                return 'Token 无效，请重新配置';
            case 'TOKEN_EXPIRED':
                return 'Token 已过期，请更新 Token';
            case 'FORBIDDEN':
                return '没有权限执行此操作';
            case 'NOT_FOUND':
                return '请求的资源不存在';
            case 'GIST_NOT_FOUND':
                return 'Gist 不存在或已被删除';
            case 'INVALID_GIST_ID':
                return 'Gist ID 格式无效';
            case 'INVALID_DATA':
                return '数据格式无效';
            case 'VALIDATION_ERROR':
                return '数据验证失败';
            case 'PARSE_ERROR':
                return '数据解析失败';
            case 'STORAGE_FULL':
                return '存储空间已满，请清理数据';
            case 'STORAGE_ERROR':
                return '存储操作失败';
            case 'SYNC_FAILED':
                return '同步失败，请稍后重试';
            case 'CONFLICT':
                return '数据冲突，请刷新后重试';
            case 'RATE_LIMIT':
                return 'API 请求过于频繁，请稍后重试';
            case 'UNKNOWN':
            default:
                return this.details.message || '发生未知错误';
        }
    }

    /**
     * 转换为 JSON 对象
     */
    toJSON(): Record<string, any> {
        return {
            name: this.name,
            type: this.type,
            message: this.message,
            userMessage: this.getUserMessage(),
            isRetryable: this.isRetryable,
            details: this.details,
        };
    }
}

/**
 * 错误恢复策略
 */
export interface ErrorRecoveryStrategy {
    retry?: boolean;
    retryDelay?: number;
    maxRetries?: number;
    fallback?: () => void;
    notify?: boolean;
}

/**
 * 错误处理选项
 */
export interface ErrorHandlingOptions {
    showToast?: boolean;
    logError?: boolean;
    throwError?: boolean;
    recovery?: ErrorRecoveryStrategy;
}
