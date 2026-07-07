import { verifyToken } from '../../shared/lib/token.js'
import { env } from '../../shared/env.js'
import { getUser } from '../../shared/models/users.js'

export async function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || ''
    const token = h.startsWith('Bearer ') ? h.slice(7) : ''
    const data = verifyToken(token, env.jwtSecret)
    if (!data?.uid) return res.status(401).json({ error: 'unauthorized' })
    const u = await getUser(data.uid)
    if (!u) return res.status(401).json({ error: 'user_not_found' })
    req.user = u
    next()
  } catch (e) {
    res.status(500).json({ error: 'auth_error' })
  }
}
