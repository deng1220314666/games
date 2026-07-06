# TTEarn 后端服务

网赚平台的后端,**与前端完全分离**的独立 Node 服务。账本、发币规则、签到连续天数、提现与打款、initData 校验、反刷都在这里(服务端权威)。

## 技术

Node (ESM) + Express。零重依赖(initData 校验、token 均用内置 `node:crypto`)。
数据层当前为内存 + JSON 落盘(`data/db.json`),生产替换 `src/lib/store.js` 为真实 DB 即可,路由不变。

## 启动

```bash
cd server
npm install
cp .env.example .env      # 按需填 TELEGRAM_BOT_TOKEN / TON 配置
npm run dev               # http://localhost:3000,node --watch 热重载
# 或 npm start
```

前端设 `VITE_API_BASE_URL=http://localhost:3000` 且 `VITE_USE_MOCK=false` 即接入。

## API

| 方法 | 路径 | 说明 | 鉴权 |
|---|---|---|---|
| GET | `/health` | 健康检查 | 否 |
| POST | `/auth/login` | 双端登录(TG initData / web anonId),返回 token+profile+balance,并按 ref 绑定上级 | 否 |
| POST | `/reward/earn` | 发币,仅 `watch_ad`/`play_game`,含每日上限+幂等+返佣 | 是 |
| GET | `/reward/history` | 积分流水 | 是 |
| GET | `/task/list` | 任务与完成状态 | 是 |
| POST | `/task/checkin` | 每日签到(服务端算 streak) | 是 |
| POST | `/wallet/withdraw` | 提现:扣币+落记录+打款(热钱包未配置则 pending) | 是 |
| GET | `/wallet/records` | 提现记录 | 是 |
| GET | `/wallet/balance` | 查链上余额 | 是 |
| GET | `/referral/list` | 邀请码与下级列表 | 是 |

鉴权:`Authorization: Bearer <token>`(登录返回)。

## 目录

```
src/
  index.js          Express 启动
  config.js         env + 经济参数(权威)
  middleware/auth.js token 校验
  lib/
    store.js        数据层(内存+落盘,可换 DB)
    users.js        用户创建/每日重置
    reward.js       发币:上限/幂等/流水/返佣
    token.js        会话 token 签发校验
    telegram.js     initData HMAC 校验
    ton.js          TON 打款/查余额(占位,含 @ton/ton 接入 TODO)
    time.js         UTC 日期(防改本地时间刷签到)
  routes/           auth/reward/task/wallet/referral
```

## 生产清单

- `JWT_SECRET` 换强随机。
- 配 `TELEGRAM_BOT_TOKEN` 后 initData 才真正校验(否则开发放行、不可信)。
- TON 真实打款:装 `@ton/ton @ton/crypto @ton/core`,在 `src/lib/ton.js` 按 TODO 实现,`TON_WALLET_MNEMONIC` 用独立热钱包并限额。
- `store.js` 换成事务型 DB(余额扣减与打款要保证一致性/防并发重复提现)。
- 加限流、风控、提现人工审核队列。
