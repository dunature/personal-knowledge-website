/**
 * 网络状态检测 Hook
 * 监听网络连接状态变化
 */

import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
    isOnline: boolean;
    wasOffline: boolean; // 是否曾经离线过
}

export interface UseNetworkStatusOptions {
    onOnline?: () => void; // 网络恢复时的回调
    onOffline?: () => void; // 网络断开时的回调
}

/**
 * 使用网络状态 Hook
 * @param options - 配置选项
 * @returns 网络状态对象
 */
export const useNetworkStatus = (options?: UseNetworkStatusOptions): NetworkStatus => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [wasOffline, setWasOffline] = useState(false);

    const { onOnline, onOffline } = options || {};

    const handleOnline = useCallback(() => {
        setIsOnline(true);
        // 如果之前离线过，标记为曾经离线
        setWasOffline((prev) => {
            if (!prev && !navigator.onLine) {
                return true;
            }
            return prev;
        });

        // 触发回调
        if (onOnline) {
            onOnline();
        }
    }, [onOnline]);

    const handleOffline = useCallback(() => {
        setIsOnline(false);
        setWasOffline(true);

        // 触发回调
        if (onOffline) {
            onOffline();
        }
    }, [onOffline]);

    useEffect(() => {
        // 监听网络状态变化
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // 清理监听器
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [handleOnline, handleOffline]);

    return {
        isOnline,
        wasOffline,
    };
};
