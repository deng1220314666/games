// 后台管理接口:settings / tasks / games / users / withdrawals / audit / account
import { Router } from 'express'
import { requireAdmin } from '../middleware/adminAuth.js'
import { getSettings, setSettings } from '../../shared/models/config.js'
import { listTasks, upsertTask, deleteTask } from '../../shared/models/tasks.js'
import { listGames, upsertGame, deleteGame } from '../../shared/models/games.js'
import { listWithdrawals, reviewWithdrawal } from '../../shared/models/withdrawals.js'
import { adjustBalance, setBan } from '../../shared/models/users.js'
import { ledgerFiltered } from '../../shared/models/reward.js'
import { logAudit, listAudit } from '../../shared/models/audit.js'
import { verifyPassword, hashPassword } from '../../shared/hash.js'
import { one, many, query } from '../../shared/db.js'

export const manageRouter = Router()
manageRouter.use(requireAdmin)

function csv(rows, headers) {
  const esc = (v) => {
    v = v == null ? '' : String(v)
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v
  }
  const lines = [headers.map((h) => h.label).join(',')]
  for (const r of rows) lines.push(headers.map((h) => esc(r[h.key])).join(','))
  return '﻿' + lines.join('\n') // BOM 便于 Excel 打开
}

// ---- settings ----
manageRouter.get('/settings', async (req, res) => res.json(await getSettings()))
manageRouter.put('/settings', async (req, res) => {
  const v = await setSettings(req.body || {})
  await logAudit(req.admin, 'update_settings', 'settings', req.body)
  res.json(v)
})

// ---- tasks ----
manageRouter.get('/tasks', async (req, res) => res.json(await listTasks()))
manageRouter.put('/tasks/:id', async (req, res) => {
  await upsertTask({ ...req.body, id: req.params.id })
  await logAudit(req.admin, 'update_task', req.params.id, req.body)
  res.json({ ok: true })
})
manageRouter.post('/tasks', async (req, res) => {
  if (!req.body?.id) return res.status(400).json({ error: 'id_required' })
  await upsertTask(req.body)
  await logAudit(req.admin, 'create_task', req.body.id, req.body)
  res.json({ ok: true })
})
manageRouter.delete('/tasks/:id', async (req, res) => {
  await deleteTask(req.params.id)
  await logAudit(req.admin, 'delete_task', req.params.id)
  res.json({ ok: true })
})

// ---- games ----
manageRouter.get('/games', async (req, res) => res.json(await listGames()))
manageRouter.put('/games/:id', async (req, res) => {
  await upsertGame({ ...req.body, id: req.params.id })
  await logAudit(req.admin, 'update_game', req.params.id, { name: req.body?.name })
  res.json({ ok: true })
})
manageRouter.post('/games', async (req, res) => {
  if (!req.body?.id) return res.status(400).json({ error: 'id_required' })
  await upsertGame(req.body)
  await logAudit(req.admin, 'create_game', req.body.id, { name: req.body?.name })
  res.json({ ok: true })
})
manageRouter.delete('/games/:id', async (req, res) => {
  await deleteGame(req.params.id)
  await logAudit(req.admin, 'delete_game', req.params.id)
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
            referral_earned, banned, created_at
     FROM users ${where} ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
    params
  )
  res.json({ data: rows.map((r) => ({ ...r, balance: Number(r.balance), referral_earned: Number(r.referral_earned) })), total })
})

manageRouter.get('/users/export', async (req, res) => {
  const q = (req.query.q || '').trim()
  let where = ''
  const params = []
  if (q) {
    where = 'WHERE id ILIKE $1 OR name ILIKE $1 OR invite_code ILIKE $1'
    params.push('%' + q + '%')
  }
  const rows = await many(
    `SELECT id, platform, name, username, balance, streak, invite_code, referrer_id,
            referral_earned, banned, created_at
     FROM users ${where} ORDER BY created_at DESC LIMIT 100000`,
    params
  )
  await logAudit(req.admin, 'export_users', null, { q, count: rows.length })
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.send(csv(rows, [
    { key: 'id', label: 'ID' }, { key: 'platform', label: '平台' }, { key: 'name', label: '昵称' },
    { key: 'username', label: '用户名' }, { key: 'balance', label: '积分余额' }, { key: 'streak', label: '连签' },
    { key: 'invite_code', label: '邀请码' }, { key: 'referrer_id', label: '上级ID' }, { key: 'referral_earned', label: '返佣累计' },
    { key: 'banned', label: '封号' }, { key: 'created_at', label: '注册时间' },
  ]))
})

manageRouter.get('/users/:id', async (req, res) => {
  const id = req.params.id
  const user = await one('SELECT * FROM users WHERE id=$1', [id])
  if (!user) return res.status(404).json({ error: 'not_found' })
  user.balance = Number(user.balance)
  user.referral_earned = Number(user.referral_earned)
  const ledger = await many('SELECT source, amount, meta, created_at FROM ledger WHERE user_id=$1 ORDER BY created_at DESC LIMIT 200', [id])
  const withdrawals = await many('SELECT id, amount_ton, coins, address, status, tx_hash, created_at, reviewed_at FROM withdrawals WHERE user_id=$1 ORDER BY created_at DESC', [id])
  const earned = (await one("SELECT COALESCE(sum(amount),0)::bigint c FROM ledger WHERE user_id=$1 AND amount>0", [id])).c
  const wd = await one("SELECT COALESCE(sum(amount_ton),0) t, count(*)::int c FROM withdrawals WHERE user_id=$1 AND status='done'", [id])
  const refCount = (await one('SELECT count(*)::int c FROM users WHERE referrer_id=$1', [id])).c
  res.json({
    user,
    ledger: ledger.map((l) => ({ ...l, amount: Number(l.amount) })),
    withdrawals: withdrawals.map((w) => ({ ...w, coins: Number(w.coins) })),
    summary: { earnedTotal: Number(earned), withdrawnTon: Number(wd.t), withdrawnCount: wd.c, referrals: refCount },
  })
})

// 积分流水(按来源/时间筛选 + 分页)
manageRouter.get('/users/:id/ledger', async (req, res) => {
  const { source, from, to, page, pageSize } = req.query
  res.json(await ledgerFiltered(req.params.id, { source, from, to, page, pageSize }))
})

// 手动调整积分
manageRouter.post('/users/:id/adjust', async (req, res) => {
  const amount = Number(req.body?.amount)
  if (!amount) return res.status(400).json({ error: 'amount_required' })
  const r = await adjustBalance(req.params.id, amount, req.body?.reason)
  if (!r.ok) return res.status(400).json({ error: r.reason })
  await logAudit(req.admin, 'adjust_balance', req.params.id, { amount, applied: r.applied, reason: req.body?.reason, balance: r.balance })
  res.json({ ok: true, balance: r.balance, applied: r.applied })
})

// 封号 / 解封
manageRouter.post('/users/:id/ban', async (req, res) => {
  const banned = !!req.body?.banned
  const ok = await setBan(req.params.id, banned, req.body?.reason)
  if (!ok) return res.status(404).json({ error: 'not_found' })
  await logAudit(req.admin, banned ? 'ban_user' : 'unban_user', req.params.id, { reason: req.body?.reason })
  res.json({ ok: true })
})

// ---- withdrawals ----
manageRouter.get('/withdrawals', async (req, res) => {
  res.json(await listWithdrawals({ status: req.query.status || undefined }))
})
manageRouter.get('/withdrawals/export', async (req, res) => {
  const list = await listWithdrawals({ status: req.query.status || undefined, limit: 100000 })
  await logAudit(req.admin, 'export_withdrawals', null, { status: req.query.status, count: list.length })
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.send(csv(list, [
    { key: 'created_at', label: '时间' }, { key: 'name', label: '用户' }, { key: 'user_id', label: '用户ID' },
    { key: 'amount_ton', label: '金额TON' }, { key: 'coins', label: '扣积分' }, { key: 'address', label: '地址' },
    { key: 'status', label: '状态' }, { key: 'tx_hash', label: '交易哈希' }, { key: 'reviewed_at', label: '审核时间' },
  ]))
})
manageRouter.post('/withdrawals/:id/review', async (req, res) => {
  const { action, note, txHash } = req.body || {}
  const r = await reviewWithdrawal(req.params.id, action, note, txHash)
  if (!r.ok) return res.status(400).json({ error: r.reason })
  await logAudit(req.admin, 'review_withdrawal', req.params.id, { action, txHash })
  res.json({ ok: true })
})

// ---- audit ----
manageRouter.get('/audit', async (req, res) => {
  res.json(await listAudit({ page: req.query.page, pageSize: req.query.pageSize }))
})

// ---- account(改密码)----
manageRouter.post('/account/password', async (req, res) => {
  const { oldPassword, newPassword } = req.body || {}
  if (!newPassword || String(newPassword).length < 6) return res.status(400).json({ error: 'weak_password' })
  const row = await one('SELECT password_hash FROM admins WHERE username=$1', [req.admin])
  if (!row || !verifyPassword(oldPassword, row.password_hash)) return res.status(400).json({ error: 'bad_old_password' })
  await query('UPDATE admins SET password_hash=$2 WHERE username=$1', [req.admin, hashPassword(newPassword)])
  await logAudit(req.admin, 'change_password', req.admin)
  res.json({ ok: true })
})

// ---- overview ----
manageRouter.get('/overview', async (req, res) => {
  const users = await one('SELECT count(*)::int c FROM users')
  const pending = await one("SELECT count(*)::int c FROM withdrawals WHERE status='pending'")
  const coins = await one('SELECT COALESCE(sum(balance),0)::bigint c FROM users')
  const games = await one('SELECT count(*)::int c FROM games')
  res.json({ users: users.c, pendingWithdrawals: pending.c, totalCoins: Number(coins.c), games: games.c })
})
