// 轻量会话 token(用户端 + 后台通用),HMAC 签名
import crypto from 'node:crypto'

const b64u = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const b64uDecode = (str) => Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64')

function sign(data, secret) {
  return b64u(crypto.createHmac('sha256', secret).update(data).digest())
}

export function issueToken(payloadObj, secret, ttlMs = 30 * 24 * 3600 * 1000) {
  const payload = b64u(JSON.stringify({ ...payloadObj, exp: Date.now() + ttlMs }))
  return `${payload}.${sign(payload, secret)}`
}

export function verifyToken(token, secret) {
  if (!token) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  if (sign(payload, secret) !== sig) return null
  try {
    const data = JSON.parse(b64uDecode(payload).toString('utf8'))
    if (!data.exp || data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}
