// ===== HTTP 客户端 =====
// 接后端时业务只改 services/* 里的 mock 分支,页面无感。
import axios from 'axios'
import { API_BASE_URL, USE_MOCK } from '@/config/index.js'

export const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

// 注入鉴权头(Telegram initData / 会话 token)
client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('auth_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

client.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
)

// 便捷:mock 模式下模拟网络延迟
export const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

export { USE_MOCK }
