/**
 * 模式配置常量
 * 定义访客模式和拥有者模式的详细信息
 */

import React from 'react';
import { Eye, User } from 'lucide-react';
import type { AppMode } from '@/types/auth';

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
 * 模式配置对象
 */
export const MODE_CONFIG: Record<AppMode, ModeInfo> = {
    visitor: {
        mode: 'visitor',
        title: '访客模式',
        description: '浏览和查看知识内容',
        icon: <Eye size={32} />,
        features: [
            '查看所有资源和问答内容',
            '使用搜索和筛选功能',
            '查看时间线和历史记录',
            '无需登录即可访问',
        ],
        requiresAuth: false,
    },
    owner: {
        mode: 'owner',
        title: '拥有者模式',
        description: '完整的内容管理权限',
        icon: <User size={32} />,
        features: [
            '创建、编辑和删除内容',
            '同步数据到GitHub Gist',
            '导入和导出数据',
            '生成分享链接',
            '访问所有设置功能',
        ],
        requiresAuth: true,
    },
};
