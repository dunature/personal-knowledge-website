/**
 * Repair Strategy Registry
 * 修复策略注册表 - 管理所有可用的修复策略
 */

import type { RepairStrategy, ItemError } from '@/types/dataRepair';

/**
 * 修复策略注册表类
 */
export class RepairStrategyRegistry {
    private strategies: Map<string, RepairStrategy> = new Map();

    /**
     * 注册一个修复策略
     */
    register(strategy: RepairStrategy): void {
        this.strategies.set(strategy.name, strategy);
    }

    /**
     * 注销一个修复策略
     */
    unregister(strategyName: string): void {
        this.strategies.delete(strategyName);
    }

    /**
     * 获取所有注册的策略
     */
    getAllStrategies(): RepairStrategy[] {
        return Array.from(this.strategies.values());
    }

    /**
     * 根据名称获取策略
     */
    getStrategy(name: string): RepairStrategy | undefined {
        return this.strategies.get(name);
    }

    /**
     * 为给定的错误找到合适的修复策略
     */
    findStrategyForError(error: ItemError): RepairStrategy | null {
        for (const strategy of this.strategies.values()) {
            if (strategy.canApply(error)) {
                return strategy;
            }
        }
        return null;
    }

    /**
     * 清空所有策略
     */
    clear(): void {
        this.strategies.clear();
    }

    /**
     * 获取策略数量
     */
    get size(): number {
        return this.strategies.size;
    }
}

// 导出单例实例
export const repairStrategyRegistry = new RepairStrategyRegistry();
