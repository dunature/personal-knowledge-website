/**
 * 同步相关类型定义
 */

/**
 * 同步状态
 */
export type SyncStatus = 'idle' | 'checking' | 'syncing' | 'success' | 'error' | 'conflict';

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
    skipped?: boolean; // 是否跳过同步
    skipReason?: string; // 跳过原因
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

/**
 * 数据统计信息（扩展版）
 */
export interface DataStatistics {
    resourceCount: number;
    questionCount: number;
    subQuestionCount: number;
    answerCount: number;
    lastModified: string;
}

/**
 * 数据对比结果
 */
export interface DataComparisonResult {
    hasChanges: boolean;
    local: DataStatistics;
    remote: DataStatistics;
    differences: {
        resources: number; // 差异数量（可正可负）
        questions: number;
        subQuestions: number;
        answers: number;
    };
    recommendation: 'pull' | 'push' | 'merge' | 'skip';
}

/**
 * 同步检查结果
 */
export interface SyncCheckResult {
    hasUpdates: boolean;
    comparison?: DataComparisonResult;
    error?: string;
    isIdentical?: boolean; // 数据是否完全一致
    lastChecked?: string; // 最后检查时间
}

/**
 * Pull 同步选项
 */
export interface PullSyncOptions {
    force?: boolean; // 强制同步，忽略冲突
    strategy?: ConflictStrategy; // 冲突解决策略
    showProgress?: boolean; // 显示进度
}

/**
 * 冲突信息
 */
export interface ConflictInfo {
    hasConflict: boolean;
    localChanges: number; // 本地待同步变更数
    remoteChanges: boolean; // 云端是否有更新
    conflictItems: Array<{
        type: 'resource' | 'question' | 'subQuestion' | 'answer';
        id: string;
        localVersion?: any;
        remoteVersion?: any;
    }>;
}

/**
 * 同步历史记录条目
 */
export interface SyncHistoryEntry {
    id: string;
    timestamp: string;
    type: 'pull' | 'push' | 'bidirectional';
    status: 'success' | 'failed' | 'partial';
    success: boolean; // 是否成功
    changes?: {
        added: number;
        updated: number;
        deleted: number;
    };
    error?: string;
    duration: number; // 毫秒
}

/**
 * 同步历史记录
 */
export interface SyncHistory {
    entries: SyncHistoryEntry[];
    maxEntries: number; // 默认 50
}

/**
 * 同步偏好设置
 */
export interface SyncPreferences {
    autoSync: boolean; // 自动同步
    autoSyncOnStartup: boolean; // 启动时自动同步
    periodicCheckEnabled: boolean; // 定期检查
    periodicCheckInterval: number; // 检查间隔（毫秒）
    conflictStrategy: ConflictStrategy; // 默认冲突策略
    showDataComparison: boolean; // 显示数据对比对话框
}
