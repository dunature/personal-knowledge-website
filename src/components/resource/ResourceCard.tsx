/**
 * ResourceCard基础组件
 * 根据资源类型渲染不同的卡片
 */

import React, { useState, useCallback, useMemo } from 'react';
import { MoreVertical } from 'lucide-react';
import { permissionService } from '@/services/permissionService';
import type { Resource } from '@/types';
import { VideoCard } from './VideoCard';
import { BlogCard } from './BlogCard';
import { GitHubCard } from './GitHubCard';
import { RedditCard } from './RedditCard';
import { ToolCard } from './ToolCard';

export interface ResourceCardProps {
    resource: Resource;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onTagClick?: (tag: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = React.memo(({
    resource,
    onEdit,
    onDelete,
    onTagClick,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const canEdit = permissionService.shouldShowEditButtons();

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(resource.url);
        setShowMenu(false);
        // TODO: 显示成功提示
    }, [resource.url]);

    const handleEdit = useCallback(() => {
        setShowMenu(false);
        onEdit?.(resource.id);
    }, [onEdit, resource.id]);

    const handleDelete = useCallback(() => {
        setShowMenu(false);
        onDelete?.(resource.id);
    }, [onDelete, resource.id]);

    const toggleMenu = useCallback(() => {
        setShowMenu(prev => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setShowMenu(false);
    }, []);

    // 根据资源类型渲染对应的卡片
    const renderCard = useMemo(() => {
        const commonProps = {
            resource,
            onTagClick,
        };

        switch (resource.type) {
            case 'youtube_video':
            case 'bilibili_video':
                return <VideoCard {...commonProps} />;
            case 'blog':
                return <BlogCard {...commonProps} />;
            case 'github':
                return <GitHubCard {...commonProps} />;
            case 'reddit':
                return <RedditCard {...commonProps} />;
            case 'tool':
                return <ToolCard {...commonProps} />;
            default:
                return null;
        }
    }, [resource, onTagClick]);

    return (
        <div className="relative group">
            {/* 卡片容器 */}
            <div className="w-[320px] bg-white rounded-card shadow-card hover:shadow-card-hover card-hover overflow-hidden">
                {renderCard}
            </div>

            {/* 三点菜单 - 仅在拥有者模式或有复制链接功能时显示 */}
            {(canEdit || true) && (
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={toggleMenu}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-fast hover:bg-white shadow-sm"
                        aria-label="更多操作"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {/* 菜单下拉 */}
                    {showMenu && (
                        <>
                            {/* 点击外部关闭 */}
                            <div
                                className="fixed inset-0 z-20"
                                onClick={closeMenu}
                            />

                            <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-card border border-divider overflow-hidden z-30">
                                {canEdit && (
                                    <button
                                        onClick={handleEdit}
                                        className="w-full px-4 py-2 text-left text-small hover:bg-background-secondary transition-fast"
                                    >
                                        编辑
                                    </button>
                                )}
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full px-4 py-2 text-left text-small hover:bg-background-secondary transition-fast"
                                >
                                    复制链接
                                </button>
                                {canEdit && (
                                    <button
                                        onClick={handleDelete}
                                        className="w-full px-4 py-2 text-left text-small text-[#E65100] hover:bg-[#FFF3E0] transition-fast"
                                    >
                                        删除
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
});
