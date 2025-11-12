/**
 * 占位图工具函数
 * 生成SVG格式的占位图，不依赖外部服务
 */

export interface PlaceholderOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
    textColor?: string;
    text?: string;
    fontSize?: number;
}

/**
 * 生成SVG占位图的Data URL
 */
export function generatePlaceholder(options: PlaceholderOptions = {}): string {
    const {
        width = 320,
        height = 180,
        backgroundColor = '#0047AB',
        textColor = '#FFFFFF',
        text = 'Image',
        fontSize = 24,
    } = options;

    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
            <text
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
                font-family="Arial, sans-serif"
                font-size="${fontSize}"
                font-weight="600"
                fill="${textColor}"
            >${text}</text>
        </svg>
    `;

    // 将SVG转换为Data URL
    const encoded = encodeURIComponent(svg)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');

    return `data:image/svg+xml,${encoded}`;
}

/**
 * 根据资源类型生成占位图
 */
export function getPlaceholderByType(type: string, title?: string): string {
    const colorMap: Record<string, string> = {
        youtube_video: '#FF0000',
        bilibili_video: '#00A1D6',
        blog: '#2E7D32',
        github: '#24292E',
        reddit: '#FF4500',
        tool: '#607D8B',
    };

    const textMap: Record<string, string> = {
        youtube_video: 'YouTube',
        bilibili_video: 'Bilibili',
        blog: 'Blog',
        github: 'GitHub',
        reddit: 'Reddit',
        tool: 'Tool',
    };

    return generatePlaceholder({
        backgroundColor: colorMap[type] || '#0047AB',
        text: title || textMap[type] || 'Resource',
    });
}

/**
 * 预定义的颜色方案
 */
export const PLACEHOLDER_COLORS = {
    blue: '#0047AB',
    green: '#2E7D32',
    orange: '#E65100',
    purple: '#9C27B0',
    red: '#FF5722',
    cyan: '#00BCD4',
    teal: '#4CAF50',
    grey: '#607D8B',
    youtube: '#FF0000',
    bilibili: '#00A1D6',
    github: '#24292E',
};
