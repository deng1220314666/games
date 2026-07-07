import { many, query } from '../db.js'
import { cache } from '../cache.js'

const CK = 'cfg:games:enabled'

export async function listGames({ enabledOnly = false } = {}) {
  if (enabledOnly) {
    const c = await cache.get(CK)
    if (c) return c
    const rows = await many('SELECT * FROM games WHERE enabled=true ORDER BY sort, created_at')
    await cache.set(CK, rows, 600)
    return rows
  }
  return many('SELECT * FROM games ORDER BY sort, created_at')
}

export async function upsertGame(g) {
  await query(
    `INSERT INTO games(id,name,cover,url,category,sort,enabled)
     VALUES($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT(id) DO UPDATE SET
       name=EXCLUDED.name, cover=EXCLUDED.cover, url=EXCLUDED.url,
       category=EXCLUDED.category, sort=EXCLUDED.sort, enabled=EXCLUDED.enabled`,
    [g.id, g.name, g.cover || '', g.url || '', g.category || '', g.sort || 0, g.enabled !== false]
  )
  await cache.del(CK)
}

export async function deleteGame(id) {
  await query('DELETE FROM games WHERE id=$1', [id])
  await cache.del(CK)
}
