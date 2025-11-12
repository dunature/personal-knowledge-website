/**
 * BlogCard组件
 * 用于博客文章
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Tag } from '@/components/ui';
import type { Resource } from '@/types';
import { CONTENT_TAG_COLORS } from '@/types';

export interface BlogCardProps {
    resource: Resource;
    onTagClick?: (tag: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = React.memo(({ resource, onTagClick }) => {
    const { title, cover, content_tags, author, platform, recommendation, metadata, url } = resource;

    return (
        <>
            {/* 封面图 */}
            <div className="relative w-full h-[200px] bg-background-secondary overflow-hidden">
                <img
                    src={cover}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
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

                {/* 平台+作者 */}
                <p className="text-small text-secondary">
                    {platform} | {author}
                </p>

                {/* 推荐语 */}
                <p className="text-secondary text-secondary line-clamp-2">
                    {recommendation}
                </p>

                {/* 阅读时长和CTA */}
                <div className="flex items-center justify-between pt-2">
                    <span className="text-small text-tertiary">
                        {metadata.read_time ? `阅读时长: ${metadata.read_time} min` : ''}
                    </span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-small text-primary hover:underline"
                    >
                        Read
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </>
    );
});
