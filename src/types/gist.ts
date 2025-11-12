/**
 * GitHub Gist 相关类型定义
 */

import type { Resource } from './resource';
import type { BigQuestion, SubQuestion, TimelineAnswer } from './question';

/**
 * Gist 数据结构
 * 包含所有需要同步的应用数据
 */
export interface GistData {
    resources: Resource[];
    questions: BigQuestion[];
    subQuestions: SubQuestion[];
    answers: TimelineAnswer[];
    metadata: GistMetadata;
}

/**
 * Gist 元数据
 */
export interface GistMetadata {
    version: string;
    lastSync: string;
    owner: string;
}

/**
 * Gist 版本信息
 */
export interface GistVersion {
    version: string;
    committedAt: string;
    changeStats: {
        additions: number;
        deletions: number;
    };
}

/**
 * GitHub API 响应 - 用户信息
 */
export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string | null;
}

/**
 * GitHub API 响应 - Gist
 */
export interface GitHubGist {
    id: string;
    url: string;
    html_url: string;
    description: string;
    public: boolean;
    files: Record<string, GitHubGistFile>;
    owner: GitHubUser;
    created_at: string;
    updated_at: string;
}

/**
 * GitHub API 响应 - Gist 文件
 */
export interface GitHubGistFile {
    filename: string;
    type: string;
    language: string | null;
    raw_url: string;
    size: number;
    content?: string;
}

/**
 * GitHub API 响应 - Gist 提交历史
 */
export interface GitHubGistCommit {
    version: string;
    committed_at: string;
    change_status: {
        total: number;
        additions: number;
        deletions: number;
    };
    user: GitHubUser;
}

/**
 * Token 验证结果
 */
export interface TokenValidationResult {
    valid: boolean;
    username?: string;
    avatarUrl?: string;
    error?: string;
}

/**
 * Gist 创建结果
 */
export interface GistCreateResult {
    id: string;
    url: string;
    htmlUrl: string;
}
