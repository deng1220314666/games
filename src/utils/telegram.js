// ===== Telegram WebApp 封装 =====
// 提供登录鉴权数据（initData）、用户信息、分享等。web 环境全部返回降级值。
import { platform } from './platform.js'

// 从 Telegram 取免密登录凭证。后端应校验 initData 的 hash。
export function getTelegramAuth() {
  const tg = platform.tg
  if (!tg) return null
  return {
    initData: tg.initData, // 交给后端校验的原始串
    user: tg.initDataUnsafe?.user || null, // 前端展示用，勿信任
    startParam: tg.initDataUnsafe?.start_param || null, // 邀请码常放这里
  }
}

// 统一取用户资料（TG 优先，web 用匿名）
export function getTelegramUser() {
  const auth = getTelegramAuth()
  if (auth?.user) {
    const u = auth.user
    return {
      id: String(u.id),
      name: [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username,
      username: u.username || '',
      avatar: u.photo_url || '',
      languageCode: u.language_code || 'en',
    }
  }
  return null
}

// 取启动参数（邀请码等）：TG 用 start_param，web 用 url query
export function getStartParam() {
  const auth = getTelegramAuth()
  if (auth?.startParam) return auth.startParam
  if (typeof window !== 'undefined') {
    const p = new URLSearchParams(window.location.search)
    return p.get('ref') || p.get('startapp') || p.get('start') || null
  }
  return null
}

// 分享邀请链接
export function shareInvite(link, text = '') {
  const tg = platform.tg
  if (tg && tg.openTelegramLink) {
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`
    tg.openTelegramLink(url)
    return true
  }
  // web 回退：系统分享 / 复制
  if (navigator.share) {
    navigator.share({ text, url: link }).catch(() => {})
    return true
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).catch(() => {})
  }
  return false
}
