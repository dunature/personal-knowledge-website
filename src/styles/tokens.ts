/**
 * Design Tokens
 * 设计系统的核心令牌定义
 * 包含色彩、字体、间距、圆角、阴影等设计规范
 */

// ============================================
// Color Palette - 色彩系统
// ============================================

export const colors = {
    // Primary Colors - 主色
    primary: {
        main: '#0033FF',
        hover: '#0028CC',
        light: '#E6ECFF',
        dark: '#001A80',
    },

    // Neutral Colors - 中性色
    neutral: {
        white: '#FFFFFF',
        gray50: '#FAFAFA',
        gray100: '#F5F5F5',
        gray200: '#EEEEEE',
        gray300: '#E0E0E0',
        gray400: '#BDBDBD',
        gray500: '#9E9E9E',
        gray600: '#757575',
        gray700: '#616161',
        gray800: '#424242',
        gray900: '#212121',
        black: '#000000',
    },

    // Text Colors - 文本色
    text: {
        primary: '#333333',
        secondary: '#666666',
        tertiary: '#999999',
        disabled: '#BDBDBD',
        inverse: '#FFFFFF',
    },

    // Semantic Colors - 语义色
    semantic: {
        success: '#4CAF50',
        successLight: '#E8F5E9',
        error: '#F44336',
        errorLight: '#FFEBEE',
        warning: '#FF9800',
        warningLight: '#FFF3E0',
        info: '#2196F3',
        infoLight: '#E3F2FD',
    },

    // Background Colors - 背景色
    background: {
        primary: '#FFFFFF',
        secondary: '#FAFAFA',
        tertiary: '#F5F5F5',
        elevated: '#FFFFFF',
    },
} as const;

// ============================================
// Typography System - 字体系统
// ============================================

export const typography = {
    // Font Families - 字体族
    fontFamily: {
        sans: 'Inter, "Helvetica Neue", Arial, "PingFang SC", "HarmonyOS Sans", sans-serif',
        mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    },

    // Font Sizes - 字号
    fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
        '6xl': '60px',
    },

    // Font Weights - 字重
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    // Line Heights - 行高
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },
} as const;

// ============================================
// Spacing System - 间距系统
// ============================================

export const spacing = {
    // Base unit: 4px
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
} as const;

// ============================================
// Border Radius System - 圆角系统
// ============================================

export const borderRadius = {
    none: '0',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
} as const;

// ============================================
// Shadow System - 阴影系统
// ============================================

export const shadows = {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    cardHover: '0 4px 12px rgba(0, 0, 0, 0.12)',
} as const;

// ============================================
// Breakpoints - 响应式断点
// ============================================

export const breakpoints = {
    sm: '640px',   // Mobile
    md: '768px',   // Tablet
    lg: '1024px',  // Desktop
    xl: '1280px',  // Large Desktop
    '2xl': '1536px', // Extra Large
} as const;

// ============================================
// Transitions - 过渡动画
// ============================================

export const transitions = {
    fast: '100ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
} as const;

export const easings = {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
} as const;

// ============================================
// Type Definitions - 类型定义
// ============================================

export type ColorPalette = typeof colors;
export type TypographySystem = typeof typography;
export type SpacingSystem = typeof spacing;
export type BorderRadiusSystem = typeof borderRadius;
export type ShadowSystem = typeof shadows;
export type BreakpointSystem = typeof breakpoints;
export type TransitionSystem = typeof transitions;
export type EasingSystem = typeof easings;

// ============================================
// Design Tokens Export - 设计令牌导出
// ============================================

export const designTokens = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    breakpoints,
    transitions,
    easings,
} as const;

export default designTokens;
