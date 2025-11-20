/**
 * Repair Sync Integration Service
 * 集成数据修复工作流与 Gist 同步服务
 */

import { syncService } from '../syncService';
import { dataDetector } from './DataDetector';
import { repairAnalyzer } from './RepairAnalyzer';
import { dataRepairer } from './DataRepairer';
import type { RepairResult, RepairPlan, DetectionResult } from '@/types/dataRepair';
import type { SyncResult } from '@/types/sync';

export interface RepairSyncOptions {
    autoSync?: boolean;
    createBackup?: boolean;
    validateAfterRepair?: boolean;
    syncTimeout?: number;
}

export interface RepairSyncResult {
    repairResult: RepairResult;
    syncResult?: SyncResult;
    backupCreated?: boolean;
    validationAfterRepair?: DetectionResult;
    success: boolean;
    error?: string;
}

class RepairSyncIntegrationService {
    /**
     * 执行数据修复并可选地同步到 Gist
     */
    async repairAndSync(
        data: any,
        repairPlan: RepairPlan,
        selectedRepairIds: string[],
        options: RepairSyncOptions = {}
    ): Promise<RepairSyncResult> {
        const {
            autoSync = true,
            createBackup = true,
            validateAfterRepair = true,
            syncTimeout = 30000
        } = options;

        try {
            // 步骤 1: 创建备份（如果需要）
            let backupCreated = false;
            if (createBackup) {
                await this.createDataBackup(data);
                backupCreated = true;
            }

            // 步骤 2: 应用修复
            const selectedRepairs = repairPlan.repairs.filter(repair =>
                selectedRepairIds.includes(repair.id)
            );

            const repairResult = dataRepairer.applyRepairs(data, selectedRepairs);

            // 步骤 3: 验证修复后的数据（如果需要）
            let validationAfterRepair: DetectionResult | undefined;
            if (validateAfterRepair) {
                validationAfterRepair = dataDetector.detectErrors(repairResult.repairedData);
            }

            // 步骤 4: 同步到 Gist（如果需要且修复成功）
            let syncResult: SyncResult | undefined;
            if (autoSync && repairResult.success) {
                try {
                    syncResult = await Promise.race([
                        this.syncRepairedData(),
                        new Promise<never>((_, reject) =>
                            setTimeout(() => reject(new Error('Sync timeout')), syncTimeout)
                        )
                    ]);
                } catch (syncError) {
                    console.warn('同步失败:', syncError);
                    // 不让同步失败影响整个操作
                    syncResult = {
                        success: false,
                        error: syncError instanceof Error ? syncError.message : '同步失败',
                        timestamp: new Date().toISOString()
                    };
                }
            }

            return {
                repairResult,
                syncResult,
                backupCreated,
                validationAfterRepair,
                success: repairResult.success
            };

        } catch (error) {
            return {
                repairResult: {
                    success: false,
                    appliedRepairs: 0,
                    repairedData: data,
                    remainingErrors: [],
                    isolatedItems: []
                },
                success: false,
                error: error instanceof Error ? error.message : '未知错误'
            };
        }
    }

    /**
     * 在同步前检查数据健康状况
     */
    async checkDataHealthBeforeSync(data: any): Promise<{
        needsRepair: boolean;
        validationResult: DetectionResult;
        repairPlan?: RepairPlan;
    }> {
        const validationResult = dataDetector.detectErrors(data);
        const needsRepair = !validationResult.valid;

        let repairPlan: RepairPlan | undefined;
        if (needsRepair) {
            const allErrors = Object.values(validationResult.errorsByType).flat();
            repairPlan = repairAnalyzer.analyzeErrors(allErrors, data);
        }

        return {
            needsRepair,
            validationResult,
            repairPlan
        };
    }

    /**
     * 自动修复安全问题
     */
    async autoRepairSafeIssues(data: any): Promise<RepairSyncResult> {
        const healthCheck = await this.checkDataHealthBeforeSync(data);

        if (!healthCheck.needsRepair || !healthCheck.repairPlan) {
            return {
                repairResult: {
                    success: true,
                    appliedRepairs: 0,
                    repairedData: data,
                    remainingErrors: [],
                    isolatedItems: []
                },
                success: true
            };
        }

        // 只应用安全的、可自动应用的修复
        const safeRepairIds = healthCheck.repairPlan.repairs
            .filter(repair => repair.autoApplicable && repair.strategy.estimateRisk() === 'none')
            .map(repair => repair.id);

        if (safeRepairIds.length === 0) {
            return {
                repairResult: {
                    success: true,
                    appliedRepairs: 0,
                    repairedData: data,
                    remainingErrors: Object.values(healthCheck.validationResult.errorsByType).flat(),
                    isolatedItems: []
                },
                success: true
            };
        }

        return this.repairAndSync(data, healthCheck.repairPlan, safeRepairIds, {
            autoSync: true,
            createBackup: false, // 安全修复不需要备份
            validateAfterRepair: true
        });
    }

    /**
     * 同步修复后的数据到 Gist
     */
    private async syncRepairedData(): Promise<SyncResult> {
        // 注意：修复后的数据应该已经在 DataRepairer 中被应用
        // 这里只需要触发同步即可
        // 实际的数据保存应该在调用此方法之前完成
        return await syncService.syncToGist();
    }

    /**
     * 创建数据备份
     */
    private async createDataBackup(data: any): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupKey = `data-backup-${timestamp}`;

        try {
            localStorage.setItem(backupKey, JSON.stringify({
                data,
                timestamp: new Date().toISOString(),
                type: 'pre-repair-backup'
            }));

            // 只保留最近 5 个备份
            this.cleanupOldBackups();
        } catch (error) {
            console.warn('创建备份失败:', error);
            // 不让备份失败影响修复操作
        }
    }

    /**
     * 清理旧备份
     */
    private cleanupOldBackups(): void {
        try {
            const backupKeys = Object.keys(localStorage)
                .filter(key => key.startsWith('data-backup-'))
                .sort()
                .reverse(); // 最新的在前

            // 删除超过 5 个的备份
            backupKeys.slice(5).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.warn('清理旧备份失败:', error);
        }
    }

    /**
     * 获取可用备份列表
     */
    getAvailableBackups(): Array<{
        key: string;
        timestamp: string;
        size: number;
    }> {
        try {
            return Object.keys(localStorage)
                .filter(key => key.startsWith('data-backup-'))
                .map(key => {
                    const data = localStorage.getItem(key);
                    const parsed = data ? JSON.parse(data) : null;
                    return {
                        key,
                        timestamp: parsed?.timestamp || 'Unknown',
                        size: data?.length || 0
                    };
                })
                .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        } catch (error) {
            console.warn('获取备份列表失败:', error);
            return [];
        }
    }

    /**
     * 从备份恢复数据
     */
    restoreFromBackup(backupKey: string): any | null {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) return null;

            const parsed = JSON.parse(backupData);
            return parsed.data;
        } catch (error) {
            console.error('从备份恢复失败:', error);
            return null;
        }
    }
}

export const repairSyncIntegration = new RepairSyncIntegrationService();
