import { defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
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
    emptyOutDir: true, // 构建前自动清空输出目录
  },
  // 开发环境使用默认路径，生产环境使用 CDN
  base: command === 'serve' ? '/' : 'https://static-small.vincentqiao.com/aibaiban/static/',
}))
