/**
 * 自动同步提供者组件
 * 在应用中启用自动同步功能
 */

import type { ReactNode } from 'react';
import { useAutoSync } from '@/hooks/useAutoSync';
import { useAuth } from '@/contexts/AuthContext';

interface AutoSyncProviderProps {
    children: ReactNode;
}

/**
 * 自动同步提供者
 * 监听网络状态，在网络恢复后自动同步待同步变更
 */
export const AutoSyncProvider = ({ children }: AutoSyncProviderProps): React.ReactElement => {
    const { mode } = useAuth();

    // 只在拥有者模式下启用自动同步
    const enabled = mode === 'owner';

    // 启用自动同步
    useAutoSync({
        enabled,
        showNotifications: true,
    });

    return <>{children}</>;
};
