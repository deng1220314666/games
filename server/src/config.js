import 'dotenv/config'

// 后端是账本与规则的**权威来源**。前端的同名参数仅用于展示/乐观更新。
export const config = {
  port: Number(process.env.PORT || 3000),
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:8888')
    .split(',')
    .map((s) => s.trim()),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  ton: {
    mnemonic: process.env.TON_WALLET_MNEMONIC || '',
    network: process.env.TON_NETWORK || 'testnet',
    toncenterKey: process.env.TONCENTER_API_KEY || '',
  },
}

// 经济系统参数(与前端 src/config/index.js 的 ECONOMY 对应,以此处为准)
export const ECONOMY = {
  coinPerTon: 100000,
  minWithdrawTon: 0.5,
  withdrawFeeTon: 0.01,
  reward: {
    dailyCheckIn: 100,
    checkInStreakBonus: 20,
    watchAd: 200,
    playGamePerMinute: 30,
    playGameDailyCap: 600,
    inviteRegister: 500,
    inviteActiveRebate: 0.1,
  },
  watchAdDailyLimit: 20,
  // 单次 earn 上限(反刷,防止前端被篡改后请求超大额)
  maxEarnPerCall: 1000,
}
