/**
 * 视频缩略图工具
 * 从视频 URL 提取缩略图
 */

import { generatePlaceholder } from './placeholderUtils';

/**
 * 从 YouTube URL 提取视频 ID
 */
export function extractYouTubeVideoId(url: string): string | null {
    // 支持多种 YouTube URL 格式
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * 获取 YouTube 视频缩略图 URL
 * @param url YouTube 视频 URL
 * @param quality 缩略图质量: 'default' | 'medium' | 'high' | 'standard' | 'maxres'
 * @returns 缩略图 URL
 */
export function getYouTubeThumbnail(url: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string {
    const videoId = extractYouTubeVideoId(url);

    if (!videoId) {
        // 如果无法提取视频 ID，返回占位图
        return generatePlaceholder({
            backgroundColor: '#FF0000',
            textColor: '#FFFFFF',
            text: 'YouTube'
        });
    }

    // YouTube 缩略图 URL 格式
    // default: 120x90
    // medium (mqdefault): 320x180
    // high (hqdefault): 480x360
    // standard (sddefault): 640x480
    // maxres (maxresdefault): 1280x720 (不是所有视频都有)

    const qualityMap = {
        'default': 'default',
        'medium': 'mqdefault',
        'high': 'hqdefault',
        'standard': 'sddefault',
        'maxres': 'maxresdefault',
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * 从 Bilibili URL 提取视频 ID (BV号)
 */
export function extractBilibiliVideoId(url: string): string | null {
    // 支持 BV 号格式
    const bvMatch = url.match(/(?:bilibili\.com\/video\/)?(BV[a-zA-Z0-9]+)/);
    if (bvMatch && bvMatch[1]) {
        return bvMatch[1];
    }

    // 支持 av 号格式
    const avMatch = url.match(/(?:bilibili\.com\/video\/)?av(\d+)/);
    if (avMatch && avMatch[1]) {
        return `av${avMatch[1]}`;
    }

    return null;
}

/**
 * 获取 Bilibili 视频缩略图
 * 注意：Bilibili 的缩略图需要通过 API 获取，这里返回占位图
 * 如果需要真实缩略图，需要调用 Bilibili API
 */
export function getBilibiliThumbnail(url: string): string {
    const videoId = extractBilibiliVideoId(url);

    if (!videoId) {
        return generatePlaceholder({
            backgroundColor: '#00A1D6',
            textColor: '#FFFFFF',
            text: 'Bilibili'
        });
    }

    // Bilibili 缩略图需要通过 API 获取
    // 这里返回带视频 ID 的占位图
    return generatePlaceholder({
        backgroundColor: '#00A1D6',
        textColor: '#FFFFFF',
        text: videoId
    });
}

/**
 * YouTube 视频信息接口
 */
export interface YouTubeVideoInfo {
    title: string;
    author: string;
    thumbnail: string;
}

/**
 * 从 YouTube oEmbed API 获取视频信息
 * @param url YouTube 视频 URL
 * @returns 视频信息（标题、作者、缩略图）
 */
export async function getYouTubeVideoInfo(url: string): Promise<YouTubeVideoInfo | null> {
    try {
        const videoId = extractYouTubeVideoId(url);
        if (!videoId) {
            return null;
        }

        // 使用 YouTube oEmbed API（无需 API 密钥）
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

        const response = await fetch(oembedUrl);
        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return {
            title: data.title || '',
            author: data.author_name || '未知',
            thumbnail: data.thumbnail_url || getYouTubeThumbnail(url),
        };
    } catch (error) {
        console.error('获取 YouTube 视频信息失败:', error);
        return null;
    }
}

/**
 * 根据视频 URL 自动获取缩略图
 */
export function getVideoThumbnail(url: string, type?: 'youtube_video' | 'bilibili_video'): string {
    // 如果没有指定类型，尝试从 URL 判断
    if (!type) {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            type = 'youtube_video';
        } else if (url.includes('bilibili.com')) {
            type = 'bilibili_video';
        }
    }

    switch (type) {
        case 'youtube_video':
            return getYouTubeThumbnail(url);
        case 'bilibili_video':
            return getBilibiliThumbnail(url);
        default:
            return generatePlaceholder({
                backgroundColor: '#607D8B',
                textColor: '#FFFFFF',
                text: 'Video'
            });
    }
}
