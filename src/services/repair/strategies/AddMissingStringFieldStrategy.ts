/**
 * Add Missing String Field Strategy
 * 为缺失的字符串字段添加默认值
 */

import { BaseRepairStrategy } from '../BaseRepairStrategy';
import type { ItemError } from '@/types/dataRepair';

/**
 * 字段默认值映射
 */
const FIELD_DEFAULTS: Record<string, string> = {
    title: '',
    question: '',
    answer: '',
    content: '',
    description: '',
    name: '',
    url: '',
    platform: '',
    author: '',
    category: '',
    tags: '',
    notes: '',
    summary: '',
};

/**
 * 添加缺失字符串字段的修复策略
 */
export class AddMissingStringFieldStrategy extends BaseRepairStrategy {
    constructor() {
        super(
            'AddMissingStringField',
            'missing_field',
            [] // 适用于所有字符串字段
        );
    }

    /**
     * 判断策略是否适用于该错误
     * 覆盖基类方法，检查 expectedFormat 是否表示字符串类型
     */
    canApply(error: ItemError): boolean {
        // 检查错误类型是否匹配
        if (error.errorType !== this.errorType) {
            return false;
        }

        // 检查 expectedFormat 是否表示字符串类型
        // 排除数组类型
        const format = error.expectedFormat?.toLowerCase() || '';
        return format.includes('string') && !format.includes('[]') && !format.includes('array');
    }

    /**
     * 生成修复值
     * 根据字段名返回合理的默认值，如果没有特定默认值则返回空字符串
     */
    generateRepairValue(error: ItemError, _item: any): string {
        const fieldName = error.field;

        // 如果有预定义的默认值，使用它
        // 使用 hasOwnProperty 避免原型链污染问题
        if (Object.prototype.hasOwnProperty.call(FIELD_DEFAULTS, fieldName)) {
            return FIELD_DEFAULTS[fieldName];
        }

        // 否则返回空字符串
        return '';
    }

    /**
     * 估计风险
     * 添加空字符串字段的风险很低
     */
    estimateRisk(): 'none' | 'low' | 'medium' | 'high' {
        return 'none';
    }
}
