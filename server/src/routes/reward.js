import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { earn } from '../lib/reward.js'
import { getLedger } from '../lib/store.js'

export const rewardRouter = Router()
rewardRouter.use(requireAuth)

// POST /reward/earn  { source, amount, idempotencyKey, meta }
rewardRouter.post('/earn', (req, res) => {
  const { source, amount, idempotencyKey, meta } = req.body || {}
  const allowed = ['watch_ad', 'play_game']
  if (!allowed.includes(source)) {
    // 签到走 /task/checkin,邀请由系统发放,禁止客户端任意 source
    return res.status(400).json({ error: 'invalid_source' })
  }
  const result = earn(req.user, source, amount, { idempotencyKey, meta })
  if (!result.ok) return res.status(409).json({ error: result.reason, balance: result.balance })
  res.json({ balance: result.balance, amount: result.amount })
})

// GET /reward/history
rewardRouter.get('/history', (req, res) => {
  res.json({ history: getLedger(req.user.id, 50) })
})
