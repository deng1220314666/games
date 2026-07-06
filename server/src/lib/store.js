// ===== 数据层 =====
// 当前:内存 + JSON 文件落盘(单机演示)。
// 生产:把本文件替换成真实 DB(Postgres/Mongo/Redis)实现,保持相同方法签名即可,路由无需改。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../../data')
const DATA_FILE = path.join(DATA_DIR, 'db.json')

const db = {
  users: {}, // id -> user
  ledger: [], // { id, userId, source, amount, time }
  withdrawals: [], // { id, userId, amountTon, address, fee, status, time }
  idempotency: {}, // key -> true
}

// ---- 落盘 ----
function persist() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2))
  } catch (e) {
    console.error('[store] persist error', e.message)
  }
}
function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      Object.assign(db, JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')))
    }
  } catch (e) {
    console.error('[store] load error', e.message)
  }
}
load()

let dirty = false
const markDirty = () => {
  dirty = true
}
setInterval(() => {
  if (dirty) {
    dirty = false
    persist()
  }
}, 2000).unref?.()

// ---- users ----
export function getUser(id) {
  return db.users[id] || null
}
export function saveUser(user) {
  db.users[user.id] = user
  markDirty()
  return user
}
export function findByInviteCode(code) {
  return Object.values(db.users).find((u) => u.inviteCode === code) || null
}

// ---- ledger ----
export function addLedger(entry) {
  db.ledger.unshift(entry)
  if (db.ledger.length > 10000) db.ledger.length = 10000
  markDirty()
}
export function getLedger(userId, limit = 50) {
  return db.ledger.filter((l) => l.userId === userId).slice(0, limit)
}

// ---- withdrawals ----
export function addWithdrawal(w) {
  db.withdrawals.unshift(w)
  markDirty()
}
export function updateWithdrawal(id, patch) {
  const w = db.withdrawals.find((x) => x.id === id)
  if (w) {
    Object.assign(w, patch)
    markDirty()
  }
  return w
}
export function getWithdrawals(userId) {
  return db.withdrawals.filter((w) => w.userId === userId)
}

// ---- referrals ----
export function getReferrals(userId) {
  return Object.values(db.users)
    .filter((u) => u.referrerId === userId)
    .map((u) => ({ id: u.id, name: u.name, time: u.createdAt, earned: u.referralEarned || 0 }))
}

// ---- idempotency ----
export function seen(key) {
  return !!db.idempotency[key]
}
export function markSeen(key) {
  db.idempotency[key] = true
  markDirty()
}
