// ===== 发币唯一入口 =====
// 所有赚币场景都调 earn(),禁止在别处直接改 userStore.balance。
// 后端权威:mock 模式本地结算;接后端时余额以后端返回为准。
// BACKEND: POST /reward/earn { source, amount, idempotencyKey, meta } -> { balance, amount }
//   仅接受 watch_ad / play_game;签到走 task.checkIn(),邀请由后端发放。
import { useUserStore } from '@/stores/userStore.js'
import { ECONOMY, USE_MOCK } from '@/config/index.js'
import { client } from '@/api/client.js'
import { track } from '@/utils/event.js'
import { randomId } from '@/utils/index.js'

// 每日上限校验(前端第一道,后端最终裁决)
function checkDailyCap(user, source, amount) {
  user.ensureDaily()
  if (source === 'watch_ad') {
    if (user.daily.adCount >= ECONOMY.watchAdDailyLimit) return false
  }
  if (source === 'play_game') {
    if (user.daily.gameCoins >= ECONOMY.reward.playGameDailyCap) return false
    amount = Math.min(amount, ECONOMY.reward.playGameDailyCap - user.daily.gameCoins)
    if (amount <= 0) return false
  }
  return amount
}

function notify(source, amount) {
  track.earn(source, amount)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('reward:earn', { detail: { source, amount } }))
  }
}

/**
 * 发放积分
 * @returns {Promise<{ok:boolean, amount:number, balance:number}>}
 */
export async function earn(source, amount, meta = {}) {
  const user = useUserStore()
  const capped = checkDailyCap(user, source, amount)
  if (capped === false) return { ok: false, amount: 0, balance: user.balance }
  amount = capped

  let granted = amount

  if (!USE_MOCK) {
    try {
      const res = await client.post('/reward/earn', {
        source,
        amount,
        idempotencyKey: randomId('earn'),
        meta,
      })
      granted = res.amount ?? amount
      user.balance = res.balance // 余额以后端为准
      user.recordHistory(granted, source)
    } catch (e) {
      return { ok: false, amount: 0, balance: user.balance }
    }
  } else {
    user._applyEarn(granted, source)
  }

  // 本地每日计数(用于任务进度展示;后端亦独立计数)
  if (source === 'watch_ad') user.daily.adCount += 1
  if (source === 'play_game') user.daily.gameCoins += granted

  notify(source, granted)
  return { ok: true, amount: granted, balance: user.balance }
}

// 扣币(mock 模式提现用;后端模式提现由后端扣减)
export async function spend(amount) {
  const user = useUserStore()
  user._applySpend(amount)
  return user.balance
}
