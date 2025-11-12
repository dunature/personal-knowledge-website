/**
 * 认证服务
 * 管理 GitHub Token、用户状态和应用模式
 */

import { encryptToken, decryptToken, isValidEncryptedData } from '@/utils/cryptoUtils';
import { gistService } from './gistService';
import type { User, AppMode } from '@/types/auth';

// LocalStorage 键名
const STORAGE_KEYS = {
    TOKEN: 'pkw_github_token',
    GIST_ID: 'pkw_gist_id',
    MODE: 'pkw_mode',
    USER: 'pkw_user',
} as const;

/**
 * 认证服务类
 */
class AuthService {
    private token: string | null = null;
    private user: User | null = null;
    private mode: AppMode = 'visitor';
    private gistId: string | null = null;

    /**
     * 初始化服务，从 LocalStorage 加载状态
     */
    async initialize(): Promise<void> {
        try {
            // 加载模式
            const savedMode = localStorage.getItem(STORAGE_KEYS.MODE);
            if (savedMode === 'owner' || savedMode === 'visitor') {
                this.mode = savedMode;
            }

            // 加载 Gist ID
            this.gistId = localStorage.getItem(STORAGE_KEYS.GIST_ID);

            // 加载用户信息
            const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
            if (savedUser) {
                this.user = JSON.parse(savedUser);
            }

            // 如果是拥有者模式，尝试加载 Token
            if (this.mode === 'owner') {
                const encryptedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
                if (encryptedToken && isValidEncryptedData(encryptedToken)) {
                    try {
                        this.token = await decryptToken(encryptedToken);
                    } catch (error) {
                        console.error('Token 解密失败:', error);
                        // Token 解密失败，清除并切换到访客模式
                        await this.clearToken();
                    }
                }
            }
        } catch (error) {
            console.error('认证服务初始化失败:', error);
        }
    }

    /**
     * 设置并保存 Token
     * @param token - GitHub Personal Access Token
     * @returns 是否设置成功
     */
    async setToken(token: string): Promise<boolean> {
        try {
            // 验证 Token
            const validation = await gistService.validateToken(token);
            if (!validation.valid) {
                throw new Error(validation.error || 'Token 验证失败');
            }

            // 加密并保存 Token
            const encrypted = await encryptToken(token);
            localStorage.setItem(STORAGE_KEYS.TOKEN, encrypted);
            this.token = token;

            // 保存用户信息
            if (validation.username && validation.avatarUrl) {
                this.user = {
                    username: validation.username,
                    avatarUrl: validation.avatarUrl,
                    gistId: this.gistId || undefined,
                };
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
            }

            // 切换到拥有者模式
            this.mode = 'owner';
            localStorage.setItem(STORAGE_KEYS.MODE, 'owner');

            return true;
        } catch (error) {
            console.error('设置 Token 失败:', error);
            return false;
        }
    }

    /**
     * 获取当前 Token
     * @returns Token 或 null
     */
    async getToken(): Promise<string | null> {
        if (this.token) {
            return this.token;
        }

        // 尝试从 LocalStorage 加载
        const encryptedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (encryptedToken && isValidEncryptedData(encryptedToken)) {
            try {
                this.token = await decryptToken(encryptedToken);
                return this.token;
            } catch (error) {
                console.error('Token 解密失败:', error);
                return null;
            }
        }

        return null;
    }

    /**
     * 清除 Token 和相关数据
     */
    async clearToken(): Promise<void> {
        this.token = null;
        this.user = null;
        this.mode = 'visitor';

        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.setItem(STORAGE_KEYS.MODE, 'visitor');
    }

    /**
     * 检查是否已认证（拥有者模式且有有效 Token）
     * @returns 是否已认证
     */
    isAuthenticated(): boolean {
        return this.mode === 'owner' && this.token !== null;
    }

    /**
     * 获取当前用户信息
     * @returns 用户信息或 null
     */
    async getCurrentUser(): Promise<User | null> {
        if (this.user) {
            return this.user;
        }

        // 尝试从 LocalStorage 加载
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (savedUser) {
            try {
                this.user = JSON.parse(savedUser);
                return this.user;
            } catch (error) {
                console.error('解析用户信息失败:', error);
            }
        }

        return null;
    }

    /**
     * 获取当前应用模式
     * @returns 应用模式
     */
    getMode(): AppMode {
        return this.mode;
    }

    /**
     * 切换应用模式
     * @param mode - 目标模式
     */
    switchMode(mode: AppMode): void {
        this.mode = mode;
        localStorage.setItem(STORAGE_KEYS.MODE, mode);

        // 如果切换到访客模式，清除 Token（但保留 Gist ID）
        if (mode === 'visitor') {
            this.token = null;
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
        }
    }

    /**
     * 设置 Gist ID
     * @param gistId - Gist ID
     */
    setGistId(gistId: string): void {
        this.gistId = gistId;
        localStorage.setItem(STORAGE_KEYS.GIST_ID, gistId);

        // 更新用户信息中的 Gist ID
        if (this.user) {
            this.user.gistId = gistId;
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
        }
    }

    /**
     * 获取 Gist ID
     * @returns Gist ID 或 null
     */
    getGistId(): string | null {
        if (this.gistId) {
            return this.gistId;
        }

        // 尝试从 LocalStorage 加载
        this.gistId = localStorage.getItem(STORAGE_KEYS.GIST_ID);
        return this.gistId;
    }

    /**
     * 清除 Gist ID
     */
    clearGistId(): void {
        this.gistId = null;
        localStorage.removeItem(STORAGE_KEYS.GIST_ID);

        // 更新用户信息
        if (this.user) {
            this.user.gistId = undefined;
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
        }
    }

    /**
     * 清除所有数据（登出）
     */
    async clearAll(): Promise<void> {
        this.token = null;
        this.user = null;
        this.gistId = null;
        this.mode = 'visitor';

        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.GIST_ID);
        localStorage.setItem(STORAGE_KEYS.MODE, 'visitor');
    }

    /**
     * 生成分享链接
     * @returns 分享链接 URL
     */
    generateShareLink(): string | null {
        if (!this.gistId) {
            return null;
        }

        const baseUrl = window.location.origin;
        return `${baseUrl}?gist=${this.gistId}`;
    }

    /**
     * 从 URL 参数加载 Gist ID
     * @returns 是否成功加载
     */
    loadGistIdFromUrl(): boolean {
        const params = new URLSearchParams(window.location.search);
        const gistId = params.get('gist');

        if (gistId) {
            this.setGistId(gistId);
            // 自动切换到访客模式
            if (this.mode !== 'owner') {
                this.switchMode('visitor');
            }
            return true;
        }

        return false;
    }
}

// 导出单例
export const authService = new AuthService();
