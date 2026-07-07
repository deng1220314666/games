// 建表 + 首次种子。可重复执行(幂等)。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import { pool } from './db.js'
import { env } from './env.js'
import { DEFAULT_SETTINGS, DEFAULT_TASKS } from './defaults.js'
import { hashPassword } from './hash.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seedDir = path.resolve(__dirname, '../../seed')

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(schema)
  console.log('schema ok')

  // settings(不存在才写默认)
  await pool.query(
    `INSERT INTO app_config(key, value) VALUES('settings', $1)
     ON CONFLICT (key) DO NOTHING`,
    [JSON.stringify(DEFAULT_SETTINGS)]
  )

  // tasks(不存在才写默认)
  for (const t of DEFAULT_TASKS) {
    await pool.query(
      `INSERT INTO tasks(id,type,title,reward,icon,total,enabled,sort)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
      [t.id, t.type, t.title, t.reward, t.icon, t.total, t.enabled, t.sort]
    )
  }

  // games / categories 种子(库为空才导入)
  const { rows } = await pool.query('SELECT count(*)::int c FROM games')
  if (rows[0].c === 0 && fs.existsSync(path.join(seedDir, 'games.json'))) {
    const games = JSON.parse(fs.readFileSync(path.join(seedDir, 'games.json'), 'utf8'))
    for (const g of games) {
      await pool.query(
        `INSERT INTO games(id,name,cover,url,category,sort,enabled)
         VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
        [g.id, g.name, g.cover, g.url, g.category, g.sort, g.enabled]
      )
    }
    console.log('seeded games:', games.length)
  }
  if (fs.existsSync(path.join(seedDir, 'categories.json'))) {
    const cats = JSON.parse(fs.readFileSync(path.join(seedDir, 'categories.json'), 'utf8'))
    await pool.query(
      `INSERT INTO app_config(key,value) VALUES('categories',$1)
       ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()`,
      [JSON.stringify(cats)]
    )
  }

  // 管理员(不存在才建;密码取 env.adminPassword,空则随机生成并打印一次)
  const admin = await pool.query('SELECT 1 FROM admins WHERE username=$1', [env.adminUser])
  if (admin.rowCount === 0) {
    const pw = env.adminPassword || crypto.randomBytes(9).toString('base64url')
    await pool.query('INSERT INTO admins(username,password_hash) VALUES($1,$2)', [
      env.adminUser,
      hashPassword(pw),
    ])
    if (!env.adminPassword) {
      console.log(`\n>>> 已创建管理员 ${env.adminUser} / 初始密码: ${pw}  (请尽快在后台或 .env 中修改)\n`)
    } else {
      console.log(`admin '${env.adminUser}' created`)
    }
  }

  console.log('migrate done')
  await pool.end()
}

run().catch((e) => {
  console.error('migrate failed', e)
  process.exit(1)
})
