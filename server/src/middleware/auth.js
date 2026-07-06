import { verifyToken } from '../lib/token.js'
import { getUser } from '../lib/store.js'

// 需要登录的路由用这个中间件;把 user 挂到 req.user
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const uid = verifyToken(token)
  if (!uid) return res.status(401).json({ error: 'unauthorized' })
  const user = getUser(uid)
  if (!user) return res.status(401).json({ error: 'user_not_found' })
  req.user = user
  next()
}
