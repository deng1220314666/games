// Postgres 连接池(所有服务共用同一个 ttearn 库)
import pg from 'pg'
import { env } from './env.js'

if (!env.databaseUrl) {
  console.error('!! DATABASE_URL 未配置(检查 db.env)')
}

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
})

pool.on('error', (e) => console.error('[pg] pool error', e.message))

// 便捷查询
export const query = (text, params) => pool.query(text, params)

// 取单行
export async function one(text, params) {
  const { rows } = await pool.query(text, params)
  return rows[0] || null
}

// 取多行
export async function many(text, params) {
  const { rows } = await pool.query(text, params)
  return rows
}
