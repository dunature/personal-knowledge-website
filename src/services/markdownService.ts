/**
 * Markdown服务
 * 提供Markdown解析和渲染功能
 */

import { marked } from 'marked';
import hljs from 'highlight.js';
import { ErrorType, createAppError } from '@/types';

class MarkdownService {
    private static instance: MarkdownService;

    private constructor() {
        this.configureMarked();
    }

    /**
     * 获取单例实例
     */
    static getInstance(): MarkdownService {
        if (!MarkdownService.instance) {
            MarkdownService.instance = new MarkdownService();
        }
        return MarkdownService.instance;
    }

    /**
     * 配置marked选项
     */
    private configureMarked(): void {
        marked.setOptions({
            gfm: true,                    // 启用GitHub风格的Markdown
            breaks: true,                 // 支持换行符转换为<br>
            pedantic: false,
        });

        // 配置代码高亮渲染器
        const renderer = new marked.Renderer();
        renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    const highlighted = hljs.highlight(text, { language: lang }).value;
                    return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
                } catch (error) {
                    console.error('Highlight error:', error);
                }
            }
            return `<pre><code>${text}</code></pre>`;
        };

        marked.setOptions({ renderer });
    }

    /**
     * 解析Markdown为HTML
     */
    parse(markdown: string): string {
        try {
            if (!markdown || markdown.trim() === '') {
                return '';
            }
            return marked.parse(markdown) as string;
        } catch (error) {
            console.error('Failed to parse markdown:', error);
            throw createAppError(
                ErrorType.PARSE_ERROR,
                'Markdown解析失败',
                error
            );
        }
    }

    /**
     * 解析Markdown为纯文本（移除所有标记）
     */
    parseToPlainText(markdown: string): string {
        try {
            if (!markdown || markdown.trim() === '') {
                return '';
            }

            // 移除Markdown标记
            let text = markdown
                // 移除标题标记
                .replace(/^#{1,6}\s+/gm, '')
                // 移除粗体和斜体
                .replace(/(\*\*|__)(.*?)\1/g, '$2')
                .replace(/(\*|_)(.*?)\1/g, '$2')
                // 移除链接，保留文本
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                // 移除图片
                .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
                // 移除代码块
                .replace(/```[\s\S]*?```/g, '')
                .replace(/`([^`]+)`/g, '$1')
                // 移除引用标记
                .replace(/^>\s+/gm, '')
                // 移除列表标记
                .replace(/^[\*\-\+]\s+/gm, '')
                .replace(/^\d+\.\s+/gm, '')
                // 移除水平线
                .replace(/^[\*\-_]{3,}$/gm, '')
                // 移除多余空行
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            return text;
        } catch (error) {
            console.error('Failed to parse markdown to plain text:', error);
            return markdown;
        }
    }

    /**
     * 提取Markdown中的所有图片URL
     */
    extractImages(markdown: string): string[] {
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        const images: string[] = [];
        let match;

        while ((match = imageRegex.exec(markdown)) !== null) {
            images.push(match[2]);
        }

        return images;
    }

    /**
     * 提取Markdown中的所有链接
     */
    extractLinks(markdown: string): Array<{ text: string; url: string }> {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const links: Array<{ text: string; url: string }> = [];
        let match;

        while ((match = linkRegex.exec(markdown)) !== null) {
            links.push({
                text: match[1],
                url: match[2],
            });
        }

        return links;
    }

    /**
     * 截断Markdown文本到指定长度
     */
    truncate(markdown: string, maxLength: number): string {
        const plainText = this.parseToPlainText(markdown);

        if (plainText.length <= maxLength) {
            return markdown;
        }

        return plainText.substring(0, maxLength) + '...';
    }

    /**
     * 验证Markdown语法
     */
    validate(markdown: string): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        try {
            // 尝试解析
            marked.parse(markdown);

            // 检查常见问题
            // 1. 未闭合的代码块
            const codeBlockCount = (markdown.match(/```/g) || []).length;
            if (codeBlockCount % 2 !== 0) {
                errors.push('存在未闭合的代码块');
            }

            // 2. 未闭合的链接
            const openBrackets = (markdown.match(/\[/g) || []).length;
            const closeBrackets = (markdown.match(/\]/g) || []).length;
            if (openBrackets !== closeBrackets) {
                errors.push('存在未闭合的方括号');
            }

            return {
                valid: errors.length === 0,
                errors,
            };
        } catch (error) {
            errors.push('Markdown语法错误');
            return {
                valid: false,
                errors,
            };
        }
    }
}

export default MarkdownService.getInstance();
