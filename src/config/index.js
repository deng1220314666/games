// ===== 全局应用配置（网赚平台） =====
export const ENV = import.meta.env.MODE

// 是否生产环境
export const IS_PROD = ENV === 'production'

// 应用基础信息
export const APP = {
  name: 'TTEarn',
  // 平台内虚拟积分名称与图标
  coinName: 'Coin',
  coinSymbol: '🪙',
}

// ===== 经济系统参数 =====
export const ECONOMY = {
  // 积分兑换 TON 的汇率：多少积分 = 1 TON
  coinPerTon: 100000,
  // 最低提现（TON）
  minWithdrawTon: 0.5,
  // 提现手续费（TON）
  withdrawFeeTon: 0.01,

  // 各行为奖励（积分）
  reward: {
    dailyCheckIn: 100, // 每日签到基础
    checkInStreakBonus: 20, // 连续签到每天额外
    watchAd: 200, // 看一次激励广告
    playGamePerMinute: 30, // 每玩游戏 1 分钟
    playGameDailyCap: 600, // 每日玩游戏封顶
    inviteRegister: 500, // 好友注册
    inviteActiveRebate: 0.1, // 好友收益返佣比例
  },

  // 看广告任务每日次数上限
  watchAdDailyLimit: 20,
}

// ===== TON / TON Connect 配置 =====
export const TON = {
  // 收款钱包（提现审核后由后端打款，这里仅用于展示/校验）
  network: IS_PROD ? 'mainnet' : 'testnet',
  // TON Connect manifest（放在 public/tonconnect-manifest.json）
  manifestUrl:
    (typeof window !== 'undefined' ? window.location.origin : '') +
    '/tonconnect-manifest.json',
}

// ===== 后端接口 =====
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
// 是否使用本地 mock（未接后端时为 true）
export const USE_MOCK =
  String(import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'

// 底部导航
export const TABS = [
  { path: '/', key: 'home' },
  { path: '/task', key: 'task' },
  { path: '/invite', key: 'invite' },
  { path: '/mine', key: 'mine' },
]
