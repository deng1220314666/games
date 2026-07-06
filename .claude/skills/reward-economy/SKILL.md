---
name: reward-economy
description: TTEarn 积分经济系统的约定 —— 赚币、记流水、每日签到/任务、邀请返佣、积分兑 TON、提现规则。当任务涉及:新增或修改赚币方式、调整奖励数值、签到、任务中心、邀请奖励、提现门槛、余额显示时使用。
---

# 积分经济系统

用户赚「积分(Coin)」,积分按 `ECONOMY.coinPerTon` 兑换 TON 提现。

## 参数集中在 `src/config/index.js` 的 `ECONOMY`

```
coinPerTon        积分兑 1 TON 的比例
minWithdrawTon    最低提现
withdrawFeeTon    提现手续费
reward.*          各行为奖励(签到/看广告/玩游戏/邀请)
watchAdDailyLimit 看广告每日上限
```

改奖励数值只改这里,不要在页面里写死。

## 唯一发币入口:`src/services/reward.js` 的 `earn()`

```js
await earn(source, amount, meta)
// source: 'daily_checkin' | 'watch_ad' | 'play_game' | 'invite' | ...
```

`earn()` 内部统一做四件事,任何发币场景都必须经过它:
1. 幂等/上限校验(后端为准,前端乐观更新 `userStore.balance`)
2. 写入积分流水(`userStore` / 后端)
3. 上报 GA(`trackEarn`)
4. `USE_MOCK` 时本地结算,否则调后端 `/reward/earn`

**禁止**任何地方直接 `userStore.balance += x`。

## 加一种新的赚币方式(标准流程)

1. `ECONOMY.reward` 加数值。
2. 触发点调 `earn('新source', ECONOMY.reward.新项, { ...meta })`。
3. 若是任务型,在 `services/task.js` 的任务列表登记(id、标题、奖励、每日上限、完成校验)。
4. i18n 加文案(`zh.json` / `en.json` 的 `earn` / `task` 段)。
5. 用 `RewardToast` 组件给用户反馈(+积分动画)。

## 四种赚币方式(本项目已定)

| source | 触发 | 规则 |
|---|---|---|
| `daily_checkin` | 每日签到 | 基础 + 连续天数 bonus,每日一次 |
| `watch_ad` | 看激励广告 | 见 `adops` 技能,每日上限 |
| `play_game` | 玩游戏累计时长 | 每分钟发币,每日封顶 `playGameDailyCap` |
| `invite` | 好友注册/活跃 | 注册一次性 + 好友收益按 `inviteActiveRebate` 返佣 |

## 每日/连续类状态

签到连续天数、当日已看广告次数、当日玩游戏已得币,存 `userStore` 并按「本地日期」重置(`getTodayKey()`)。跨天判断用本地 00:00,不要用固定 24h 毫秒差。

## 提现规则(见 ton-payments 技能实现细节)

- 门槛:余额折算 ≥ `minWithdrawTon`。
- 需先连 TON 钱包拿到地址。
- 提交提现 → 生成 pending 记录 → **后端审核打款**(前端不上链转账给用户)。
- 手续费 `withdrawFeeTon`。

## 反作弊(前端约束 + 后端最终裁决)

前端所有余额都是乐观显示,**真实余额和发放以后端为准**。前端只负责:上限禁用按钮、幂等 token、最短时长校验。
