// 服务端权威发币:上限、幂等、流水、上级返佣。
import crypto from 'node:crypto'
import { ECONOMY } from '../config.js'
import { saveUser, addLedger, seen, markSeen, getUser } from './store.js'
import { ensureDaily } from './users.js'

// 校验并截断金额;返回可发放额度或 0
function applyCap(user, source, amount) {
  amount = Math.min(amount, ECONOMY.maxEarnPerCall)
  if (source === 'watch_ad') {
    if (user.daily.adCount >= ECONOMY.watchAdDailyLimit) return 0
    if (amount > ECONOMY.reward.watchAd) amount = ECONOMY.reward.watchAd
  }
  if (source === 'play_game') {
    const left = ECONOMY.reward.playGameDailyCap - user.daily.gameCoins
    amount = Math.min(amount, left)
  }
  return amount > 0 ? amount : 0
}

/**
 * 发放积分(服务端唯一入口)
 * @returns {{ok:boolean, amount:number, balance:number, reason?:string}}
 */
export function earn(user, source, amount, { idempotencyKey, meta } = {}) {
  ensureDaily(user)

  if (idempotencyKey) {
    if (seen(idempotencyKey)) return { ok: false, reason: 'duplicate', amount: 0, balance: user.balance }
  }

  const granted = applyCap(user, source, Number(amount) || 0)
  if (granted <= 0) return { ok: false, reason: 'capped', amount: 0, balance: user.balance }

  user.balance += granted
  if (source === 'watch_ad') user.daily.adCount += 1
  if (source === 'play_game') user.daily.gameCoins += granted
  saveUser(user)

  addLedger({
    id: crypto.randomUUID(),
    userId: user.id,
    source,
    amount: granted,
    time: Date.now(),
    meta: meta || null,
  })
  if (idempotencyKey) markSeen(idempotencyKey)

  // 上级返佣
  payRebate(user, granted)

  return { ok: true, amount: granted, balance: user.balance }
}

function payRebate(user, granted) {
  if (!user.referrerId) return
  const ref = getUser(user.referrerId)
  if (!ref) return
  const rebate = Math.floor(granted * ECONOMY.reward.inviteActiveRebate)
  if (rebate <= 0) return
  ref.balance += rebate
  ref.referralEarned = (ref.referralEarned || 0) + rebate
  saveUser(ref)
  addLedger({
    id: crypto.randomUUID(),
    userId: ref.id,
    source: 'invite_rebate',
    amount: rebate,
    time: Date.now(),
    meta: { from: user.id },
  })
}

// 扣币(提现)
export function spend(user, amount) {
  user.balance = Math.max(0, user.balance - amount)
  saveUser(user)
  return user.balance
}
