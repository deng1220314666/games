import axios from 'axios'

const TOKEN_KEY = 'tt_admin_token'
export const auth = {
  get token() {
    return localStorage.getItem(TOKEN_KEY) || ''
  },
  set(t) {
    localStorage.setItem(TOKEN_KEY, t)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
  },
}

export const http = axios.create({ baseURL: '/api' })

http.interceptors.request.use((cfg) => {
  const t = auth.token
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

http.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err?.response?.status === 401) {
      auth.clear()
      if (location.pathname !== '/login') location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export function apiError(e) {
  return e?.response?.data?.error || e?.message || '请求失败'
}

// 带鉴权下载 CSV(后端返回 text/csv)
export async function downloadCsv(path, params, filename) {
  const blob = await http.get(path, { params, responseType: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
