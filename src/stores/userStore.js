import { defineStore } from 'pinia'
import { getTodayKey } from '@/utils/index.js'

// 账户 / 余额 / 签到 / 每日统计 / 邀请。
// 注意:发币只经 services/reward.js 的 earn(),不要在外部直接改 balance。
export const useUserStore = defineStore('user', {
  state: () => ({
    profile: {
      id: '',
      name: '',
      username: '',
      avatar: '',
      platform: 'web', // 'telegram' | 'web'
      isAnonymous: true,
    },
    balance: 0, // 积分余额
    coinHistory: [], // { id, source, amount, time }

    // 签到
    streak: 0,
    lastCheckInDate: '',

    // 每日统计(按本地日期重置)
    daily: {
      date: '',
      adCount: 0, // 当日看广告次数
      gameCoins: 0, // 当日玩游戏已得币
    },

    // 邀请
    inviteCode: '',
    referrals: [], // { id, name, time, earned }
  }),

  getters: {
    // 折算成 TON(只读展示)
    tonEquivalent: (state) => (coinPerTon) =>
      Number((state.balance / coinPerTon).toFixed(6)),
    checkedInToday: (state) => state.lastCheckInDate === getTodayKey(),
  },

  actions: {
    // 每日重置
    ensureDaily() {
      const today = getTodayKey()
      if (this.daily.date !== today) {
        this.daily = { date: today, adCount: 0, gameCoins: 0 }
      }
    },

    setProfile(p) {
      this.profile = { ...this.profile, ...p }
    },

    // 记一条流水(不改余额)—— 后端模式下余额由后端返回后单独设置
    recordHistory(amount, source) {
      this.coinHistory.unshift({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        source,
        amount,
        time: Date.now(),
      })
      if (this.coinHistory.length > 100) this.coinHistory.length = 100
    },

    // 低层发币(mock 模式):加余额 + 记流水
    _applyEarn(amount, source) {
      this.balance += amount
      this.recordHistory(amount, source)
    },

    // 低层扣币:提现等场景
    _applySpend(amount) {
      this.balance = Math.max(0, this.balance - amount)
    },

    markCheckIn(streak) {
      this.streak = streak
      this.lastCheckInDate = getTodayKey()
    },

    addReferral(ref) {
      this.referrals.unshift(ref)
    },
  },

  persist: {
    key: 'tt-user',
    storage: window.localStorage,
  },
})
