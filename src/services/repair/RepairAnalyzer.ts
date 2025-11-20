/**
 * Repair Analyzer
 * 分析错误并生成修复方案
 */

import type {
    ItemError,
    RepairPlan,
    RepairAction,
    RepairStrategy,
    FieldChange,
} from '@/types/dataRepair';
import { repairStrategyRegistry } from './RepairStrategyRegistry';

/**
 * 修复分析器类
 */
export class RepairAnalyzer {
    /**
     * 分析错误并生成修复方案
     */
    analyzeErrors(errors: ItemError[], data: any): RepairPlan {
        const repairs: RepairAction[] = [];
        let autoRepairableCount = 0;
        let manualRepairCount = 0;

        // 为每个错误匹配修复策略
        for (const error of errors) {
            const strategy = this.matchStrategy(error);

            if (strategy) {
                const repairAction = this.createRepairAction(error, strategy, data);
                repairs.push(repairAction);

                if (repairAction.autoApplicable) {
                    autoRepairableCount++;
                } else {
                    manualRepairCount++;
                }
            } else {
                // 无法自动修复的错误
                manualRepairCount++;
            }
        }

        // 估计数据丢失风险
        const estimatedDataLoss = this.estimateDataLoss(repairs);

        return {
            repairs,
            autoRepairableCount,
            manualRepairCount,
            estimatedDataLoss,
        };
    }

    /**
     * 为单个错误匹配修复策略
     */
    matchStrategy(error: ItemError): RepairStrategy | null {
        return repairStrategyRegistry.findStrategyForError(error);
    }

    /**
     * 创建修复操作
     */
    private createRepairAction(
        error: ItemError,
        strategy: RepairStrategy,
        data: any
    ): RepairAction {
        // 获取原始数据项
        const originalItem = this.getItemFromData(data, error);

        // 生成修复值
        const repairValue = strategy.generateRepairValue(error, originalItem);

        // 创建修复后的数据项副本
        const repairedItem = { ...originalItem };
        repairedItem[error.field] = repairValue;

        // 生成字段变更列表
        const changes = this.generateFieldChanges(originalItem, repairedItem, error.field);

        // 判断是否可以自动应用
        const risk = strategy.estimateRisk();
        const autoApplicable = risk === 'none' || risk === 'low';

        return {
            id: crypto.randomUUID(),
            error,
            strategy,
            preview: {
                before: originalItem,
                after: repairedItem,
                changes,
            },
            autoApplicable,
            selected: autoApplicable, // 默认选中可自动应用的修复
        };
    }

    /**
     * 从数据中获取数据项
     */
    private getItemFromData(data: any, error: ItemError): any {
        // 根据错误类型确定数据数组
        const dataType = this.inferDataType(error);
        const items = data?.[dataType];

        if (!Array.isArray(items)) {
            return {};
        }

        // 根据索引获取数据项
        const item = items[error.itemIndex];
        return item || {};
    }

    /**
     * 推断数据类型
     * 这是一个简化实现，实际应该从错误对象中获取
     */
    private inferDataType(_error: ItemError): string {
        // 可以根据字段名或其他信息推断
        // 这里返回一个默认值，实际实现中应该更智能
        return 'questions';
    }

    /**
     * 生成字段变更列表
     */
    private generateFieldChanges(
        before: any,
        after: any,
        changedField: string
    ): FieldChange[] {
        const changes: FieldChange[] = [];

        // 检查变更的字段
        const oldValue = before[changedField];
        const newValue = after[changedField];

        // 确定操作类型
        let operation: 'add' | 'modify' | 'remove';
        if (oldValue === undefined && newValue !== undefined) {
            operation = 'add';
        } else if (oldValue !== undefined && newValue === undefined) {
            operation = 'remove';
        } else {
            operation = 'modify';
        }

        changes.push({
            field: changedField,
            operation,
            oldValue,
            newValue,
        });

        return changes;
    }

    /**
     * 估计数据丢失风险
     */
    private estimateDataLoss(repairs: RepairAction[]): 'none' | 'minimal' | 'significant' {
        if (repairs.length === 0) {
            return 'none';
        }

        // 统计不同风险级别的修复数量
        let highRiskCount = 0;
        let mediumRiskCount = 0;

        for (const repair of repairs) {
            const risk = repair.strategy.estimateRisk();
            if (risk === 'high') {
                highRiskCount++;
            } else if (risk === 'medium') {
                mediumRiskCount++;
            }
        }

        // 根据风险修复的比例判断整体风险
        const totalRepairs = repairs.length;
        const mediumRiskRatio = mediumRiskCount / totalRepairs;

        if (highRiskCount > 0 || mediumRiskRatio > 0.5) {
            return 'significant';
        } else if (mediumRiskCount > 0) {
            return 'minimal';
        } else {
            return 'none';
        }
    }
}

// 导出单例实例
export const repairAnalyzer = new RepairAnalyzer();
