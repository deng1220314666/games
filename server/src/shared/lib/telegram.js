// 校验 Telegram Mini App initData
import crypto from 'node:crypto'
import { env } from '../env.js'

export function validateInitData(initData) {
  if (!env.telegramBotToken) {
    const params = new URLSearchParams(initData || '')
    return { valid: false, dev: true, user: safeParse(params.get('user')), startParam: params.get('start_param') }
  }
  if (!initData) return { valid: false }
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return { valid: false }
  params.delete('hash')
  const dataCheckString = [...params.entries()].map(([k, v]) => `${k}=${v}`).sort().join('\n')
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(env.telegramBotToken).digest()
  const calcHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
  if (calcHash !== hash) return { valid: false }
  const authDate = Number(params.get('auth_date') || 0)
  if (authDate && Date.now() / 1000 - authDate > 86400) return { valid: false, expired: true }
  return { valid: true, user: safeParse(params.get('user')), startParam: params.get('start_param') || null }
}

function safeParse(s) {
  try {
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}
