import crypto from 'node:crypto'
import { one, query, pool } from '../db.js'
import { todayKey } from '../lib/time.js'

function genInvite(id) {
  return crypto.createHash('sha1').update(id).digest('hex').slice(0, 8).toUpperCase()
}

export function getUser(id) {
  return one('SELECT * FROM users WHERE id=$1', [id])
}

export function findByInviteCode(code) {
  return one('SELECT * FROM users WHERE invite_code=$1', [String(code).toUpperCase()])
}

export async function ensureUser(id, base = {}) {
  let u = await getUser(id)
  if (!u) {
    await query(
      `INSERT INTO users(id,platform,name,username,avatar,is_anonymous,invite_code,daily)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(id) DO NOTHING`,
      [
        id,
        base.platform || 'web',
        base.name || 'Guest',
        base.username || '',
        base.avatar || '',
        base.isAnonymous ?? true,
        genInvite(id),
        JSON.stringify({ date: todayKey(), adCount: 0, gameCoins: 0 }),
      ]
    )
    u = await getUser(id)
  } else if (base.name) {
    await query(
      `UPDATE users SET name=$2,
         avatar=COALESCE(NULLIF($3,''),avatar),
         username=COALESCE(NULLIF($4,''),username),
         platform=$5 WHERE id=$1`,
      [id, base.name, base.avatar || '', base.username || '', base.platform || u.platform]
    )
    u = await getUser(id)
  }
  return u
}

export function publicProfile(u) {
  return {
    id: u.id,
    name: u.name,
    username: u.username,
    avatar: u.avatar,
    platform: u.platform,
    isAnonymous: u.is_anonymous,
  }
}

// 后台手动调整积分(amount 可正可负,余额下限 0),记流水
export async function adjustBalance(id, amount, reason) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows: [u] } = await client.query('SELECT balance FROM users WHERE id=$1 FOR UPDATE', [id])
    if (!u) {
      await client.query('ROLLBACK')
      return { ok: false, reason: 'not_found' }
    }
    const delta = Math.trunc(Number(amount) || 0)
    const newBal = Math.max(0, Number(u.balance) + delta)
    const applied = newBal - Number(u.balance)
    await client.query('UPDATE users SET balance=$2 WHERE id=$1', [id, newBal])
    await client.query('INSERT INTO ledger(user_id,source,amount,meta) VALUES($1,$2,$3,$4)', [
      id, 'admin_adjust', applied, JSON.stringify({ reason: reason || '', by: 'admin' }),
    ])
    await client.query('COMMIT')
    return { ok: true, balance: newBal, applied }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

// 封号 / 解封
export async function setBan(id, banned, reason) {
  const r = await query('UPDATE users SET banned=$2, ban_reason=$3 WHERE id=$1', [id, !!banned, reason || null])
  return r.rowCount > 0
}

// 首次登录绑定上级 + 发注册奖励(给上级)
export async function bindReferrer(user, code, inviteRegisterReward) {
  if (!code || user.referrer_id) return
  const ref = await findByInviteCode(code)
  if (!ref || ref.id === user.id) return
  await query('UPDATE users SET referrer_id=$2 WHERE id=$1', [user.id, ref.id])
  const bonus = Number(inviteRegisterReward) || 0
  if (bonus > 0) {
    await query('UPDATE users SET balance=balance+$2, referral_earned=referral_earned+$2 WHERE id=$1', [ref.id, bonus])
    await query('INSERT INTO ledger(user_id,source,amount,meta) VALUES($1,$2,$3,$4)', [
      ref.id, 'invite', bonus, JSON.stringify({ newUser: user.id }),
    ])
  }
}
