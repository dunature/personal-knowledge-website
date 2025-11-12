/**
 * VideoCard组件
 * 用于YouTube和Bilibili视频
 */

import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Tag } from '@/components/ui';
import type { Resource } from '@/types';
import { CONTENT_TAG_COLORS } from '@/types';

export interface VideoCardProps {
    resource: Resource;
    onTagClick?: (tag: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = React.memo(({ resource, onTagClick }) => {
    const { title, cover, platform_logo, content_tags, author, recommendation, metadata, url } = resource;

    return (
        <>
            {/* 封面图 */}
            <div className="relative w-full h-[200px] bg-background-secondary overflow-hidden">
                <img
                    src={cover}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                        // 图片加载失败时使用纯色背景
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                    }}
                />

                {/* 播放按钮 */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-fast cursor-pointer">
                        <Play size={24} fill="white" color="white" className="ml-1" />
                    </div>
                </div>

                {/* 平台Logo */}
                {platform_logo && (
                    <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full p-1 shadow-sm">
                        <img src={platform_logo} alt={resource.platform} className="w-full h-full object-contain" />
                    </div>
                )}
            </div>

            {/* 内容区 */}
            <div className="p-4 space-y-2">
                {/* 内容标签 */}
                {content_tags && content_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {content_tags.map((tag) => (
                            <Tag
                                key={tag}
                                variant="content"
                                color={CONTENT_TAG_COLORS[tag]}
                                onClick={() => onTagClick?.(tag)}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </div>
                )}

                {/* 标题 */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-card-title text-primary font-semibold hover:underline line-clamp-2"
                >
                    {title}
                </a>

                {/* 频道/作者 */}
                <p className="text-small text-secondary">
                    {author}
                </p>

                {/* 推荐语 */}
                <p className="text-secondary text-secondary line-clamp-2">
                    {recommendation}
                </p>

                {/* 时长和CTA */}
                <div className="flex items-center justify-between pt-2">
                    <span className="text-small text-tertiary">
                        {metadata.duration || ''}
                    </span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-small text-primary hover:underline"
                    >
                        Watch on
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </>
    );
});
