/**
 * Base Repair Strategy
 * 修复策略基类 - 提供通用的修复策略实现
 */

import type { RepairStrategy, ItemError, ErrorType } from '@/types/dataRepair';

/**
 * 抽象修复策略基类
 */
export abstract class BaseRepairStrategy implements RepairStrategy {
    public readonly name: string;
    public readonly errorType: ErrorType;
    public readonly applicableFields: string[];

    constructor(
        name: string,
        errorType: ErrorType,
        applicableFields: string[]
    ) {
        this.name = name;
        this.errorType = errorType;
        this.applicableFields = applicableFields;
    }

    /**
     * 判断策略是否适用于该错误
     * 默认实现：检查错误类型和字段名是否匹配
     */
    canApply(error: ItemError): boolean {
        // 检查错误类型是否匹配
        if (error.errorType !== this.errorType) {
            return false;
        }

        // 如果没有指定适用字段，则适用于所有字段
        if (this.applicableFields.length === 0) {
            return true;
        }

        // 检查字段名是否在适用字段列表中
        return this.applicableFields.includes(error.field);
    }

    /**
     * 生成修复值 - 子类必须实现
     */
    abstract generateRepairValue(error: ItemError, item: any): any;

    /**
     * 估计数据丢失风险 - 子类可以覆盖
     * 默认返回 'low'
     */
    estimateRisk(): 'none' | 'low' | 'medium' | 'high' {
        return 'low';
    }

    /**
     * 辅助方法：检查字段是否存在
     */
    protected fieldExists(item: any, field: string): boolean {
        return item && field in item;
    }

    /**
     * 辅助方法：获取字段值
     */
    protected getFieldValue(item: any, field: string): any {
        return item?.[field];
    }

    /**
     * 辅助方法：设置字段值
     */
    protected setFieldValue(item: any, field: string, value: any): void {
        if (item) {
            item[field] = value;
        }
    }
}
