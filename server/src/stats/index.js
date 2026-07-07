// 统计服务(预留):汇总查询,内部使用(localhost),后续接数据大盘/定时任务。
import express from 'express'
import { env } from '../shared/env.js'
import { many, one } from '../shared/db.js'
import { requireAdmin } from '../admin/middleware/adminAuth.js'

const app = express()
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true, service: 'stats', ts: Date.now() }))

// 需要 admin token(和后台同一套鉴权)
app.use(requireAdmin)

// 汇总:今日新增用户、今日发币、今日提现
app.get('/summary', async (req, res) => {
  const newUsers = await one("SELECT count(*)::int c FROM users WHERE created_at::date = now()::date")
  const earnToday = await one("SELECT COALESCE(sum(amount),0)::bigint c FROM ledger WHERE created_at::date = now()::date AND amount > 0")
  const wdToday = await one("SELECT count(*)::int c, COALESCE(sum(amount_ton),0) t FROM withdrawals WHERE created_at::date = now()::date")
  res.json({
    newUsersToday: newUsers.c,
    coinsEarnedToday: Number(earnToday.c),
    withdrawalsToday: wdToday.c,
    withdrawTonToday: Number(wdToday.t),
  })
})

// 近7天发币趋势
app.get('/earn-trend', async (req, res) => {
  const rows = await many(
    `SELECT created_at::date d, COALESCE(sum(amount),0)::bigint c
     FROM ledger WHERE amount>0 AND created_at > now()-interval '7 days'
     GROUP BY d ORDER BY d`
  )
  res.json({ trend: rows.map((r) => ({ date: r.d, coins: Number(r.c) })) })
})

app.listen(env.statsPort, () => {
  console.log(`TTEarn stats on http://localhost:${env.statsPort}`)
})
