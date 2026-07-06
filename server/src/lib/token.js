// 轻量会话 token:base64url(payload).hmac,无第三方依赖。
import crypto from 'node:crypto'
import { config } from '../config.js'

const b64u = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const b64uDecode = (str) => Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64')

function sign(data) {
  return b64u(crypto.createHmac('sha256', config.jwtSecret).update(data).digest())
}

// 签发 token(默认 30 天)
export function issueToken(userId, ttlMs = 30 * 24 * 3600 * 1000) {
  const payload = b64u(JSON.stringify({ uid: userId, exp: Date.now() + ttlMs }))
  return `${payload}.${sign(payload)}`
}

// 校验,返回 userId 或 null
export function verifyToken(token) {
  if (!token) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  if (sign(payload) !== sig) return null
  try {
    const data = JSON.parse(b64uDecode(payload).toString('utf8'))
    if (!data.exp || data.exp < Date.now()) return null
    return data.uid
  } catch {
    return null
  }
}
