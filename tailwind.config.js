/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // 颜色系统 - 基于设计令牌
            colors: {
                // Primary Colors
                primary: {
                    DEFAULT: '#0033FF',
                    hover: '#0028CC',
                    light: '#E6ECFF',
                    dark: '#001A80',
                },
                // Neutral Colors
                gray: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#EEEEEE',
                    300: '#E0E0E0',
                    400: '#BDBDBD',
                    500: '#9E9E9E',
                    600: '#757575',
                    700: '#616161',
                    800: '#424242',
                    900: '#212121',
                },
                // Text Colors
                text: {
                    primary: '#333333',
                    secondary: '#666666',
                    tertiary: '#999999',
                    disabled: '#BDBDBD',
                    inverse: '#FFFFFF',
                },
                // Semantic Colors
                success: '#4CAF50',
                'success-light': '#E8F5E9',
                error: '#F44336',
                'error-light': '#FFEBEE',
                warning: '#FF9800',
                'warning-light': '#FFF3E0',
                info: '#2196F3',
                'info-light': '#E3F2FD',
                // Background Colors
                background: {
                    primary: '#FFFFFF',
                    secondary: '#FAFAFA',
                    tertiary: '#F5F5F5',
                    elevated: '#FFFFFF',
                },
                // Legacy colors for backward compatibility
                secondary: '#666666',
                tertiary: '#999999',
                divider: '#E0E0E0',
            },

            // 字体族
            fontFamily: {
                sans: ['Inter', 'Helvetica Neue', 'Arial', 'PingFang SC', 'HarmonyOS Sans', 'sans-serif'],
                mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
            },

            // 字体大小
            fontSize: {
                xs: ['12px', { lineHeight: '1.5' }],
                sm: ['14px', { lineHeight: '1.5' }],
                base: ['16px', { lineHeight: '1.5' }],
                lg: ['18px', { lineHeight: '1.5' }],
                xl: ['20px', { lineHeight: '1.5' }],
                '2xl': ['24px', { lineHeight: '1.4' }],
                '3xl': ['30px', { lineHeight: '1.3' }],
                '4xl': ['36px', { lineHeight: '1.2' }],
                '5xl': ['48px', { lineHeight: '1.2' }],
                '6xl': ['60px', { lineHeight: '1.1' }],
                // Legacy sizes for backward compatibility
                'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
                'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
                'h3': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
                'card-title': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
                'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
                'secondary': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
                'small': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
            },

            // 字体粗细
            fontWeight: {
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
            },

            // 间距系统 - 基于 4px
            spacing: {
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
                // Legacy spacing for backward compatibility
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                'xxl': '48px',
            },

            // 圆角系统
            borderRadius: {
                none: '0',
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '20px',
                '2xl': '24px',
                full: '9999px',
                // Legacy radius for backward compatibility
                'small': '4px',
                'medium': '6px',
                'card': '8px',
                'large': '12px',
            },

            // 阴影系统
            boxShadow: {
                none: 'none',
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                card: '0 2px 8px rgba(0, 0, 0, 0.08)',
                cardHover: '0 4px 12px rgba(0, 0, 0, 0.12)',
                // Legacy shadows for backward compatibility
                'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)',
                'modal': '0 8px 32px rgba(0, 0, 0, 0.2)',
            },

            // 动画时长
            transitionDuration: {
                fast: '100ms',
                base: '200ms',
                slow: '300ms',
                slower: '500ms',
                // Legacy durations for backward compatibility
                'normal': '300ms',
            },

            // 缓动函数
            transitionTimingFunction: {
                linear: 'linear',
                ease: 'ease',
                'ease-in': 'ease-in',
                'ease-out': 'ease-out',
                'ease-in-out': 'ease-in-out',
            },

            // 动画
            animation: {
                'fadeIn': 'fadeIn 200ms ease-out',
                'fadeOut': 'fadeOut 200ms ease-in',
                'slideInRight': 'slideInRight 300ms ease-out',
                'slideOutRight': 'slideOutRight 300ms ease-in',
                'slideInLeft': 'slideInLeft 300ms ease-out',
                'scaleIn': 'scaleIn 200ms ease-out',
                'scaleOut': 'scaleOut 200ms ease-in',
                'spin': 'spin 1s linear infinite',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce': 'bounce 1s ease-in-out infinite',
            },

            // 关键帧
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideOutRight: {
                    '0%': { transform: 'translateX(0)', opacity: '1' },
                    '100%': { transform: 'translateX(100%)', opacity: '0' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                scaleOut: {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '100%': { transform: 'scale(0.95)', opacity: '0' },
                },
                spin: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                pulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                bounce: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
