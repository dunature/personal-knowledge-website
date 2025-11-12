/**
 * Markdown预览组件
 * 渲染Markdown格式的内容，支持代码高亮
 */

import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import './MarkdownPreview.css';

interface MarkdownPreviewProps {
    content: string;
    className?: string;
}

// 配置marked
marked.setOptions({
    breaks: true,
    gfm: true,
});

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
    content,
    className = '',
}) => {
    const previewRef = useRef<HTMLDivElement>(null);

    // 渲染Markdown
    const html = marked(content || '') as string;

    // 在内容更新后高亮代码块
    useEffect(() => {
        if (previewRef.current) {
            previewRef.current.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
        }
    }, [content]);

    return (
        <div
            ref={previewRef}
            className={`markdown-preview prose max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
            style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#333',
            }}
        />
    );
};
