/**
 * Hook for data repair and sync operations
 * 数据修复和同步操作的 Hook
 */

import { useState, useCallback } from 'react';
import { repairSyncIntegration } from '@/services/repair';
import type { RepairSyncResult, RepairSyncOptions } from '@/services/repair/RepairSyncIntegration';
import type { RepairPlan } from '@/types/dataRepair';
import { useToast } from './useToast';

// 导出类型供其他组件使用
export type { RepairSyncResult };

interface UseDataRepairSyncState {
    isRepairing: boolean;
    isSyncing: boolean;
    lastResult: RepairSyncResult | null;
    error: string | null;
    showSuccessModal: boolean;
}

export function useDataRepairSync() {
    const [state, setState] = useState<UseDataRepairSyncState>({
        isRepairing: false,
        isSyncing: false,
        lastResult: null,
        error: null,
        showSuccessModal: false
    });

    const { showToast } = useToast();

    const repairAndSync = useCallback(async (
        data: any,
        repairPlan: RepairPlan,
        selectedRepairIds: string[],
        options?: RepairSyncOptions
    ): Promise<RepairSyncResult> => {
        setState(prev => ({ ...prev, isRepairing: true, error: null }));

        try {
            const result = await repairSyncIntegration.repairAndSync(
                data,
                repairPlan,
                selectedRepairIds,
                options
            );

            setState(prev => ({
                ...prev,
                isRepairing: false,
                lastResult: result,
                error: result.success ? null : result.error || '修复失败'
            }));

            // 显示适当的提示
            if (result.success) {
                if (result.repairResult.appliedRepairs > 0) {
                    showToast(
                        'success',
                        `成功修复 ${result.repairResult.appliedRepairs} 个问题${result.syncResult?.success ? '并同步到 Gist' : ''}`
                    );
                } else {
                    showToast('info', '数据已是有效状态，无需修复');
                }

                if (result.syncResult && !result.syncResult.success) {
                    showToast('warning', '修复成功，但同步失败：' + result.syncResult.error);
                }
            } else {
                showToast('error', '修复失败：' + (result.error || '未知错误'));
            }

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '修复过程中发生错误';
            setState(prev => ({
                ...prev,
                isRepairing: false,
                error: errorMessage
            }));
            showToast('error', errorMessage);
            throw error;
        }
    }, [showToast]);

    const autoRepairSafe = useCallback(async (data: any): Promise<RepairSyncResult> => {
        setState(prev => ({ ...prev, isRepairing: true, error: null }));

        try {
            const result = await repairSyncIntegration.autoRepairSafeIssues(data);

            setState(prev => ({
                ...prev,
                isRepairing: false,
                lastResult: result,
                error: result.success ? null : result.error || '自动修复失败'
            }));

            if (result.success && result.repairResult.appliedRepairs > 0) {
                showToast(
                    'success',
                    `自动修复了 ${result.repairResult.appliedRepairs} 个安全问题`
                );
            }

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '自动修复失败';
            setState(prev => ({
                ...prev,
                isRepairing: false,
                error: errorMessage
            }));
            showToast('error', errorMessage);
            throw error;
        }
    }, [showToast]);

    const checkDataHealth = useCallback(async (data: any) => {
        try {
            return await repairSyncIntegration.checkDataHealthBeforeSync(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '健康检查失败';
            setState(prev => ({ ...prev, error: errorMessage }));
            throw error;
        }
    }, []);

    const getBackups = useCallback(() => {
        return repairSyncIntegration.getAvailableBackups();
    }, []);

    const restoreBackup = useCallback((backupKey: string) => {
        try {
            const restoredData = repairSyncIntegration.restoreFromBackup(backupKey);
            if (restoredData) {
                showToast('success', '数据已从备份恢复');
            } else {
                showToast('error', '备份恢复失败');
            }
            return restoredData;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '备份恢复失败';
            showToast('error', errorMessage);
            throw error;
        }
    }, [showToast]);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    const showSuccessDetails = useCallback(() => {
        setState(prev => ({ ...prev, showSuccessModal: true }));
    }, []);

    const hideSuccessDetails = useCallback(() => {
        setState(prev => ({ ...prev, showSuccessModal: false }));
    }, []);

    return {
        // State
        isRepairing: state.isRepairing,
        isSyncing: state.isSyncing,
        lastResult: state.lastResult,
        error: state.error,
        showSuccessModal: state.showSuccessModal,

        // Actions
        repairAndSync,
        autoRepairSafe,
        checkDataHealth,
        getBackups,
        restoreBackup,
        clearError,
        showSuccessDetails,
        hideSuccessDetails
    };
}
