/**
 * 资源类型定义
 * 支持5种资源类型：视频、博客、GitHub项目、Reddit话题、工具/网站
 */

export type ResourceType =
    | 'youtube_video'
    | 'bilibili_video'
    | 'blog'
    | 'github'
    | 'reddit'
    | 'tool';

/**
 * 资源元数据
 * 根据资源类型包含不同的字段
 */
export interface ResourceMetadata {
    // 视频相关
    duration?: string;        // 视频时长，格式 "HH:MM:SS"

    // 博客相关
    read_time?: number;       // 阅读时长（分钟）

    // GitHub相关
    stars?: number;           // Star数量
    language?: string;        // 主要编程语言

    // Reddit相关
    members?: number;         // 成员数
    posts_per_week?: number;  // 每周帖子数

    // 工具相关
    price?: string;           // 价格信息，如 "免费版可用"、"$10/月"
}

/**
 * 资源数据结构
 */
export interface Resource {
    id: string;
    title: string;
    url: string;
    type: ResourceType;
    cover: string;                    // 封面图片URL
    platform: string;                 // 平台名称，如 "YouTube"、"Medium"
    platform_logo?: string;           // 平台Logo URL

    content_tags: string[];           // 内容标签，如 ["Fundamentals", "Tutorial"]
    category: string;                 // 分类，如 "AI学习"、"编程"

    author: string;                   // 作者/频道名
    author_url?: string;              // 作者/频道链接
    recommendation: string;           // 推荐语/学习价值定位

    metadata: ResourceMetadata;       // 元数据
    custom_note?: string;             // 自定义备注（Markdown格式）

    created_at: string;               // 创建时间 ISO 8601格式
    updated_at: string;               // 更新时间 ISO 8601格式
}

/**
 * 资源创建/更新的输入类型
 * 省略自动生成的字段
 */
export type ResourceInput = Omit<Resource, 'id' | 'created_at' | 'updated_at'>;

/**
 * 资源筛选条件
 */
export interface ResourceFilter {
    category?: string;                // 按分类筛选
    tags?: string[];                  // 按标签筛选（AND逻辑）
    type?: ResourceType;              // 按类型筛选
    search?: string;                  // 搜索关键词
}

/**
 * 资源排序选项
 */
export type ResourceSortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc';

/**
 * 内容标签配色映射
 */
export const CONTENT_TAG_COLORS: Record<string, { bg: string; text: string }> = {
    'Fundamentals': { bg: '#E3F2FD', text: '#333' },
    'Product': { bg: '#E8F5E9', text: '#333' },
    'Interview': { bg: '#FFF3E0', text: '#333' },
    'Tutorial': { bg: '#F5F5F5', text: '#333' },
    'Tool': { bg: '#FCE4EC', text: '#333' },
    'Framework': { bg: '#F3E5F5', text: '#333' },
    'Library': { bg: '#E0F2F1', text: '#333' },
    'Discussion': { bg: '#FFF9C4', text: '#333' },
    'Community': { bg: '#E8F5E9', text: '#333' },
    'Deep Dive': { bg: '#E1F5FE', text: '#333' },
};
