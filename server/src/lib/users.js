// 用户创建 / 每日重置 / 公开资料
import crypto from 'node:crypto'
import { getUser, saveUser } from './store.js'
import { todayKey } from './time.js'

function genInviteCode(id) {
  return crypto.createHash('sha1').update(id).digest('hex').slice(0, 8).toUpperCase()
}

export function ensureUser(id, base = {}) {
  let user = getUser(id)
  if (!user) {
    user = {
      id,
      platform: base.platform || 'web',
      name: base.name || 'Guest',
      username: base.username || '',
      avatar: base.avatar || '',
      isAnonymous: base.isAnonymous ?? true,
      balance: 0,
      streak: 0,
      lastCheckInDate: '',
      daily: { date: todayKey(), adCount: 0, gameCoins: 0 },
      inviteCode: genInviteCode(id),
      referrerId: null,
      referralEarned: 0,
      createdAt: Date.now(),
    }
    saveUser(user)
  } else if (base.name) {
    // 更新可变资料
    user.name = base.name
    user.avatar = base.avatar || user.avatar
    user.username = base.username || user.username
    user.platform = base.platform || user.platform
    saveUser(user)
  }
  return user
}

export function ensureDaily(user) {
  const today = todayKey()
  if (user.daily.date !== today) {
    user.daily = { date: today, adCount: 0, gameCoins: 0 }
  }
}

export function publicProfile(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    platform: user.platform,
    isAnonymous: user.isAnonymous,
  }
}
