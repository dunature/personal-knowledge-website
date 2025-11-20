/**
 * Generate Missing ID Strategy
 * 为缺失的 ID 字段生成 UUID
 */

import { BaseRepairStrategy } from '../BaseRepairStrategy';
import type { ItemError } from '@/types/dataRepair';

/**
 * 生成缺失 ID 的策略
 */
export class GenerateMissingIdStrategy extends BaseRepairStrategy {
    constructor() {
        super(
            'GenerateMissingId',
            'missing_field',
            ['id', 'uuid', 'guid'] // 适用于 ID 相关字段
        );
    }

    /**
     * 生成修复值
     * 返回新生成的 UUID
     */
    generateRepairValue(_error: ItemError, _item: any): string {
        return crypto.randomUUID();
    }

    /**
     * 估计风险
     * 生成新 ID 的风险很低
     */
    estimateRisk(): 'none' | 'low' | 'medium' | 'high' {
        return 'none';
    }
}
