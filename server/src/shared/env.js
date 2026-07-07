// 统一加载环境变量:server/.env + 上级目录的 db.env / cache.env(密钥分离,600 权限)
import dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'

const cwd = process.cwd()
const candidates = [
  path.resolve(cwd, '.env'),
  path.resolve(cwd, '..', 'db.env'), // DATABASE_URL
  path.resolve(cwd, '..', 'cache.env'), // REDIS_URL
]
for (const p of candidates) {
  if (fs.existsSync(p)) dotenv.config({ path: p })
}

export const env = {
  // 三个服务各自端口
  apiPort: Number(process.env.API_PORT || 3001),
  adminPort: Number(process.env.ADMIN_PORT || 3002),
  statsPort: Number(process.env.STATS_PORT || 3003),

  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || '',

  corsOrigin: (process.env.CORS_ORIGIN || 'https://tg.ttgame.fun')
    .split(',')
    .map((s) => s.trim()),
  adminOrigin: (process.env.ADMIN_ORIGIN || 'https://tgadmin.ttgame.fun')
    .split(',')
    .map((s) => s.trim()),

  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  adminUser: process.env.ADMIN_USER || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || '', // 空则用默认(见 seed)
  adminSecret: process.env.ADMIN_SECRET || process.env.JWT_SECRET || 'dev-admin-secret',

  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  ton: {
    mnemonic: process.env.TON_WALLET_MNEMONIC || '',
    network: process.env.TON_NETWORK || 'mainnet',
    toncenterKey: process.env.TONCENTER_API_KEY || '',
  },
}
