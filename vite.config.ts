import { defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
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
  },
  base: 'https://static-small.vincentqiao.com/aibaiban/static/',
})
