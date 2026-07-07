// 后台管理接口:settings / tasks / games / withdrawals / stats
import { Router } from 'express'
import { requireAdmin } from '../middleware/adminAuth.js'
import { getSettings, setSettings } from '../../shared/models/config.js'
import { listTasks, upsertTask, deleteTask } from '../../shared/models/tasks.js'
import { listGames, upsertGame, deleteGame } from '../../shared/models/games.js'
import { listWithdrawals, reviewWithdrawal } from '../../shared/models/withdrawals.js'
import { one, many } from '../../shared/db.js'

export const manageRouter = Router()
manageRouter.use(requireAdmin)

// ---- settings ----
manageRouter.get('/settings', async (req, res) => res.json(await getSettings()))
manageRouter.put('/settings', async (req, res) => res.json(await setSettings(req.body || {})))

// ---- tasks ----
manageRouter.get('/tasks', async (req, res) => res.json(await listTasks()))
manageRouter.put('/tasks/:id', async (req, res) => {
  await upsertTask({ ...req.body, id: req.params.id })
  res.json({ ok: true })
})
manageRouter.post('/tasks', async (req, res) => {
  if (!req.body?.id) return res.status(400).json({ error: 'id_required' })
  await upsertTask(req.body)
  res.json({ ok: true })
})
manageRouter.delete('/tasks/:id', async (req, res) => {
  await deleteTask(req.params.id)
  res.json({ ok: true })
})

// ---- games ----
manageRouter.get('/games', async (req, res) => res.json(await listGames()))
manageRouter.put('/games/:id', async (req, res) => {
  await upsertGame({ ...req.body, id: req.params.id })
  res.json({ ok: true })
})
manageRouter.post('/games', async (req, res) => {
  if (!req.body?.id) return res.status(400).json({ error: 'id_required' })
  await upsertGame(req.body)
  res.json({ ok: true })
})
manageRouter.delete('/games/:id', async (req, res) => {
  await deleteGame(req.params.id)
  res.json({ ok: true })
})

// ---- withdrawals ----
manageRouter.get('/withdrawals', async (req, res) => {
  res.json(await listWithdrawals({ status: req.query.status || undefined }))
})
manageRouter.post('/withdrawals/:id/review', async (req, res) => {
  const { action, note, txHash } = req.body || {}
  const r = await reviewWithdrawal(req.params.id, action, note, txHash)
  if (!r.ok) return res.status(400).json({ error: r.reason })
  res.json({ ok: true })
})

// ---- users ----
manageRouter.get('/users', async (req, res) => {
  const q = (req.query.q || '').trim()
  const pageSize = Math.min(Number(req.query.pageSize) || 20, 100)
  const page = Math.max(Number(req.query.page) || 1, 1)
  const offset = (page - 1) * pageSize
  let where = ''
  const params = []
  if (q) {
    where = 'WHERE id ILIKE $1 OR name ILIKE $1 OR invite_code ILIKE $1'
    params.push('%' + q + '%')
  }
  const total = (await one(`SELECT count(*)::int c FROM users ${where}`, params)).c
  const rows = await many(
    `SELECT id, platform, name, username, balance, streak, invite_code, referrer_id,
            referral_earned, created_at
     FROM users ${where} ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
    params
  )
  res.json({ data: rows.map((r) => ({ ...r, balance: Number(r.balance), referral_earned: Number(r.referral_earned) })), total })
})

manageRouter.get('/users/:id', async (req, res) => {
  const id = req.params.id
  const user = await one('SELECT * FROM users WHERE id=$1', [id])
  if (!user) return res.status(404).json({ error: 'not_found' })
  user.balance = Number(user.balance)
  user.referral_earned = Number(user.referral_earned)
  const ledger = await many(
    'SELECT source, amount, meta, created_at FROM ledger WHERE user_id=$1 ORDER BY created_at DESC LIMIT 200',
    [id]
  )
  const withdrawals = await many(
    'SELECT id, amount_ton, coins, address, status, tx_hash, created_at, reviewed_at FROM withdrawals WHERE user_id=$1 ORDER BY created_at DESC',
    [id]
  )
  const earned = (await one("SELECT COALESCE(sum(amount),0)::bigint c FROM ledger WHERE user_id=$1 AND amount>0", [id])).c
  const wd = await one(
    "SELECT COALESCE(sum(amount_ton),0) t, count(*)::int c FROM withdrawals WHERE user_id=$1 AND status='done'",
    [id]
  )
  const refCount = (await one('SELECT count(*)::int c FROM users WHERE referrer_id=$1', [id])).c
  res.json({
    user,
    ledger: ledger.map((l) => ({ ...l, amount: Number(l.amount) })),
    withdrawals: withdrawals.map((w) => ({ ...w, coins: Number(w.coins) })),
    summary: { earnedTotal: Number(earned), withdrawnTon: Number(wd.t), withdrawnCount: wd.c, referrals: refCount },
  })
})

// ---- overview ----
manageRouter.get('/overview', async (req, res) => {
  const users = await one('SELECT count(*)::int c FROM users')
  const pending = await one("SELECT count(*)::int c FROM withdrawals WHERE status='pending'")
  const coins = await one('SELECT COALESCE(sum(balance),0)::bigint c FROM users')
  const games = await one('SELECT count(*)::int c FROM games')
  res.json({
    users: users.c,
    pendingWithdrawals: pending.c,
    totalCoins: Number(coins.c),
    games: games.c,
  })
})
