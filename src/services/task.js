// ===== 任务中心 + 每日签到 =====
// BACKEND: GET /task/list, POST /task/checkin
import { useUserStore } from '@/stores/userStore.js'
import { ECONOMY, USE_MOCK } from '@/config/index.js'
import { client } from '@/api/client.js'
import { track } from '@/utils/event.js'

// 每日签到:基础 + 连续天数 bonus(后端权威计算 streak)
export async function checkIn() {
  const user = useUserStore()
  if (user.checkedInToday) return { ok: false, reason: 'already' }

  if (!USE_MOCK) {
    try {
      const res = await client.post('/task/checkin')
      user.balance = res.balance
      user.markCheckIn(res.streak)
      user.recordHistory(res.amount, 'daily_checkin')
      afterCheckIn(res.streak, res.amount)
      return { ok: true, amount: res.amount, streak: res.streak }
    } catch (e) {
      return { ok: false, reason: 'already' }
    }
  }

  // ---- mock ----
  const yesterday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    const p = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
  })()
  const newStreak = user.lastCheckInDate === yesterday ? user.streak + 1 : 1
  const amount =
    ECONOMY.reward.dailyCheckIn + (newStreak - 1) * ECONOMY.reward.checkInStreakBonus

  user._applyEarn(amount, 'daily_checkin')
  user.markCheckIn(newStreak)
  afterCheckIn(newStreak, amount)
  return { ok: true, amount, streak: newStreak }
}

function afterCheckIn(streak, amount) {
  track.checkIn(streak)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('reward:earn', { detail: { source: 'daily_checkin', amount } })
    )
  }
}

// 任务列表(mock;接后端替换为 GET /task/list)
export function getTasks() {
  const user = useUserStore()
  user.ensureDaily()
  return [
    {
      id: 'checkin',
      type: 'checkin',
      title: 'task.checkin',
      reward: ECONOMY.reward.dailyCheckIn,
      done: user.checkedInToday,
    },
    {
      id: 'watch_ad',
      type: 'watch_ad',
      title: 'task.watchAd',
      reward: ECONOMY.reward.watchAd,
      progress: user.daily.adCount,
      total: ECONOMY.watchAdDailyLimit,
      done: user.daily.adCount >= ECONOMY.watchAdDailyLimit,
    },
    {
      id: 'play_game',
      type: 'play_game',
      title: 'task.playGame',
      reward: ECONOMY.reward.playGamePerMinute,
      done: user.daily.gameCoins >= ECONOMY.reward.playGameDailyCap,
    },
    {
      id: 'invite',
      type: 'invite',
      title: 'task.invite',
      reward: ECONOMY.reward.inviteRegister,
      done: false,
    },
  ]
}
