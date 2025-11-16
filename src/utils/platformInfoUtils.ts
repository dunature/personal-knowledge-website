/**
 * 平台信息获取工具
 * 从各个平台 API 获取资源信息
 */

/**
 * Bilibili 视频信息接口
 */
export interface BilibiliVideoInfo {
    title: string;
    author: string;
    thumbnail: string;
}

/**
 * GitHub 仓库信息接口
 */
export interface GitHubRepoInfo {
    title: string;
    author: string;
    description: string;
    stars: number;
}

/**
 * 从 Bilibili API 获取视频信息
 * @param url Bilibili 视频 URL
 * @returns 视频信息（标题、UP主、封面）
 */
export async function getBilibiliVideoInfo(url: string): Promise<BilibiliVideoInfo | null> {
    try {
        // 提取 BV 号
        const bvMatch = url.match(/(?:bilibili\.com\/video\/)?(BV[a-zA-Z0-9]+)/);
        if (!bvMatch || !bvMatch[1]) {
            console.log('[Bilibili] 无法提取 BV 号');
            return null;
        }

        const bvid = bvMatch[1];
        console.log('[Bilibili] BV 号:', bvid);

        // 使用 Bilibili API
        // 开发环境使用 Vite 代理避免 CORS 问题
        const apiUrl = import.meta.env.DEV
            ? `/api/bilibili/x/web-interface/view?bvid=${bvid}`
            : `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;

        console.log('[Bilibili] API URL:', apiUrl);

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            console.log('[Bilibili] HTTP 请求失败:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('[Bilibili] API 响应:', data);

        if (data.code !== 0) {
            console.log('[Bilibili] API 返回错误码:', data.code, '消息:', data.message);

            // 如果是 -404 错误，说明视频不存在或已被删除
            if (data.code === -404) {
                console.log('[Bilibili] 视频不存在或已被删除，请尝试其他视频');
            }

            return null;
        }

        if (!data.data) {
            console.log('[Bilibili] API 响应中没有 data 字段');
            return null;
        }

        // 获取封面 URL
        let thumbnail = data.data.pic || '';

        // Bilibili 的封面 URL 可能是 http:// 开头，需要转换为 https://
        if (thumbnail && thumbnail.startsWith('http://')) {
            thumbnail = thumbnail.replace('http://', 'https://');
            console.log('[Bilibili] 封面 URL 已转换为 HTTPS:', thumbnail);
        }

        // 在开发环境中，使用代理来避免防盗链问题
        if (import.meta.env.DEV && thumbnail) {
            // 替换 Bilibili 图片域名为代理路径
            if (thumbnail.includes('i0.hdslb.com')) {
                thumbnail = thumbnail.replace('https://i0.hdslb.com', '/bilibili-img');
                console.log('[Bilibili] 使用图片代理 (i0):', thumbnail);
            } else if (thumbnail.includes('i1.hdslb.com')) {
                thumbnail = thumbnail.replace('https://i1.hdslb.com', '/bilibili-img2');
                console.log('[Bilibili] 使用图片代理 (i1):', thumbnail);
            } else if (thumbnail.includes('i2.hdslb.com')) {
                thumbnail = thumbnail.replace('https://i2.hdslb.com', '/bilibili-img3');
                console.log('[Bilibili] 使用图片代理 (i2):', thumbnail);
            }
        }

        console.log('[Bilibili] 最终封面 URL:', thumbnail);
        console.log('[Bilibili] 完整视频数据:', {
            title: data.data.title,
            author: data.data.owner?.name,
            pic: data.data.pic,
            thumbnail: thumbnail
        });

        return {
            title: data.data.title || '',
            author: data.data.owner?.name || '未知UP主',
            thumbnail: thumbnail,
        };
    } catch (error) {
        console.error('[Bilibili] 获取视频信息失败:', error);
        return null;
    }
}

/**
 * 从 GitHub API 获取仓库信息
 * @param url GitHub 仓库 URL
 * @returns 仓库信息（名称、作者、描述、星标数）
 */
export async function getGitHubRepoInfo(url: string): Promise<GitHubRepoInfo | null> {
    try {
        // 提取 owner 和 repo
        const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
        if (!match || !match[1] || !match[2]) {
            console.log('[GitHub] 无法提取仓库信息');
            return null;
        }

        const owner = match[1];
        const repo = match[2];
        console.log('[GitHub] 仓库:', owner, repo);

        // 使用 GitHub API
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.log('[GitHub] API 请求失败:', response.status);
            return null;
        }

        const data = await response.json();
        console.log('[GitHub] API 响应:', data);

        return {
            title: data.name || '',
            author: data.owner?.login || '未知',
            description: data.description || '',
            stars: data.stargazers_count || 0,
        };
    } catch (error) {
        console.error('[GitHub] 获取仓库信息失败:', error);
        return null;
    }
}
