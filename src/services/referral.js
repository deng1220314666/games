// ===== 邀请 / 返佣 =====
// BACKEND: GET /referral/list(上级绑定在 /auth/login 用启动参数完成)
import { useUserStore } from '@/stores/userStore.js'
import { APP, USE_MOCK } from '@/config/index.js'
import { platform } from '@/utils/platform.js'
import { getStartParam, shareInvite as tgShare } from '@/utils/telegram.js'
import { client } from '@/api/client.js'
import { track } from '@/utils/event.js'

// Telegram bot / mini app 名(部署时替换)
const TG_BOT = 'YourBot'
const TG_APP = 'app'

// 生成邀请链接(双端各一份)
export function getInviteLinks() {
  const user = useUserStore()
  const code = user.inviteCode || ''
  return {
    telegram: `https://t.me/${TG_BOT}/${TG_APP}?startapp=${code}`,
    web: `${window.location.origin}/?ref=${code}`,
    code,
  }
}

// 分享(环境自适应)
export function share() {
  const links = getInviteLinks()
  const link = platform.isTelegram ? links.telegram : links.web
  const text = `Play & earn on ${APP.name}! Use my code ${links.code}`
  track.invite()
  tgShare(link, text)
  return link
}

// 进入时绑定上级:后端在 /auth/login 用启动参数(ref)完成绑定,这里只做本地标记去重
export async function bindReferrerFromStart() {
  const code = getStartParam()
  if (!code) return
  if (localStorage.getItem('ref_bound')) return
  localStorage.setItem('ref_bound', code)
}

// 邀请列表:mock 返回本地;后端返回真实下级
export function getReferrals() {
  return useUserStore().referrals
}

export async function loadReferrals() {
  const user = useUserStore()
  if (USE_MOCK) return user.referrals
  try {
    const res = await client.get('/referral/list')
    if (Array.isArray(res.referrals)) user.referrals = res.referrals
    if (res.inviteCode) user.inviteCode = res.inviteCode
  } catch (e) {
    /* noop */
  }
  return user.referrals
}
