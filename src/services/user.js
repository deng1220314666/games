// ===== 登录 / 账户 =====
// 双端鉴权:TG 用 initData,web 用匿名 ID(后端未接前本地生成)。
// BACKEND: POST /auth/login { platform, initData?, anonId? } -> { token, profile, inviteCode }
import { useUserStore } from '@/stores/userStore.js'
import { platform } from '@/utils/platform.js'
import { getTelegramAuth, getTelegramUser, getStartParam } from '@/utils/telegram.js'
import { client, USE_MOCK } from '@/api/client.js'
import { randomId } from '@/utils/index.js'

// 生成/取本地匿名 ID
function getAnonId() {
  let id = localStorage.getItem('anon_id')
  if (!id) {
    id = randomId('anon')
    localStorage.setItem('anon_id', id)
  }
  return id
}

export async function login() {
  const user = useUserStore()
  const type = platform.type

  if (!USE_MOCK) {
    const ref = getStartParam()
    const body =
      type === 'telegram'
        ? { platform: 'telegram', initData: getTelegramAuth()?.initData, ref }
        : { platform: 'web', anonId: getAnonId(), ref }
    const res = await client.post('/auth/login', body)
    localStorage.setItem('auth_token', res.token)
    user.setProfile({ ...res.profile, platform: platform.type })
    if (res.inviteCode) user.inviteCode = res.inviteCode
    if (typeof res.balance === 'number') user.balance = res.balance
    return user.profile
  }

  // ---- mock ----
  if (type === 'telegram') {
    const tgUser = getTelegramUser()
    user.setProfile({
      id: tgUser?.id || getAnonId(),
      name: tgUser?.name || 'Telegram User',
      username: tgUser?.username || '',
      avatar: tgUser?.avatar || '',
      platform: 'telegram',
      isAnonymous: false,
    })
  } else {
    const id = getAnonId()
    user.setProfile({
      id,
      name: 'Guest ' + id.slice(-4),
      platform: 'web',
      isAnonymous: true,
    })
  }
  if (!user.inviteCode) user.inviteCode = (user.profile.id || randomId('u')).slice(-8).toUpperCase()
  return user.profile
}
