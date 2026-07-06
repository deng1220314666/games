import crypto from 'node:crypto'
import { Router } from 'express'
import { ECONOMY } from '../config.js'
import { validateInitData } from '../lib/telegram.js'
import { ensureUser, publicProfile } from '../lib/users.js'
import { findByInviteCode, saveUser, addLedger } from '../lib/store.js'
import { issueToken } from '../lib/token.js'

export const authRouter = Router()

// POST /auth/login  { platform, initData?, anonId?, ref? }
authRouter.post('/login', (req, res) => {
  const { platform, initData, anonId, ref } = req.body || {}
  let user
  let startParam = ref || null

  if (platform === 'telegram') {
    const result = validateInitData(initData)
    if (!result.valid && !result.dev) return res.status(401).json({ error: 'invalid_init_data' })
    const tg = result.user
    if (!tg) return res.status(400).json({ error: 'no_user' })
    startParam = result.startParam || startParam
    user = ensureUser(String(tg.id), {
      platform: 'telegram',
      name: [tg.first_name, tg.last_name].filter(Boolean).join(' ') || tg.username || 'User',
      username: tg.username || '',
      avatar: tg.photo_url || '',
      isAnonymous: false,
    })
  } else {
    if (!anonId) return res.status(400).json({ error: 'no_anon_id' })
    user = ensureUser(String(anonId), {
      platform: 'web',
      name: 'Guest ' + String(anonId).slice(-4),
      isAnonymous: true,
    })
  }

  // 首次登录绑定上级
  bindReferrer(user, startParam)

  const token = issueToken(user.id)
  res.json({ token, profile: publicProfile(user), inviteCode: user.inviteCode, balance: user.balance })
})

function bindReferrer(user, code) {
  if (!code || user.referrerId) return
  const ref = findByInviteCode(String(code).toUpperCase())
  if (!ref || ref.id === user.id) return
  user.referrerId = ref.id
  saveUser(user)
  // 好友注册,一次性奖励发给上级
  const bonus = ECONOMY.reward.inviteRegister
  ref.balance += bonus
  ref.referralEarned = (ref.referralEarned || 0) + bonus
  saveUser(ref)
  addLedger({
    id: crypto.randomUUID(),
    userId: ref.id,
    source: 'invite',
    amount: bonus,
    time: Date.now(),
    meta: { newUser: user.id },
  })
}
