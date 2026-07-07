import { pool, many } from '../db.js'
import { getSettings } from './config.js'

export async function requestWithdraw(userId, amountTon, address) {
  const settings = await getSettings()
  address = String(address || '')
  amountTon = Number(amountTon)
  if (!address) return { ok: false, reason: 'no_address' }
  if (!amountTon || amountTon < (settings.minWithdrawTon ?? 0.5)) return { ok: false, reason: 'below_min' }
  const coins = Math.ceil(amountTon * (settings.coinPerTon ?? 100000))

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows: [u] } = await client.query('SELECT * FROM users WHERE id=$1 FOR UPDATE', [userId])
    if (!u || Number(u.balance) < coins) {
      await client.query('ROLLBACK')
      return { ok: false, reason: 'insufficient' }
    }
    await client.query('UPDATE users SET balance=balance-$2 WHERE id=$1', [userId, coins])
    const { rows: [w] } = await client.query(
      `INSERT INTO withdrawals(user_id,amount_ton,coins,address,fee,status)
       VALUES($1,$2,$3,$4,$5,'pending') RETURNING *`,
      [userId, amountTon, coins, address, settings.withdrawFeeTon ?? 0.01]
    )
    await client.query('COMMIT')
    return { ok: true, record: w, balance: Number(u.balance) - coins }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export function listWithdrawals({ status, limit = 200 } = {}) {
  if (status) {
    return many(
      `SELECT w.*, u.name, u.platform FROM withdrawals w JOIN users u ON u.id=w.user_id
       WHERE w.status=$1 ORDER BY w.created_at DESC LIMIT $2`,
      [status, limit]
    )
  }
  return many(
    `SELECT w.*, u.name, u.platform FROM withdrawals w JOIN users u ON u.id=w.user_id
     ORDER BY w.created_at DESC LIMIT $1`,
    [limit]
  )
}

export function userWithdrawals(userId) {
  return many('SELECT * FROM withdrawals WHERE user_id=$1 ORDER BY created_at DESC', [userId])
}

// 审核:pay/done=标记已打款;reject=退还积分
export async function reviewWithdrawal(id, action, note = '', txHash = '') {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows: [w] } = await client.query('SELECT * FROM withdrawals WHERE id=$1 FOR UPDATE', [id])
    if (!w) {
      await client.query('ROLLBACK')
      return { ok: false, reason: 'not_found' }
    }
    if (w.status !== 'pending' && w.status !== 'approved') {
      await client.query('ROLLBACK')
      return { ok: false, reason: 'already_' + w.status }
    }
    if (action === 'reject') {
      await client.query('UPDATE users SET balance=balance+$2 WHERE id=$1', [w.user_id, w.coins])
      await client.query("UPDATE withdrawals SET status='rejected', note=$2, reviewed_at=now() WHERE id=$1", [id, note])
    } else if (action === 'pay' || action === 'done') {
      await client.query("UPDATE withdrawals SET status='done', note=$2, tx_hash=$3, reviewed_at=now() WHERE id=$1", [id, note, txHash])
    } else if (action === 'approve') {
      await client.query("UPDATE withdrawals SET status='approved', note=$2, reviewed_at=now() WHERE id=$1", [id, note])
    } else {
      await client.query('ROLLBACK')
      return { ok: false, reason: 'bad_action' }
    }
    await client.query('COMMIT')
    return { ok: true }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
