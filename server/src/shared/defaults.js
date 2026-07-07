// 默认配置(首次 migrate 时写入库;之后由后台管理)

export const DEFAULT_SETTINGS = {
  coinPerTon: 100000, // 积分兑 1 TON
  minWithdrawTon: 0.5,
  withdrawFeeTon: 0.01,
  checkInStreakBonus: 20, // 连续签到每天额外
  inviteRebate: 0.1, // 好友收益返佣
  maxEarnPerCall: 1000, // 单次发币上限(反刷)
}

// 任务(含签到):reward=奖励积分,icon=图标(emoji 或图片URL),total=每日上限
export const DEFAULT_TASKS = [
  { id: 'checkin', type: 'checkin', title: '每日签到', reward: 100, icon: '📅', total: null, enabled: true, sort: 1 },
  { id: 'watch_ad', type: 'watch_ad', title: '观看激励广告', reward: 200, icon: '📺', total: 20, enabled: true, sort: 2 },
  { id: 'play_game', type: 'play_game', title: '玩游戏赚币', reward: 30, icon: '🎮', total: 600, enabled: true, sort: 3 },
  { id: 'invite', type: 'invite', title: '邀请好友', reward: 500, icon: '🎁', total: null, enabled: true, sort: 4 },
]
