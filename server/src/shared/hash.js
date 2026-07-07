// 密码哈希(scrypt,无第三方依赖)
import crypto from 'node:crypto'

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const dk = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return `${salt}:${dk}`
}

export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false
  const [salt, dk] = stored.split(':')
  const calc = crypto.scryptSync(String(password), salt, 64).toString('hex')
  const a = Buffer.from(calc, 'hex')
  const b = Buffer.from(dk, 'hex')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
