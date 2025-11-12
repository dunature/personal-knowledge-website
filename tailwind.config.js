/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0047AB',
                secondary: '#666',
                tertiary: '#999',
                text: '#333',
                background: '#FFFFFF',
                'background-secondary': '#F5F5F5',
                divider: '#E0E0E0',
            },
            fontSize: {
                'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
                'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
                'h3': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
                'card-title': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
                'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
                'secondary': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
                'small': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
            },
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                'xxl': '48px',
            },
            borderRadius: {
                'card': '8px',
                'button': '6px',
                'tag': '4px',
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
                'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)',
                'modal': '0 4px 16px rgba(0, 0, 0, 0.15)',
            },
            transitionDuration: {
                'fast': '200ms',
                'normal': '300ms',
                'slow': '500ms',
            },
        },
    },
    plugins: [],
}
