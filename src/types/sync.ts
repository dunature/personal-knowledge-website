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
/**
 * 数据统计
 */
export interface DataStats {
    resources: number;
    questions: number;
    subQuestions: number;
    answers: number;
    lastUpdated: string;
}

/**
 * 数据对比
 */
export interface DataComparison {
    local: DataStats;
    remote: DataStats;
}

/**
 * 初始化状态
 */
export interface InitializationState {
    status: 'idle' | 'detecting' | 'syncing' | 'conflict' | 'complete' | 'error';
    progress: number; // 0-100
    currentStep: string;
    gistId?: string;
    error?: string;
}

/**
 * 初始化步骤
 */
export type InitStep = 'detecting' | 'syncing' | 'conflict' | 'complete' | 'error';

/**
 * 进度回调函数
 */
export type ProgressCallback = (progress: number, message: string) => void;
