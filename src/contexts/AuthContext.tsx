/**
 * 认证 Context
 * 管理用户认证状态和应用模式
 */

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import { syncService } from '@/services/syncService';
import type { AppMode, AuthState } from '@/types/auth';

interface AuthContextValue extends AuthState {
    // Token 管理
    setToken: (token: string) => Promise<boolean>;
    getToken: () => Promise<string | null>;
    clearToken: () => Promise<void>;

    // 模式管理
    switchMode: (mode: AppMode) => Promise<void>;

    // Gist ID 管理
    setGistId: (gistId: string) => void;
    clearGistId: () => void;

    // 用户管理
    refreshUser: () => Promise<void>;

    // 分享功能
    generateShareLink: () => string | null;

    // 清除所有数据
    clearAll: () => Promise<void>;

    // 加载状态
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        mode: 'visitor',
        user: null,
        gistId: null,
    });
    const [isLoading, setIsLoading] = useState(true);

    // 初始化认证状态
    useEffect(() => {
        const initAuth = async () => {
            try {
                await authService.initialize();

                // 初始化同步服务
                await syncService.initialize();

                // 检查 URL 参数中的 Gist ID
                authService.loadGistIdFromUrl();

                // 更新状态
                const mode = authService.getMode();
                const gistId = authService.getGistId();
                const user = await authService.getCurrentUser();
                const isAuthenticated = authService.isAuthenticated();

                setAuthState({
                    isAuthenticated,
                    mode,
                    user,
                    gistId,
                });

                // 手动同步模式：不自动同步
                // 用户需要手动点击同步按钮来同步数据
                console.log('手动同步模式已启用，不会自动同步数据');
            } catch (error) {
                console.error('认证初始化失败:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    // 设置 Token
    const setToken = useCallback(async (token: string): Promise<boolean> => {
        const success = await authService.setToken(token);

        if (success) {
            const mode = authService.getMode();
            const user = await authService.getCurrentUser();
            const gistId = authService.getGistId();

            setAuthState({
                isAuthenticated: true,
                mode,
                user,
                gistId,
            });
        }

        return success;
    }, []);

    // 获取 Token
    const getToken = useCallback(async (): Promise<string | null> => {
        return authService.getToken();
    }, []);

    // 清除 Token
    const clearToken = useCallback(async (): Promise<void> => {
        await authService.clearToken();

        setAuthState((prev) => ({
            ...prev,
            isAuthenticated: false,
            mode: 'visitor',
            user: null,
        }));
    }, []);

    // 切换模式
    const switchMode = useCallback(async (mode: AppMode): Promise<void> => {
        authService.switchMode(mode);

        // 如果切换到 owner 模式，检查是否有有效的 Token
        if (mode === 'owner') {
            const token = await authService.getToken();
            const user = await authService.getCurrentUser();

            setAuthState((prev) => ({
                ...prev,
                mode,
                isAuthenticated: !!token && !!user,
                user,
            }));
        } else {
            // 切换到 visitor 模式
            setAuthState((prev) => ({
                ...prev,
                mode,
                isAuthenticated: false,
            }));
        }
    }, []);

    // 设置 Gist ID
    const setGistId = useCallback((gistId: string): void => {
        authService.setGistId(gistId);

        setAuthState((prev) => ({
            ...prev,
            gistId,
            user: prev.user ? { ...prev.user, gistId } : null,
        }));
    }, []);

    // 清除 Gist ID
    const clearGistId = useCallback((): void => {
        authService.clearGistId();

        setAuthState((prev) => ({
            ...prev,
            gistId: null,
            user: prev.user ? { ...prev.user, gistId: undefined } : null,
        }));
    }, []);

    // 刷新用户信息
    const refreshUser = useCallback(async (): Promise<void> => {
        const user = await authService.getCurrentUser();
        setAuthState((prev) => ({
            ...prev,
            user,
        }));
    }, []);

    // 生成分享链接
    const generateShareLink = useCallback((): string | null => {
        return authService.generateShareLink();
    }, []);

    // 清除所有数据
    const clearAll = useCallback(async (): Promise<void> => {
        await authService.clearAll();

        setAuthState({
            isAuthenticated: false,
            mode: 'visitor',
            user: null,
            gistId: null,
        });
    }, []);

    const value: AuthContextValue = {
        ...authState,
        setToken,
        getToken,
        clearToken,
        switchMode,
        setGistId,
        clearGistId,
        refreshUser,
        generateShareLink,
        clearAll,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 使用认证 Context 的 Hook
 */
export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
