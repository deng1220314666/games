import crypto from 'node:crypto'
import { Router } from 'express'
import { ECONOMY } from '../config.js'
import { requireAuth } from '../middleware/auth.js'
import { spend } from '../lib/reward.js'
import { addWithdrawal, updateWithdrawal, getWithdrawals } from '../lib/store.js'
import { payout, payoutEnabled, getBalance } from '../lib/ton.js'

export const walletRouter = Router()
walletRouter.use(requireAuth)

// POST /wallet/withdraw  { amountTon, address }
walletRouter.post('/withdraw', async (req, res) => {
  const user = req.user
  const amountTon = Number(req.body?.amountTon)
  const address = String(req.body?.address || '')

  if (!address) return res.status(400).json({ error: 'no_address' })
  if (!amountTon || amountTon < ECONOMY.minWithdrawTon) {
    return res.status(400).json({ error: 'below_min' })
  }
  const needCoins = Math.ceil(amountTon * ECONOMY.coinPerTon)
  if (user.balance < needCoins) return res.status(400).json({ error: 'insufficient' })

  // 先扣币(账本权威),再打款
  spend(user, needCoins)

  const record = {
    id: crypto.randomUUID(),
    userId: user.id,
    amountTon,
    address,
    fee: ECONOMY.withdrawFeeTon,
    status: 'pending',
    time: Date.now(),
  }
  addWithdrawal(record)

  // 打款(未配置热钱包时保持 pending,人工/定时任务处理)
  try {
    const pay = await payout({ toAddress: address, amountTon: amountTon - ECONOMY.withdrawFeeTon })
    if (pay.status === 'done') {
      updateWithdrawal(record.id, { status: 'done', txHash: pay.txHash })
      record.status = 'done'
    }
  } catch (e) {
    // 打款失败保持 pending,不回滚扣币(避免重复打款),由后台核对
    console.error('[wallet] payout error', e.message)
  }

  res.json({ id: record.id, status: record.status, balance: user.balance, autoPayout: payoutEnabled() })
})

// GET /wallet/records
walletRouter.get('/records', (req, res) => {
  res.json({ records: getWithdrawals(req.user.id) })
})

// GET /wallet/balance?address=...
walletRouter.get('/balance', async (req, res) => {
  const address = String(req.query.address || '')
  const tonBalance = address ? await getBalance(address) : 0
  res.json({ tonBalance })
})
