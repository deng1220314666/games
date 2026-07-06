import crypto from 'node:crypto'
import { Router } from 'express'
import { ECONOMY } from '../config.js'
import { requireAuth } from '../middleware/auth.js'
import { saveUser, addLedger } from '../lib/store.js'
import { ensureDaily } from '../lib/users.js'
import { todayKey, yesterdayKey } from '../lib/time.js'

export const taskRouter = Router()
taskRouter.use(requireAuth)

// GET /task/list
taskRouter.get('/list', (req, res) => {
  const user = req.user
  ensureDaily(user)
  res.json({
    tasks: [
      { id: 'checkin', type: 'checkin', reward: ECONOMY.reward.dailyCheckIn, done: user.lastCheckInDate === todayKey() },
      {
        id: 'watch_ad',
        type: 'watch_ad',
        reward: ECONOMY.reward.watchAd,
        progress: user.daily.adCount,
        total: ECONOMY.watchAdDailyLimit,
        done: user.daily.adCount >= ECONOMY.watchAdDailyLimit,
      },
      { id: 'play_game', type: 'play_game', reward: ECONOMY.reward.playGamePerMinute, done: user.daily.gameCoins >= ECONOMY.reward.playGameDailyCap },
      { id: 'invite', type: 'invite', reward: ECONOMY.reward.inviteRegister, done: false },
    ],
  })
})

// POST /task/checkin  —— 签到与连续天数由服务端权威计算
taskRouter.post('/checkin', (req, res) => {
  const user = req.user
  if (user.lastCheckInDate === todayKey()) {
    return res.status(409).json({ error: 'already_checked_in', balance: user.balance })
  }
  const newStreak = user.lastCheckInDate === yesterdayKey() ? user.streak + 1 : 1
  const amount = ECONOMY.reward.dailyCheckIn + (newStreak - 1) * ECONOMY.reward.checkInStreakBonus

  user.streak = newStreak
  user.lastCheckInDate = todayKey()
  user.balance += amount
  saveUser(user)
  addLedger({ id: crypto.randomUUID(), userId: user.id, source: 'daily_checkin', amount, time: Date.now() })

  res.json({ ok: true, amount, streak: newStreak, balance: user.balance })
})
