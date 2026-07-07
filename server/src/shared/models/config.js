import { one, query } from '../db.js'
import { cache } from '../cache.js'

const CK = 'cfg:settings'

export async function getSettings() {
  const c = await cache.get(CK)
  if (c) return c
  const row = await one("SELECT value FROM app_config WHERE key='settings'")
  const v = row?.value || {}
  await cache.set(CK, v, 600)
  return v
}

export async function setSettings(patch) {
  const cur = await one("SELECT value FROM app_config WHERE key='settings'")
  const next = { ...(cur?.value || {}), ...patch }
  await query(
    `INSERT INTO app_config(key,value) VALUES('settings',$1)
     ON CONFLICT(key) DO UPDATE SET value=$1, updated_at=now()`,
    [JSON.stringify(next)]
  )
  await cache.del(CK)
  return next
}

export async function getCategories() {
  const row = await one("SELECT value FROM app_config WHERE key='categories'")
  return row?.value || []
}
