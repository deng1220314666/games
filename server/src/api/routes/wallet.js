import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requestWithdraw, userWithdrawals } from '../../shared/models/withdrawals.js'

export const walletRouter = Router()
walletRouter.use(requireAuth)

walletRouter.post('/withdraw', async (req, res) => {
  const r = await requestWithdraw(req.user.id, req.body?.amountTon, req.body?.address)
  if (!r.ok) return res.status(400).json({ error: r.reason })
  res.json({ id: r.record.id, status: r.record.status, balance: r.balance })
})

walletRouter.get('/records', async (req, res) => {
  res.json({ records: await userWithdrawals(req.user.id) })
})

walletRouter.get('/balance', async (req, res) => {
  res.json({ tonBalance: 0 })
})
