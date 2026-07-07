import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // 开发时把 /api 代理到本地 admin 服务(3002)
      '/api': 'http://localhost:3002',
    },
  },
})
