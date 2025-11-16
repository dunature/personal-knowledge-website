/**
 * ToolCard组件
 * 用于工具/网站
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Tag } from '@/components/ui';
import type { Resource } from '@/types';
import { CONTENT_TAG_COLORS } from '@/types';

export interface ToolCardProps {
    resource: Resource;
    onTagClick?: (tag: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = React.memo(({ resource, onTagClick }) => {
    const { title, cover, content_tags, author, recommendation, metadata, url } = resource;

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

            {/* 内容区 - 固定高度确保卡片统一，移除padding因为外层已有 */}
            <div className="pt-4 h-[200px] flex flex-col">
                {/* 内容标签 */}
                {content_tags && content_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
                        {content_tags.slice(0, 3).map((tag) => (
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

                {/* 工具名 - 限制2行，最多约60个字符 */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-card-title text-primary font-semibold hover:underline line-clamp-2 mb-2 min-h-[48px]"
                    title={title}
                >
                    {title}
                </a>

                {/* 官网URL */}
                <p className="text-small text-secondary mb-2 truncate">
                    {author}
                </p>

                {/* 推荐语 - 限制2行，最多约80个字符 */}
                <p className="text-secondary text-secondary line-clamp-2 mb-2 flex-1" title={recommendation}>
                    {recommendation}
                </p>

                {/* 价格+CTA */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-small text-tertiary truncate max-w-[150px]">
                        {metadata.price || ''}
                    </span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-small text-primary hover:underline flex-shrink-0"
                    >
                        Visit
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </>
    );
});
