import { Router } from 'express'
import { env } from '../../shared/env.js'
import { one } from '../../shared/db.js'
import { verifyPassword } from '../../shared/hash.js'
import { issueToken } from '../../shared/lib/token.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body || {}
  const row = await one('SELECT username, password_hash FROM admins WHERE username=$1', [username])
  if (!row || !verifyPassword(password, row.password_hash)) {
    return res.status(401).json({ error: 'bad_credentials' })
  }
  const token = issueToken({ admin: row.username }, env.adminSecret, 12 * 3600 * 1000)
  res.json({ token, username: row.username })
})
