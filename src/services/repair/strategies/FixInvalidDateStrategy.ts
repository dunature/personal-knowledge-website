/**
 * Fix Invalid Date Strategy
 * 修复无效或缺失的日期字段，生成当前 ISO 8601 时间戳
 */

import { BaseRepairStrategy } from '../BaseRepairStrategy';
import type { ItemError } from '@/types/dataRepair';

/**
 * 修复无效日期字段的策略
 */
export class FixInvalidDateStrategy extends BaseRepairStrategy {
    constructor() {
        super(
            'FixInvalidDate',
            'missing_field', // 日期字段缺失时的错误类型
            ['created_at', 'updated_at', 'date', 'timestamp'] // 适用于日期相关字段
        );
    }

    /**
     * 判断策略是否适用于该错误
     * 覆盖基类方法，同时支持 missing_field 和 invalid_value
     */
    canApply(error: ItemError): boolean {
        // 支持两种错误类型
        if (error.errorType !== 'missing_field' && error.errorType !== 'invalid_value') {
            return false;
        }

        // 检查字段名是否在适用字段列表中
        return this.applicableFields.includes(error.field);
    }

    /**
     * 生成修复值
     * 返回当前时间的 ISO 8601 格式字符串
     */
    generateRepairValue(_error: ItemError, _item: any): string {
        return new Date().toISOString();
    }

    /**
     * 估计风险
     * 使用当前时间替换无效日期有一定风险，因为可能丢失原始时间信息
     */
    estimateRisk(): 'none' | 'low' | 'medium' | 'high' {
        return 'medium';
    }
}
