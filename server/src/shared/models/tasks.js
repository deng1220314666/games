import { many, query } from '../db.js'
import { cache } from '../cache.js'

const CK = 'cfg:tasks:enabled'

export async function listTasks({ enabledOnly = false } = {}) {
  if (enabledOnly) {
    const c = await cache.get(CK)
    if (c) return c
    const rows = await many('SELECT * FROM tasks WHERE enabled=true ORDER BY sort, id')
    await cache.set(CK, rows, 600)
    return rows
  }
  return many('SELECT * FROM tasks ORDER BY sort, id')
}

export async function getTask(id) {
  const rows = await many('SELECT * FROM tasks WHERE id=$1', [id])
  return rows[0] || null
}

export async function upsertTask(t) {
  await query(
    `INSERT INTO tasks(id,type,title,reward,icon,total,enabled,sort)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT(id) DO UPDATE SET
       type=EXCLUDED.type, title=EXCLUDED.title, reward=EXCLUDED.reward,
       icon=EXCLUDED.icon, total=EXCLUDED.total, enabled=EXCLUDED.enabled, sort=EXCLUDED.sort`,
    [t.id, t.type, t.title, t.reward || 0, t.icon || '', t.total ?? null, t.enabled !== false, t.sort || 0]
  )
  await cache.del(CK)
}

export async function deleteTask(id) {
  await query('DELETE FROM tasks WHERE id=$1', [id])
  await cache.del(CK)
}
