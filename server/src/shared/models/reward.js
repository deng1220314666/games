import { pool } from '../db.js'
import { getSettings } from './config.js'
import { getTask } from './tasks.js'
import { todayKey, yesterdayKey } from '../lib/time.js'

function dailyOf(u) {
  const today = todayKey()
  const d = u.daily || {}
  return d.date === today ? { ...d } : { date: today, adCount: 0, gameCoins: 0 }
}

// 发币(服务端权威):仅 watch_ad / play_game。签到用 checkIn。
export async function earn(userId, source, amount, { idempotencyKey, meta } = {}) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    if (idempotencyKey) {
      const ins = await client.query('INSERT INTO idempotency(key) VALUES($1) ON CONFLICT DO NOTHING', [idempotencyKey])
      if (ins.rowCount === 0) {
        await client.query('ROLLBACK')
        return { ok: false, reason: 'duplicate' }
      }
    }
    const { rows: [u] } = await client.query('SELECT * FROM users WHERE id=$1 FOR UPDATE', [userId])
    if (!u) {
      await client.query('ROLLBACK')
      return { ok: false, reason: 'no_user' }
    }
    const settings = await getSettings()
    const daily = dailyOf(u)
    amount = Math.min(Number(amount) || 0, settings.maxEarnPerCall || 1000)

    if (source === 'watch_ad') {
      const task = await getTask('watch_ad')
      const limit = task?.total ?? 20
      if ((daily.adCount || 0) >= limit) {
        await client.query('ROLLBACK')
        return { ok: false, reason: 'capped', balance: Number(u.balance) }
      }
      amount = Number(task?.reward ?? amount)
      daily.adCount = (daily.adCount || 0) + 1
    } else if (source === 'play_game') {
      const task = await getTask('play_game')
      const cap = task?.total ?? 600
      amount = Math.min(amount, cap - (daily.gameCoins || 0))
      if (amount <= 0) {
        await client.query('ROLLBACK')
        return { ok: false, reason: 'capped', balance: Number(u.balance) }
      }
      daily.gameCoins = (daily.gameCoins || 0) + amount
    } else {
      await client.query('ROLLBACK')
      return { ok: false, reason: 'invalid_source' }
    }

    const newBal = Number(u.balance) + amount
    await client.query('UPDATE users SET balance=$2, daily=$3 WHERE id=$1', [userId, newBal, JSON.stringify(daily)])
    await client.query('INSERT INTO ledger(user_id,source,amount,meta) VALUES($1,$2,$3,$4)', [
      userId, source, amount, meta ? JSON.stringify(meta) : null,
    ])

    // 上级返佣
    if (u.referrer_id) {
      const rebate = Math.floor(amount * (settings.inviteRebate || 0))
      if (rebate > 0) {
        await client.query('UPDATE users SET balance=balance+$2, referral_earned=referral_earned+$2 WHERE id=$1', [u.referrer_id, rebate])
        await client.query('INSERT INTO ledger(user_id,source,amount,meta) VALUES($1,$2,$3,$4)', [
          u.referrer_id, 'invite_rebate', rebate, JSON.stringify({ from: userId }),
        ])
      }
    }

    await client.query('COMMIT')
    return { ok: true, amount, balance: newBal }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

// 每日签到(服务端算 streak)
export async function checkIn(userId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows: [u] } = await client.query('SELECT * FROM users WHERE id=$1 FOR UPDATE', [userId])
    if (!u) {
      await client.query('ROLLBACK')
      return { ok: false, reason: 'no_user' }
    }
    if (u.last_checkin_date === todayKey()) {
      await client.query('ROLLBACK')
      return { ok: false, reason: 'already', balance: Number(u.balance) }
    }
    const settings = await getSettings()
    const task = await getTask('checkin')
    const base = Number(task?.reward ?? 100)
    const bonus = Number(settings.checkInStreakBonus ?? 20)
    const newStreak = u.last_checkin_date === yesterdayKey() ? u.streak + 1 : 1
    const amount = base + (newStreak - 1) * bonus
    const newBal = Number(u.balance) + amount
    await client.query('UPDATE users SET balance=$2, streak=$3, last_checkin_date=$4 WHERE id=$1', [
      userId, newBal, newStreak, todayKey(),
    ])
    await client.query("INSERT INTO ledger(user_id,source,amount) VALUES($1,'daily_checkin',$2)", [userId, amount])
    await client.query('COMMIT')
    return { ok: true, amount, streak: newStreak, balance: newBal }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export async function ledgerOf(userId, limit = 50) {
  const { rows } = await pool.query(
    'SELECT source, amount, created_at FROM ledger WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2',
    [userId, limit]
  )
  return rows
}
