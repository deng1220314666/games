import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { earn, ledgerOf } from '../../shared/models/reward.js'

export const rewardRouter = Router()
rewardRouter.use(requireAuth)

rewardRouter.post('/earn', async (req, res) => {
  const { source, amount, idempotencyKey, meta } = req.body || {}
  if (!['watch_ad', 'play_game'].includes(source)) {
    return res.status(400).json({ error: 'invalid_source' })
  }
  const r = await earn(req.user.id, source, amount, { idempotencyKey, meta })
  if (!r.ok) return res.status(409).json({ error: r.reason, balance: r.balance })
  res.json({ balance: r.balance, amount: r.amount })
})

rewardRouter.get('/history', async (req, res) => {
  res.json({ history: await ledgerOf(req.user.id, 50) })
})
