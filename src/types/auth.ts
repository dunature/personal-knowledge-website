/**
 * 认证相关类型定义
 */

import React from 'react';

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

/**
 * 模式信息接口
 */
export interface ModeInfo {
    mode: AppMode;
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    requiresAuth: boolean;
}

/**
 * Gist 检测结果
 */
export interface DetectGistResult {
    found: boolean;
    gistId?: string;
    gistUrl?: string;
    lastUpdated?: string;
}

/**
 * 初始化结果
 */
export interface InitializationResult {
    success: boolean;
    action: 'synced' | 'created' | 'conflict' | 'skipped';
    gistId?: string;
    error?: string;
}
