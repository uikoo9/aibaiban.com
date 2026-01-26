import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    // 生产环境启用包分析器
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
  },

  build: {
    outDir: '../shun-js/packages/aibaiban-server/static',
    assetsDir: '.',
    emptyOutDir: true,

    // 优化配置
    target: 'es2015', // 支持更多优化
    minify: 'terser', // 使用 terser 获得更好的压缩
    terserOptions: {
      compress: {
        drop_console: command !== 'serve', // 生产环境移除 console
        drop_debugger: true,
      },
    },

    // 代码分割配置
    rollupOptions: {
      output: {
        // 手动分割 chunks
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Ant Design 基础组件
          'antd-base': ['antd'],

          // Ant Design X（AI 组件）
          'antd-x': ['@ant-design/x'],

          // Ant Design Icons
          'antd-icons': ['@ant-design/icons'],

          // Excalidraw 核心（最大的依赖）
          'excalidraw': ['@excalidraw/excalidraw'],
        },

        // 根据模块 ID 自动分组
        chunkFileNames: (chunkInfo) => {
          // Mermaid 图表库独立打包
          if (chunkInfo.name.includes('mermaid') ||
              chunkInfo.name.includes('diagram') ||
              chunkInfo.name.includes('flowchart') ||
              chunkInfo.name.includes('mindmap')) {
            return 'charts/[name]-[hash].js'
          }

          // 语言包独立打包
          if (chunkInfo.name.match(/^[a-z]{2}-[A-Z]{2}/)) {
            return 'locales/[name]-[hash].js'
          }

          return 'chunks/[name]-[hash].js'
        },

        // 入口文件命名
        entryFileNames: '[name]-[hash].js',

        // 资源文件命名
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles/[name]-[hash][extname]'
          }
          if (assetInfo.name?.match(/\.(woff2?|ttf|otf|eot)$/)) {
            return 'fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },

      // 外部依赖（可选：将大型库通过 CDN 加载）
      // external: ['@excalidraw/excalidraw'], // 取消注释以外部化
    },

    // 增大 chunk 警告限制（因为 Excalidraw 确实很大）
    chunkSizeWarningLimit: 1000, // 1000KB
  },

  // 开发环境使用默认路径，生产环境使用 CDN
  base: command === 'serve' ? '/' : 'https://static-small.vincentqiao.com/aibaiban/static/',
}))
