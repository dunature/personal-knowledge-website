/**
 * 权限服务
 * 根据用户模式控制功能访问权限
 */

import { authService } from './authService';
import type { AppMode } from '@/types/auth';

/**
 * 权限服务类
 */
class PermissionService {
    /**
     * 检查是否可以创建内容
     */
    canCreate(): boolean {
        const mode = authService.getMode();
        return mode === 'owner';
    }

    /**
     * 检查是否可以编辑内容
     */
    canEdit(): boolean {
        const mode = authService.getMode();
        return mode === 'owner';
    }

    /**
     * 检查是否可以删除内容
     */
    canDelete(): boolean {
        const mode = authService.getMode();
        return mode === 'owner';
    }

    /**
     * 检查是否应该显示编辑按钮
     */
    shouldShowEditButtons(): boolean {
        return this.canEdit();
    }

    /**
     * 检查是否应该显示添加按钮
     */
    shouldShowAddButtons(): boolean {
        return this.canCreate();
    }

    /**
     * 检查是否可以同步数据
     * 访客模式：可以从 Gist 拉取数据（只读）
     * 拥有者模式：可以双向同步（需要认证）
     */
    canSync(): boolean {
        const mode = authService.getMode();
        const gistId = authService.getGistId();

        // 访客模式：只要有 Gist ID 就可以拉取数据
        if (mode === 'visitor') {
            return gistId !== null;
        }

        // 拥有者模式：需要认证和 Gist ID
        const isAuthenticated = authService.isAuthenticated();
        return mode === 'owner' && isAuthenticated && gistId !== null;
    }

    /**
     * 检查是否可以推送数据到 Gist
     */
    canPush(): boolean {
        const mode = authService.getMode();
        const isAuthenticated = authService.isAuthenticated();
        const gistId = authService.getGistId();
        return mode === 'owner' && isAuthenticated && gistId !== null;
    }

    /**
     * 检查是否可以访问设置
     */
    canAccessSettings(): boolean {
        const mode = authService.getMode();
        return mode === 'owner';
    }

    /**
     * 检查是否可以分享
     */
    canShare(): boolean {
        const mode = authService.getMode();
        const gistId = authService.getGistId();
        return mode === 'owner' && gistId !== null;
    }

    /**
     * 获取当前模式
     */
    getCurrentMode(): AppMode {
        return authService.getMode();
    }

    /**
     * 检查是否为拥有者模式
     */
    isOwnerMode(): boolean {
        return authService.getMode() === 'owner';
    }

    /**
     * 检查是否为访客模式
     */
    isVisitorMode(): boolean {
        return authService.getMode() === 'visitor';
    }
}

export const permissionService = new PermissionService();
