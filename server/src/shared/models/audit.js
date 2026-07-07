import { query, one, many } from '../db.js'

export async function logAudit(admin, action, target, detail) {
  try {
    await query('INSERT INTO audit_log(admin,action,target,detail) VALUES($1,$2,$3,$4)', [
      admin,
      action,
      target || null,
      detail ? JSON.stringify(detail) : null,
    ])
  } catch (e) {
    console.error('[audit]', e.message)
  }
}

export async function listAudit({ page = 1, pageSize = 50 } = {}) {
  const limit = Math.min(Number(pageSize) || 50, 200)
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit
  const total = (await one('SELECT count(*)::int c FROM audit_log')).c
  const data = await many(`SELECT * FROM audit_log ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`)
  return { data, total }
}
