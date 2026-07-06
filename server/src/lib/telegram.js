// 校验 Telegram Mini App 的 initData(防伪造登录)。
// 规范:https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
import crypto from 'node:crypto'
import { config } from '../config.js'

// 返回 { valid, user, startParam } —— valid 才可信任 user
export function validateInitData(initData) {
  if (!config.telegramBotToken) {
    // 未配置 bot token:开发环境放行,但明确标记不可信
    const params = new URLSearchParams(initData || '')
    const user = safeParse(params.get('user'))
    return { valid: false, dev: true, user, startParam: params.get('start_param') }
  }
  if (!initData) return { valid: false }

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return { valid: false }
  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n')

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(config.telegramBotToken)
    .digest()
  const calcHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  if (calcHash !== hash) return { valid: false }

  // auth_date 新鲜度校验(24h)
  const authDate = Number(params.get('auth_date') || 0)
  if (authDate && Date.now() / 1000 - authDate > 86400) return { valid: false, expired: true }

  return {
    valid: true,
    user: safeParse(params.get('user')),
    startParam: params.get('start_param') || null,
  }
}

function safeParse(s) {
  try {
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}
