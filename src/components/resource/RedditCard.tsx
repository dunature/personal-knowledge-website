/**
 * RedditCard组件
 * 用于Reddit话题页
 */

import React from 'react';
import { Users, ExternalLink } from 'lucide-react';
import { Tag } from '@/components/ui';
import type { Resource } from '@/types';
import { CONTENT_TAG_COLORS } from '@/types';

export interface RedditCardProps {
    resource: Resource;
    onTagClick?: (tag: string) => void;
}

export const RedditCard: React.FC<RedditCardProps> = ({ resource, onTagClick }) => {
    const { title, cover, content_tags, author, recommendation, metadata, url } = resource;

    // 格式化成员数
    const formatMembers = (members?: number) => {
        if (!members) return '0';
        if (members >= 1000000) {
            return `${(members / 1000000).toFixed(1)}M`;
        }
        if (members >= 1000) {
            return `${(members / 1000).toFixed(1)}K`;
        }
        return members.toString();
    };

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

                {/* Subreddit名 */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-card-title text-primary font-semibold hover:underline line-clamp-2"
                >
                    {title}
                </a>

                {/* Reddit URL */}
                <p className="text-small text-secondary">
                    {author}
                </p>

                {/* 推荐语 */}
                <p className="text-secondary text-secondary line-clamp-2">
                    {recommendation}
                </p>

                {/* 成员数+CTA */}
                <div className="flex items-center justify-between pt-2">
                    <span className="inline-flex items-center gap-1 text-small text-tertiary">
                        <Users size={12} />
                        {formatMembers(metadata.members)} members
                    </span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-small text-primary hover:underline"
                    >
                        Visit
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </>
    );
};
