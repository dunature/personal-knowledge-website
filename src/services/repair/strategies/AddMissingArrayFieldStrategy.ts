/**
 * Add Missing Array Field Strategy
 * 为缺失的数组字段添加空数组
 */

import { BaseRepairStrategy } from '../BaseRepairStrategy';
import type { ItemError } from '@/types/dataRepair';

/**
 * 添加缺失数组字段的修复策略
 */
export class AddMissingArrayFieldStrategy extends BaseRepairStrategy {
    constructor() {
        super(
            'AddMissingArrayField',
            'missing_field',
            [] // 适用于所有数组字段
        );
    }

    /**
     * 判断策略是否适用于该错误
     * 覆盖基类方法，检查 expectedFormat 是否包含数组标识
     */
    canApply(error: ItemError): boolean {
        // 检查错误类型是否匹配
        if (error.errorType !== this.errorType) {
            return false;
        }

        // 检查 expectedFormat 是否表示数组类型
        // 例如: 'string[]', 'array', 等
        const format = error.expectedFormat?.toLowerCase() || '';
        return format.includes('[]') || format.includes('array');
    }

    /**
     * 生成修复值
     * 返回空数组
     */
    generateRepairValue(_error: ItemError, _item: any): any[] {
        return [];
    }

    /**
     * 估计风险
     * 添加空数组字段的风险很低
     */
    estimateRisk(): 'none' | 'low' | 'medium' | 'high' {
        return 'none';
    }
}
