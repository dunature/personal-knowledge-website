/**
 * Fix Invalid Status Strategy
 * 修复无效的状态值，设置为 'unsolved'
 */

import { BaseRepairStrategy } from '../BaseRepairStrategy';
import type { ItemError } from '@/types/dataRepair';

/**
 * 修复无效状态值的策略
 */
export class FixInvalidStatusStrategy extends BaseRepairStrategy {
    constructor() {
        super(
            'FixInvalidStatus',
            'invalid_value',
            ['status'] // 仅适用于 status 字段
        );
    }

    /**
     * 生成修复值
     * 返回默认状态 'unsolved'
     */
    generateRepairValue(_error: ItemError, _item: any): string {
        return 'unsolved';
    }

    /**
     * 估计风险
     * 设置为默认状态的风险较低
     */
    estimateRisk(): 'none' | 'low' | 'medium' | 'high' {
        return 'low';
    }
}
