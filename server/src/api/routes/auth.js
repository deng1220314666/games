import { Router } from 'express'
import { env } from '../../shared/env.js'
import { validateInitData } from '../../shared/lib/telegram.js'
import { ensureUser, publicProfile, bindReferrer } from '../../shared/models/users.js'
import { issueToken } from '../../shared/lib/token.js'
import { getTask } from '../../shared/models/tasks.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  try {
    const { platform, initData, anonId, ref } = req.body || {}
    let user
    let startParam = ref || null

    if (platform === 'telegram') {
      const r = validateInitData(initData)
      if (!r.valid && !r.dev) return res.status(401).json({ error: 'invalid_init_data' })
      const tg = r.user
      if (!tg) return res.status(400).json({ error: 'no_user' })
      startParam = r.startParam || startParam
      user = await ensureUser(String(tg.id), {
        platform: 'telegram',
        name: [tg.first_name, tg.last_name].filter(Boolean).join(' ') || tg.username || 'User',
        username: tg.username || '',
        avatar: tg.photo_url || '',
        isAnonymous: false,
      })
    } else {
      if (!anonId) return res.status(400).json({ error: 'no_anon_id' })
      user = await ensureUser(String(anonId), {
        platform: 'web',
        name: 'Guest ' + String(anonId).slice(-4),
        isAnonymous: true,
      })
    }

    if (user.banned) return res.status(403).json({ error: 'banned' })

    const inviteTask = await getTask('invite')
    await bindReferrer(user, startParam, inviteTask?.reward)

    const token = issueToken({ uid: user.id }, env.jwtSecret)
    res.json({
      token,
      profile: publicProfile(user),
      inviteCode: user.invite_code,
      balance: Number(user.balance),
    })
  } catch (e) {
    console.error('[login]', e)
    res.status(500).json({ error: 'login_error' })
  }
})
