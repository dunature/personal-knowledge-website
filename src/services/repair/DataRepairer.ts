/**
 * Data Repairer
 * 数据修复器 - 执行数据修复操作
 */

import type {
    RepairAction,
    RepairResult,
    ItemError,
    IsolatedItem,
} from '@/types/dataRepair';
import { dataDetector } from './DataDetector';

/**
 * DataRepairer 类
 * 负责执行数据修复操作
 */
export class DataRepairer {
    /**
     * 应用修复操作
     */
    applyRepairs(data: any, repairs: RepairAction[]): RepairResult {
        // 创建数据副本
        const repairedData = this.deepClone(data);
        let appliedRepairs = 0;
        const isolatedItems: IsolatedItem[] = [];

        // 按选中状态过滤修复操作
        const selectedRepairs = repairs.filter((r) => r.selected);

        // 应用每个选中的修复
        for (const repair of selectedRepairs) {
            try {
                this.applyStrategy(repairedData, repair);
                appliedRepairs++;
            } catch (error) {
                // 修复失败，隔离该项
                const item = this.getItemByError(repairedData, repair.error);
                if (item) {
                    isolatedItems.push({
                        originalItem: item,
                        errors: [repair.error],
                        reason:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error during repair',
                    });
                }
            }
        }

        // 验证修复后的数据
        const validationResult = dataDetector.detectErrors(repairedData);
        const remainingErrors = Object.values(
            validationResult.errorsByType,
        ).flat();

        return {
            success: remainingErrors.length === 0,
            repairedData,
            appliedRepairs,
            remainingErrors,
            isolatedItems,
        };
    }

    /**
     * 应用单个修复策略
     */
    applyStrategy(data: any, repair: RepairAction): void {
        const { error, strategy } = repair;

        // 根据错误获取目标数据项
        const item = this.getItemByError(data, error);
        if (!item) {
            throw new Error(`Item not found for error at index ${error.itemIndex}`);
        }

        // 生成修复值
        const repairValue = strategy.generateRepairValue(error, item);

        // 应用修复值到字段
        item[error.field] = repairValue;
    }

    /**
     * 验证修复后的数据
     */
    validateRepaired(data: any): { valid: boolean; errors: ItemError[] } {
        const result = dataDetector.detectErrors(data);
        const allErrors = Object.values(result.errorsByType).flat();

        return {
            valid: allErrors.length === 0,
            errors: allErrors,
        };
    }

    /**
     * 根据错误获取数据项
     */
    private getItemByError(data: any, error: ItemError): any {
        // 推断数据类型
        const dataType = this.inferDataType(error);

        // 获取对应的数组
        const items = data[dataType];
        if (!Array.isArray(items)) {
            return null;
        }

        // 返回对应索引的项
        return items[error.itemIndex];
    }

    /**
     * 推断数据类型
     */
    private inferDataType(error: ItemError): string {
        // 从错误消息中推断数据类型
        if (error.message.includes('问题')) {
            return 'questions';
        }
        if (error.message.includes('子问题')) {
            return 'subQuestions';
        }
        if (error.message.includes('答案')) {
            return 'answers';
        }
        if (error.message.includes('资源')) {
            return 'resources';
        }
        if (error.message.includes('Metadata')) {
            return 'metadata';
        }

        // 默认返回 questions
        return 'questions';
    }

    /**
     * 深度克隆对象
     */
    private deepClone(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.deepClone(item));
        }

        const cloned: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }

        return cloned;
    }
}

// 导出单例实例
export const dataRepairer = new DataRepairer();
