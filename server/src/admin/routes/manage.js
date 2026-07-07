// 后台管理接口:settings / tasks / games / withdrawals / stats
import { Router } from 'express'
import { requireAdmin } from '../middleware/adminAuth.js'
import { getSettings, setSettings } from '../../shared/models/config.js'
import { listTasks, upsertTask, deleteTask } from '../../shared/models/tasks.js'
import { listGames, upsertGame, deleteGame } from '../../shared/models/games.js'
import { listWithdrawals, reviewWithdrawal } from '../../shared/models/withdrawals.js'
import { one } from '../../shared/db.js'

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
