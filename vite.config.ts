import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    // 生产构建优化
    target: 'es2015',
    minify: true,
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('marked') || id.includes('highlight.js')) {
              return 'markdown-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
          }
        },
      },
    },
    // 启用 gzip 压缩提示
    reportCompressedSize: true,
    // chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
  },
  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
    // 代理配置 - 解决 Bilibili API CORS 问题
    proxy: {
      '/api/bilibili': {
        target: 'https://api.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bilibili/, ''),
        headers: {
          'Referer': 'https://www.bilibili.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      },
      // Bilibili 图片代理 - 解决防盗链问题
      '/bilibili-img': {
        target: 'https://i0.hdslb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bilibili-img/, ''),
        headers: {
          'Referer': 'https://www.bilibili.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      },
      '/bilibili-img2': {
        target: 'https://i1.hdslb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bilibili-img2/, ''),
        headers: {
          'Referer': 'https://www.bilibili.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      },
      '/bilibili-img3': {
        target: 'https://i2.hdslb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bilibili-img3/, ''),
        headers: {
          'Referer': 'https://www.bilibili.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    }
  },
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true,
  },
})
