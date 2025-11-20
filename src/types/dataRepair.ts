/**
 * Data Repair Types
 * 数据修复工具的类型定义
 */

/**
 * 数据类型枚举
 */
export type DataType =
    | 'questions'
    | 'subQuestions'
    | 'answers'
    | 'resources'
    | 'metadata';

/**
 * 错误类型枚举
 */
export type ErrorType =
    | 'missing_field'
    | 'invalid_type'
    | 'invalid_value'
    | 'invalid_format';

/**
 * 单个数据项的错误信息
 */
export interface ItemError {
    itemIndex: number;
    itemId?: string;
    field: string;
    errorType: ErrorType;
    currentValue: any;
    expectedFormat: string;
    message: string;
    suggestedFix?: string;
    dataType?: DataType;
}

/**
 * 错误摘要
 */
export interface ErrorSummary {
    totalErrors: number;
    errorsByType: Record<DataType, number>;
    errorsByCategory: Record<ErrorType, number>;
    criticalErrors: number;
    autoRepairableErrors: number;
}

/**
 * 检测结果
 */
export interface DetectionResult {
    valid: boolean;
    totalErrors: number;
    errorsByType: Record<DataType, ItemError[]>;
    summary: ErrorSummary;
}

/**
 * 字段变更信息
 */
export interface FieldChange {
    field: string;
    operation: 'add' | 'modify' | 'remove';
    oldValue: any;
    newValue: any;
}

/**
 * 修复操作
 */
export interface RepairAction {
    id: string;
    error: ItemError;
    strategy: RepairStrategy;
    preview: {
        before: any;
        after: any;
        changes: FieldChange[];
    };
    autoApplicable: boolean;
    selected: boolean;
    riskLevel: 'none' | 'low' | 'medium' | 'high';
}

/**
 * 修复计划
 */
export interface RepairPlan {
    repairs: RepairAction[];
    autoRepairableCount: number;
    manualRepairCount: number;
    estimatedDataLoss: 'none' | 'minimal' | 'significant';
    dataLossRisk: 'none' | 'low' | 'medium' | 'high';
}

/**
 * 修复策略接口
 */
export interface RepairStrategy {
    name: string;
    errorType: ErrorType;
    applicableFields: string[];

    /**
     * 判断策略是否适用于该错误
     */
    canApply(error: ItemError): boolean;

    /**
     * 生成修复值
     */
    generateRepairValue(error: ItemError, item: any): any;

    /**
     * 估计数据丢失风险
     */
    estimateRisk(): 'none' | 'low' | 'medium' | 'high';
}

/**
 * 隔离的数据项
 */
export interface IsolatedItem {
    originalItem: any;
    errors: ItemError[];
    reason: string;
}

/**
 * 修复结果
 */
export interface RepairResult {
    success: boolean;
    repairedData: any;
    appliedRepairs: number;
    remainingErrors: ItemError[];
    isolatedItems: IsolatedItem[];
}

/**
 * 修复配置
 */
export interface RepairConfig {
    autoRepairEnabled: boolean;
    strategies: RepairStrategy[];
    riskThreshold: 'low' | 'medium' | 'high';
    backupBeforeRepair: boolean;
}

/**
 * 报告元数据
 */
export interface ReportMetadata {
    gistId: string;
    timestamp: string;
    version: string;
}

/**
 * 增强的验证结果（扩展现有的 ValidationResult）
 */
export interface EnhancedValidationResult {
    valid: boolean;
    errors?: string[];
    detailedErrors: ItemError[];
    errorSummary: ErrorSummary;
    repairPlan?: RepairPlan;
}

/**
 * 修复上下文
 */
export interface RepairContext {
    data: any;
    config: RepairConfig;
    errors: ItemError[];
}

/**
 * 恢复结果
 */
export interface RecoveryResult {
    recovered: boolean;
    fallbackAction?: FallbackAction;
    userMessage: string;
}

/**
 * 回退操作
 */
export type FallbackAction =
    | { type: 'download'; data: any }
    | { type: 'retry'; operation: () => Promise<any> }
    | { type: 'manual'; instructions: string };
