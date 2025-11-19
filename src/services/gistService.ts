/**
 * GitHub Gist API 服务
 * 封装所有与 GitHub Gist 相关的 API 调用
 */

import type {
    GistData,
    GitHubGist,
    GitHubGistCommit,
    TokenValidationResult,
    GistCreateResult,
    GistVersion,
} from '@/types/gist';
import { handleApiError, toGistError } from '@/utils/errorHandler';
import { compressData, decompressData, shouldCompress, formatDataSize } from '@/utils/compression';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Gist 元数据缓存
 */
interface GistMetadataCache {
    [gistId: string]: {
        data: any;
        timestamp: number;
    };
}

const METADATA_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const metadataCache: GistMetadataCache = {};

/**
 * GitHub Gist 服务类
 */
class GistService {
    /**
     * 验证 GitHub Personal Access Token 的有效性
     * @param token - GitHub Personal Access Token
     * @returns 验证结果，包含用户名和头像
     */
    async validateToken(token: string): Promise<TokenValidationResult> {
        try {
            const response = await fetch(`${GITHUB_API_BASE}/user`, {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    return {
                        valid: false,
                        error: 'Token 无效或已过期',
                    };
                }
                const apiError = await handleApiError(response);
                return {
                    valid: false,
                    error: apiError.getUserMessage(),
                };
            }

            const user = await response.json();

            return {
                valid: true,
                username: user.login,
                avatarUrl: user.avatar_url,
            };
        } catch (error) {
            console.error('Token 验证失败:', error);
            const gistError = toGistError(error, { context: 'validateToken' });
            return {
                valid: false,
                error: gistError.getUserMessage(),
            };
        }
    }

    /**
     * 创建新的 Gist
     * @param data - 要存储的数据
     * @param token - GitHub Personal Access Token
     * @returns Gist ID 和 URL
     */
    async createGist(data: GistData, token: string): Promise<GistCreateResult> {
        try {
            // 准备数据
            const resourcesContent = JSON.stringify(data.resources, null, 2);
            const questionsContent = JSON.stringify(
                {
                    questions: data.questions,
                    subQuestions: data.subQuestions,
                    answers: data.answers,
                },
                null,
                2
            );
            const metadataContent = JSON.stringify(data.metadata, null, 2);

            // 压缩大数据
            const compressedResources = await compressData(resourcesContent);
            const compressedQuestions = await compressData(questionsContent);

            // 记录压缩信息
            if (shouldCompress(resourcesContent)) {
                console.log(
                    `资源数据压缩: ${formatDataSize(resourcesContent.length)} -> ${formatDataSize(compressedResources.length)}`
                );
            }
            if (shouldCompress(questionsContent)) {
                console.log(
                    `问答数据压缩: ${formatDataSize(questionsContent.length)} -> ${formatDataSize(compressedQuestions.length)}`
                );
            }

            const gistPayload = {
                description: 'Personal Knowledge Base Data',
                public: true,
                files: {
                    'resources.json': {
                        content: compressedResources,
                    },
                    'questions.json': {
                        content: compressedQuestions,
                    },
                    'metadata.json': {
                        content: metadataContent,
                    },
                },
            };

            const response = await fetch(`${GITHUB_API_BASE}/gists`, {
                method: 'POST',
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gistPayload),
            });

            if (!response.ok) {
                throw new Error(`创建 Gist 失败: ${response.status}`);
            }

            const gist: GitHubGist = await response.json();

            return {
                id: gist.id,
                url: gist.url,
                htmlUrl: gist.html_url,
            };
        } catch (error) {
            console.error('创建 Gist 失败:', error);
            throw error;
        }
    }

    /**
     * 获取 Gist 数据
     * @param gistId - Gist ID
     * @param token - GitHub Personal Access Token (可选，公开 Gist 不需要)
     * @returns Gist 数据
     */
    async getGist(gistId: string, token?: string): Promise<GistData> {
        try {
            const headers: HeadersInit = {
                Accept: 'application/vnd.github.v3+json',
            };

            if (token) {
                headers.Authorization = `token ${token}`;
            }

            const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
                headers,
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Gist 不存在或无权访问');
                }
                throw new Error(`获取 Gist 失败: ${response.status}`);
            }

            const gist: GitHubGist = await response.json();

            // 解析文件内容
            const resourcesContent = gist.files['resources.json']?.content;
            const questionsContent = gist.files['questions.json']?.content;
            const metadataContent = gist.files['metadata.json']?.content;

            if (!resourcesContent || !questionsContent || !metadataContent) {
                throw new Error('Gist 数据格式不完整');
            }

            // 解压数据（如果已压缩）
            const decompressedResources = await decompressData(resourcesContent);
            const decompressedQuestions = await decompressData(questionsContent);

            const resources = JSON.parse(decompressedResources);
            const questionsData = JSON.parse(decompressedQuestions);
            const metadata = JSON.parse(metadataContent);

            return {
                resources,
                questions: questionsData.questions || [],
                subQuestions: questionsData.subQuestions || [],
                answers: questionsData.answers || [],
                metadata,
            };
        } catch (error) {
            console.error('获取 Gist 失败:', error);
            throw error;
        }
    }

    /**
     * 更新 Gist 数据
     * @param gistId - Gist ID
     * @param data - 要更新的数据
     * @param token - GitHub Personal Access Token
     */
    async updateGist(gistId: string, data: GistData, token: string): Promise<void> {
        try {
            // 准备数据
            const resourcesContent = JSON.stringify(data.resources, null, 2);
            const questionsContent = JSON.stringify(
                {
                    questions: data.questions,
                    subQuestions: data.subQuestions,
                    answers: data.answers,
                },
                null,
                2
            );
            const metadataContent = JSON.stringify(data.metadata, null, 2);

            // 压缩大数据
            const compressedResources = await compressData(resourcesContent);
            const compressedQuestions = await compressData(questionsContent);

            const gistPayload = {
                files: {
                    'resources.json': {
                        content: compressedResources,
                    },
                    'questions.json': {
                        content: compressedQuestions,
                    },
                    'metadata.json': {
                        content: metadataContent,
                    },
                },
            };

            const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gistPayload),
            });

            if (!response.ok) {
                throw new Error(`更新 Gist 失败: ${response.status}`);
            }
        } catch (error) {
            console.error('更新 Gist 失败:', error);
            throw error;
        }
    }

    /**
     * 获取 Gist 版本历史
     * @param gistId - Gist ID
     * @param token - GitHub Personal Access Token (可选)
     * @returns 版本历史列表
     */
    async getGistHistory(gistId: string, token?: string): Promise<GistVersion[]> {
        try {
            const headers: HeadersInit = {
                Accept: 'application/vnd.github.v3+json',
            };

            if (token) {
                headers.Authorization = `token ${token}`;
            }

            const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}/commits`, {
                headers,
            });

            if (!response.ok) {
                throw new Error(`获取版本历史失败: ${response.status}`);
            }

            const commits: GitHubGistCommit[] = await response.json();

            return commits.map((commit) => ({
                version: commit.version,
                committedAt: commit.committed_at,
                changeStats: {
                    additions: commit.change_status.additions,
                    deletions: commit.change_status.deletions,
                },
            }));
        } catch (error) {
            console.error('获取版本历史失败:', error);
            throw error;
        }
    }

    /**
     * 获取特定版本的 Gist 数据
     * @param gistId - Gist ID
     * @param version - 版本 SHA
     * @param token - GitHub Personal Access Token (可选)
     * @returns 该版本的 Gist 数据
     */
    async getGistVersion(gistId: string, version: string, token?: string): Promise<GistData> {
        try {
            const headers: HeadersInit = {
                Accept: 'application/vnd.github.v3+json',
            };

            if (token) {
                headers.Authorization = `token ${token}`;
            }

            const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}/${version}`, {
                headers,
            });

            if (!response.ok) {
                throw new Error(`获取历史版本失败: ${response.status}`);
            }

            const gist: GitHubGist = await response.json();

            // 解析文件内容
            const resourcesContent = gist.files['resources.json']?.content;
            const questionsContent = gist.files['questions.json']?.content;
            const metadataContent = gist.files['metadata.json']?.content;

            if (!resourcesContent || !questionsContent || !metadataContent) {
                throw new Error('历史版本数据格式不完整');
            }

            const resources = JSON.parse(resourcesContent);
            const questionsData = JSON.parse(questionsContent);
            const metadata = JSON.parse(metadataContent);

            return {
                resources,
                questions: questionsData.questions || [],
                subQuestions: questionsData.subQuestions || [],
                answers: questionsData.answers || [],
                metadata,
            };
        } catch (error) {
            console.error('获取历史版本失败:', error);
            throw error;
        }
    }

    /**
     * 获取 Gist 元数据（不加载完整数据）
     * @param gistId - Gist ID
     * @param token - GitHub Personal Access Token (可选)
     * @returns Gist 元数据
     */
    async getGistMetadata(gistId: string, token?: string): Promise<any> {
        try {
            // 检查缓存
            const cached = metadataCache[gistId];
            if (cached && Date.now() - cached.timestamp < METADATA_CACHE_TTL) {
                console.log('使用缓存的 Gist 元数据');
                return cached.data;
            }

            const headers: HeadersInit = {
                Accept: 'application/vnd.github.v3+json',
            };

            if (token) {
                headers.Authorization = `token ${token}`;
            }

            const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
                headers,
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Gist 不存在或无权访问');
                }
                throw new Error(`获取 Gist 元数据失败: ${response.status}`);
            }

            const gist: GitHubGist = await response.json();

            // 提取元数据（不包含文件内容）
            const metadata = {
                id: gist.id,
                description: gist.description,
                created_at: gist.created_at,
                updated_at: gist.updated_at,
                public: gist.public,
                owner: gist.owner
                    ? {
                        login: gist.owner.login,
                        avatar_url: gist.owner.avatar_url,
                    }
                    : null,
                html_url: gist.html_url,
            };

            // 缓存元数据
            metadataCache[gistId] = {
                data: metadata,
                timestamp: Date.now(),
            };

            return metadata;
        } catch (error) {
            console.error('获取 Gist 元数据失败:', error);
            throw error;
        }
    }

    /**
     * 验证用户是否是指定 Gist 的拥有者
     * @param gistId - Gist ID
     * @param token - GitHub Personal Access Token
     * @returns 拥有者验证结果
     */
    async verifyGistOwnership(
        gistId: string,
        token: string
    ): Promise<{ isOwner: boolean; ownerUsername?: string; error?: string }> {
        try {
            // 1. 获取当前用户信息
            const userResponse = await fetch(`${GITHUB_API_BASE}/user`, {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (!userResponse.ok) {
                if (userResponse.status === 401) {
                    return {
                        isOwner: false,
                        error: 'Token 无效或已过期',
                    };
                }
                return {
                    isOwner: false,
                    error: 'Token 验证失败',
                };
            }

            const currentUser = await userResponse.json();
            const currentUsername = currentUser.login;

            // 2. 获取 Gist 信息
            const gistResponse = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (!gistResponse.ok) {
                if (gistResponse.status === 404) {
                    return {
                        isOwner: false,
                        error: 'Gist 不存在或无权访问',
                    };
                }
                return {
                    isOwner: false,
                    error: `获取 Gist 信息失败: ${gistResponse.status}`,
                };
            }

            const gist = await gistResponse.json();
            const gistOwnerUsername = gist.owner?.login;

            // 3. 比较用户名
            const isOwner = currentUsername === gistOwnerUsername;

            return {
                isOwner,
                ownerUsername: gistOwnerUsername,
            };
        } catch (error) {
            console.error('验证 Gist 拥有者失败:', error);
            const gistError = toGistError(error, { context: 'verifyGistOwnership' });
            return {
                isOwner: false,
                error: gistError.getUserMessage(),
            };
        }
    }
}

// 导出单例
export const gistService = new GistService();
