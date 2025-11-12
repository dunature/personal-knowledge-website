/**
 * 同步相关类型定义
 */

/**
 * 同步状态
 */
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'conflict';

/**
 * 冲突解决策略
 */
export type ConflictStrategy = 'local' | 'remote' | 'merge';

/**
 * 同步结果
 */
export interface SyncResult {
    success: boolean;
    timestamp: string;
    changes?: {
        added: number;
        updated: number;
        deleted: number;
    };
    error?: string;
}

/**
 * 待同步变更
 */
export interface PendingChange {
    type: 'create' | 'update' | 'delete';
    entity: 'resource' | 'question' | 'subQuestion' | 'answer';
    id: string;
    data?: any;
    timestamp: string;
}

/**
 * 同步配置
 */
export interface SyncConfig {
    autoSync: boolean; // 是否自动同步
    debounceTime: number; // 防抖时间（毫秒）
    maxRetries: number; // 最大重试次数
    retryDelay: number; // 重试延迟（毫秒）
}
