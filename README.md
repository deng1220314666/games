# TTEarn — 玩游戏赚 TON 的网赚平台

「玩游戏 / 看广告 / 做任务 / 拉好友 → 赚积分 → 提现到 TON 钱包」。
**同一套代码同时跑在 Telegram 小程序内和普通浏览器 H5**,运行时探测环境。

技术栈:Vue 3 + Vite + Pinia(持久化) + vue-router + vue-i18n + Tailwind。

## 前后端分离

- **前端**(仓库根):Vue 3 + Vite,端口 8888。
- **后端**(`server/`):独立 Node/Express 服务,端口 3000。账本、发币规则、签到、提现打款、鉴权都在后端(权威)。见 `server/README.md`。

## 快速开始

纯前端演示(不需后端):
```bash
npm install
cp .env.example .env    # 把 VITE_USE_MOCK 改成 true
npm run dev             # http://localhost:8888
```

接后端(完整链路):
```bash
# 1) 起后端
cd server && npm install && cp .env.example .env && npm run dev
# 2) 起前端(根目录):.env 设 VITE_USE_MOCK=false, VITE_API_BASE_URL=http://localhost:3000
npm install && npm run dev
```

## 核心能力

- **双端**:`src/utils/platform.js` 探测 Telegram / Web;TG 用 initData 免密登录,Web 用匿名 ID。
- **四种赚币**:每日签到、看激励广告(Adsterra/OnClick)、玩游戏计时、邀请好友返佣。
- **积分经济**:积分按汇率兑 TON,发币统一走 `src/services/reward.js` 的 `earn()`。
- **TON 支付**:`src/utils/tonConnect.js` 懒加载 TON Connect 连钱包,`Wallet` 页提现(真实打款走后端)。
- **广告**:仅 Adsterra + OnClick,配置集中在 `src/config/ads.js`。
- **埋点**:GA(`src/utils/event.js`),网赚事件用 `track.*`。

## 目录

```
src/
  config/      全局配置(经济参数/广告位/TON)
  utils/       platform / telegram / tonConnect / adSdk / event
  services/    业务服务层:user / reward / task / wallet / referral(mock,可接后端)
  stores/      Pinia:userStore / walletStore / gameStore
  views/       Home / Task / Wallet / Mine / Invite / GameDetail / PrivacyPolicy
  components/  BalanceCard / CheckInBar / BottomNav / RewardToast / GameCard ...
```

## 分层规则

UI → `services/*` → `api/client` →(mock 或后端)。
**发币只能经 `reward.earn()`**;所有可调数值进 `config`;后端未接时 `USE_MOCK=true`,接后端只改 services,页面无感。

## 部署清单

- `public/tonconnect-manifest.json` 换成正式域名与图标。
- `src/services/referral.js` 的 `TG_BOT` / `TG_APP` 换成真实 bot。
- 后端 `server/.env`:`JWT_SECRET` 换强随机、配 `TELEGRAM_BOT_TOKEN`、TON 热钱包(见 `server/README.md`)。
- 后端数据层 `server/src/lib/store.js` 换成真实 DB(提现要事务)。
- 支付当前仅 TON,其他渠道预留。

## 开发辅助(Claude Code)

- 项目级技能见 `.claude/skills/`(overview / adops / reward-economy / ton-payments / telegram-miniapp),改代码前按需读。
- MCP 见 `.mcp.json` 与 `.claude/MCP.md`(playwright 验证 UI、context7 查文档)。
