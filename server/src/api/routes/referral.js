import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { many } from '../../shared/db.js'

export const referralRouter = Router()
referralRouter.use(requireAuth)

referralRouter.get('/list', async (req, res) => {
  const refs = await many(
    'SELECT id, name, created_at FROM users WHERE referrer_id=$1 ORDER BY created_at DESC LIMIT 200',
    [req.user.id]
  )
  res.json({
    inviteCode: req.user.invite_code,
    referrals: refs.map((r) => ({ id: r.id, name: r.name, time: r.created_at, earned: 0 })),
    totalEarned: Number(req.user.referral_earned || 0),
  })
})
