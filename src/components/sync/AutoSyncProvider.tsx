/**
 * 自动同步提供者组件
 * 在应用中启用自动同步功能
 */

import type { ReactNode } from 'react';
import { useAutoSync } from '@/hooks/useAutoSync';
import { useBidirectionalSync } from '@/hooks/useBidirectionalSync';
import { DataComparisonDialog } from './DataComparisonDialog';

interface AutoSyncProviderProps {
    children: ReactNode;
}

/**
 * 自动同步提供者
 * 监听网络状态，在网络恢复后自动同步待同步变更
 * 同时处理应用启动时的云端更新检查和定期检查
 */
export const AutoSyncProvider = ({ children }: AutoSyncProviderProps): React.ReactElement => {
    // 手动同步模式：禁用所有自动同步功能
    // 用户需要手动点击同步按钮来同步数据

    // 禁用单向自动同步（Push）
    useAutoSync({
        enabled: false, // 禁用自动同步
        showNotifications: true,
    });

    // 禁用双向同步（Pull + 定期检查）
    const {
        comparisonData,
        showComparisonDialog,
        handleSyncConfirmation,
        closeComparisonDialog,
    } = useBidirectionalSync({
        enabled: false, // 禁用自动检查
        enablePeriodicCheck: false, // 禁用定期检查
        periodicCheckInterval: 5 * 60 * 1000, // 5分钟
    });

    return (
        <>
            {children}

            {/* 数据对比对话框 */}
            {comparisonData && (
                <DataComparisonDialog
                    open={showComparisonDialog}
                    comparison={comparisonData}
                    onConfirm={handleSyncConfirmation}
                    onClose={closeComparisonDialog}
                />
            )}
        </>
    );
};
