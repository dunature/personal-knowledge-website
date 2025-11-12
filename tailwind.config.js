/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // 颜色系统
            colors: {
                primary: {
                    DEFAULT: '#0047AB',
                    hover: '#003580',
                    light: '#E3F2FD',
                },
                secondary: '#666',
                tertiary: '#999',
                text: {
                    DEFAULT: '#333',
                    light: '#555',
                },
                background: {
                    DEFAULT: '#FFFFFF',
                    secondary: '#F5F5F5',
                    hover: '#EEEEEE',
                },
                divider: '#E0E0E0',
                success: '#2E7D32',
                error: '#D32F2F',
                warning: '#F57C00',
            },

            // 字体大小
            fontSize: {
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
                'bold': '700',
                'semibold': '600',
                'normal': '400',
            },

            // 间距系统
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                'xxl': '48px',
            },

            // 圆角
            borderRadius: {
                'small': '4px',
                'medium': '6px',
                'card': '8px',
                'large': '12px',
            },

            // 阴影
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
                'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)',
                'modal': '0 8px 32px rgba(0, 0, 0, 0.2)',
            },

            // 动画时长
            transitionDuration: {
                'fast': '200ms',
                'normal': '300ms',
                'slow': '500ms',
            },

            // 缓动函数
            transitionTimingFunction: {
                'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
                'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
                'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },

            // 动画
            animation: {
                'fadeIn': 'fadeIn 0.3s ease-out',
                'fadeOut': 'fadeOut 0.3s ease-in',
                'slideInRight': 'slideInRight 0.3s ease-out',
                'slideOutRight': 'slideOutRight 0.3s ease-in',
                'slideInLeft': 'slideInLeft 0.3s ease-out',
                'scaleIn': 'scaleIn 0.3s ease-out',
                'scaleOut': 'scaleOut 0.3s ease-in',
                'spin': 'spin 1s linear infinite',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce': 'bounce 1s ease-in-out infinite',
            },

            // 关键帧
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeOut: {
                    '0%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(-10px)' },
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
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                scaleOut: {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '100%': { transform: 'scale(0.9)', opacity: '0' },
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
