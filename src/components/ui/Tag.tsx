/**
 * Tag组件
 * 支持状态标签、内容标签、分类标签等
 */

import React from 'react';
import { X } from 'lucide-react';

export type TagVariant = 'default' | 'status' | 'category' | 'content';

export interface TagProps {
    children: React.ReactNode;
    variant?: TagVariant;
    color?: { bg: string; text: string };
    selected?: boolean;
    removable?: boolean;
    onRemove?: () => void;
    onClick?: () => void;
    className?: string;
}

export const Tag: React.FC<TagProps> = ({
    children,
    variant = 'default',
    color,
    selected = false,
    removable = false,
    onRemove,
    onClick,
    className = '',
}) => {
    const baseStyles = 'inline-flex items-center gap-1 rounded-tag font-medium transition-fast';

    const variantStyles = {
        default: 'px-2 py-1 text-small',
        status: 'px-2 py-1 text-small',
        category: 'px-3 py-1.5 text-small',
        content: 'px-2 py-1 text-small',
    };

    // 默认颜色
    const defaultColors = {
        default: { bg: '#F5F5F5', text: '#333' },
        status: { bg: '#E3F2FD', text: '#0047AB' },
        category: { bg: '#F5F5F5', text: '#666' },
        content: { bg: '#E3F2FD', text: '#333' },
    };

    const tagColor = color || defaultColors[variant];

    // 选中状态样式
    const selectedStyles = selected
        ? 'ring-2 ring-primary font-semibold'
        : '';

    // 可点击样式
    const clickableStyles = onClick
        ? 'cursor-pointer hover:opacity-80 active:scale-95'
        : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${selectedStyles} ${clickableStyles} ${className}`.trim();

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.stopPropagation();
            onClick();
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove();
        }
    };

    return (
        <span
            className={combinedClassName}
            style={{
                backgroundColor: tagColor.bg,
                color: tagColor.text,
            }}
            onClick={handleClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {children}
            {removable && (
                <button
                    type="button"
                    onClick={handleRemove}
                    className="ml-1 hover:opacity-70 focus:outline-none"
                    aria-label="移除标签"
                >
                    <X size={12} />
                </button>
            )}
        </span>
    );
};
