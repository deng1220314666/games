import { verifyToken } from '../../shared/lib/token.js'
import { env } from '../../shared/env.js'

export function requireAdmin(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  const data = verifyToken(token, env.adminSecret)
  if (!data?.admin) return res.status(401).json({ error: 'unauthorized' })
  req.admin = data.admin
  next()
}
