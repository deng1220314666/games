---
name: backend-api
description: TTEarn 独立后端服务(server/)的约定 —— 与前端分离的 Node/Express 服务,负责账本、发币规则、签到、提现打款、initData 校验、反刷。当任务涉及:改后端接口、加端点、动经济规则的服务端实现、鉴权、TON 打款、数据层/DB、前后端联调时使用。
---

# 后端服务(server/)

**后端与前端是两个独立项目**,不要把业务规则写回前端。前端 `src/services/*` 只是调用层,真实账本与裁决在 `server/`。

- 前端:仓库根(Vite,端口 8888)
- 后端:`server/`(Express,端口 3000)
- 前端 `VITE_USE_MOCK=false` + `VITE_API_BASE_URL` 指向后端即接入;`true` 时前端自带 mock,不依赖后端。

## 铁律

1. **服务端权威**:余额、每日上限、签到 streak、提现扣币都以后端为准。前端传来的 amount 只是意向,后端 `applyCap` 会截断。
2. **发币收口**:后端发币走 `src/lib/reward.js` 的 `earn()`(上限+幂等+流水+返佣)。签到走 `/task/checkin` 单独算 streak。`/reward/earn` 只接受 `watch_ad`/`play_game`,**禁止**放开任意 source。
3. **时间用 UTC**(`lib/time.js`),防用户改本地时间刷签到。
4. **幂等**:发币带 `idempotencyKey`,`store.seen/markSeen` 去重。
5. **密钥不进仓库**:`JWT_SECRET`、`TELEGRAM_BOT_TOKEN`、`TON_WALLET_MNEMONIC` 只在 `.env`。

## 分层

`routes/*`(HTTP + 参数校验) → `lib/*`(业务:reward/users/ton/telegram) → `lib/store.js`(数据层)。
加端点:在 `routes/` 加路由 → 需要登录就 `router.use(requireAuth)`,`req.user` 即当前用户 → 业务写在 `lib/`,不要堆在路由里。

## 数据层(可换 DB)

`lib/store.js` 现在是内存 + JSON 落盘。换真实 DB 时**只改这个文件**,保持方法签名(`getUser/saveUser/addLedger/addWithdrawal/...`),路由与业务无需动。
⚠️ 提现的「扣币 + 落记录 + 打款」在真实 DB 下要用事务,防并发重复提现。

## 鉴权

`/auth/login`:TG 传 `initData`(`lib/telegram.js` 做 HMAC 校验),web 传 `anonId`;返回自签 token(`lib/token.js`)。其余接口 `Authorization: Bearer <token>`。
未配 `TELEGRAM_BOT_TOKEN` 时 initData 校验被跳过(仅开发,标记 `dev`,不可信)。

## TON 打款

`lib/ton.js` 现为占位:未配热钱包时提现只落 `pending`。真实打款按文件内 TODO 装 `@ton/ton` 系列实现,用独立限额热钱包。详见 `ton-payments` 技能(前端侧)。

## 前后端契约对照

改端点时前后端要同步(路径/字段):
- 前端 `services/user.js` ↔ `POST /auth/login`
- 前端 `services/reward.js` ↔ `POST /reward/earn`
- 前端 `services/task.js` ↔ `POST /task/checkin`、`GET /task/list`
- 前端 `services/wallet.js` ↔ `POST /wallet/withdraw`、`GET /wallet/records|balance`
- 前端 `services/referral.js` ↔ `GET /referral/list`

## 联调

```bash
cd server && npm install && cp .env.example .env && npm run dev
# 另开:前端根目录 .env 设 VITE_USE_MOCK=false,npm run dev
```
冒烟:`curl localhost:3000/health`,再 `POST /auth/login` 拿 token 打其余接口。
