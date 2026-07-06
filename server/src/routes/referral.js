import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getReferrals } from '../lib/store.js'

export const referralRouter = Router()
referralRouter.use(requireAuth)

// GET /referral/list
referralRouter.get('/list', (req, res) => {
  res.json({
    inviteCode: req.user.inviteCode,
    referrals: getReferrals(req.user.id),
    totalEarned: req.user.referralEarned || 0,
  })
})

// 绑定上级在 /auth/login 时用启动参数完成,这里留一个显式端点备用
// POST /referral/bind  { code }  —— 仅未绑定时生效(见 auth.js bindReferrer)
