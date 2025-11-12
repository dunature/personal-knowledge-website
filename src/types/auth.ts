/**
 * 认证相关类型定义
 */

/**
 * 应用模式
 */
export type AppMode = 'owner' | 'visitor';

/**
 * 用户信息
 */
export interface User {
    username: string;
    avatarUrl: string;
    gistId?: string;
}

/**
 * 认证状态
 */
export interface AuthState {
    isAuthenticated: boolean;
    mode: AppMode;
    user: User | null;
    gistId: string | null;
}
