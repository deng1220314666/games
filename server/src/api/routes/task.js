import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { checkIn } from '../../shared/models/reward.js'
import { listTasks } from '../../shared/models/tasks.js'
import { todayKey } from '../../shared/lib/time.js'

export const taskRouter = Router()
taskRouter.use(requireAuth)

taskRouter.get('/list', async (req, res) => {
  const u = req.user
  const daily = u.daily && u.daily.date === todayKey() ? u.daily : { date: todayKey(), adCount: 0, gameCoins: 0 }
  const rows = await listTasks({ enabledOnly: true })
  const tasks = rows.map((t) => {
    const base = { id: t.id, type: t.type, title: t.title, reward: Number(t.reward), icon: t.icon }
    if (t.type === 'checkin') return { ...base, done: u.last_checkin_date === todayKey() }
    if (t.type === 'watch_ad')
      return { ...base, total: t.total, progress: daily.adCount || 0, done: (daily.adCount || 0) >= (t.total ?? 20) }
    if (t.type === 'play_game') return { ...base, done: (daily.gameCoins || 0) >= (t.total ?? 600) }
    return { ...base, done: false }
  })
  res.json({ tasks })
})

taskRouter.post('/checkin', async (req, res) => {
  const r = await checkIn(req.user.id)
  if (!r.ok) return res.status(409).json({ error: r.reason, balance: r.balance })
  res.json({ ok: true, amount: r.amount, streak: r.streak, balance: r.balance })
})
