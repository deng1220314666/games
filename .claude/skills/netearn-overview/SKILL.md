---
name: netearn-overview
description: 本仓库(TTEarn 网赚平台)的架构总览与开发约定。任何在本项目里改代码、加功能、排查问题前都应先读。覆盖:双端(Telegram 小程序 + 独立 H5)、目录结构、Store/服务分层、经济系统、广告与埋点、TON 支付。当任务涉及本仓库整体结构、加新页面、加新功能、不确定某逻辑放哪时使用。
---

# TTEarn 网赚平台 — 架构总览

一个「玩游戏 / 看广告 / 做任务 / 拉好友 → 赚积分 → 提现到 TON 钱包」的网赚应用。
**同一套代码同时跑在 Telegram 小程序内和普通浏览器 H5**,运行时探测环境。

## 前后端分离(重要)

- **前端**:仓库根,Vue 3 + Vite(端口 8888)。只做 UI + 调用后端。
- **后端**:`server/`,独立 Node/Express 项目(端口 3000)。账本、发币规则、签到、提现打款、鉴权都在这里,是**权威来源**。改后端用 `backend-api` 技能。
- 前端 `VITE_USE_MOCK=false` + `VITE_API_BASE_URL` 指后端即接入;`true` 时前端自带 mock,可脱离后端演示。业务规则**不要**写回前端。

技术栈(前端):Vue 3 (Composition API) + Vite + Pinia(持久化) + vue-router + vue-i18n + Tailwind。

## 双端运行模型(最重要)

- 用 `src/utils/platform.js` 的 `platform.isTelegram` / `platform.type` 判断环境,**不要**在业务里直接读 `window.Telegram`。
- 登录鉴权:
  - Telegram:用 `getTelegramAuth().initData`(原始串)交后端校验 hash,免密登录。
  - Web:匿名 ID / 手机号 / 邮箱(后端未接前用本地生成的匿名 ID)。
- 邀请码统一走 `getStartParam()`:TG 取 `start_param`,web 取 url 的 `?ref=`。
- Telegram 专有能力(震动 `haptic()`、分享 `shareInvite()`)在 web 下静默降级,调用方无需判断。

## 目录结构与职责

| 路径 | 职责 |
|---|---|
| `src/config/index.js` | 全局配置:经济参数 `ECONOMY`、`TON`、`APP`、`TABS`、`USE_MOCK`。**所有可调数值集中在此** |
| `src/config/ads.js` | 广告位 key / zone(Adsterra + OnClick),业务不写死 |
| `src/utils/platform.js` | 环境探测(TG/web),初始化,震动 |
| `src/utils/telegram.js` | Telegram WebApp 封装:鉴权、用户、启动参数、分享 |
| `src/utils/tonConnect.js` | TON Connect 懒加载封装:连钱包 / 读地址 / 转账 / nano 换算 |
| `src/utils/adSdk.js` | 广告 SDK(仅 Adsterra + OnClick),含激励广告 |
| `src/utils/event.js` | GA 埋点(gtag)。网赚事件用 `trackEarn` 系列 |
| `src/services/` | **业务服务层**:user / reward / task / wallet / referral。前端只调这里,内部走 mock 或后端 |
| `src/api/client.js` | axios 实例 + mock 开关 |
| `src/api/mock.js` | 游戏 / 分类静态数据 |
| `src/stores/` | Pinia:`userStore`(账户/余额/邀请)、`walletStore`(TON)、`gameStore`(游戏) |
| `src/views/` | 页面:Home / Task / Wallet / Mine / GameDetail / PrivacyPolicy |
| `src/components/` | 复用组件 |

## Telegram 视觉风格(UI 令牌)

界面按 Telegram 原生风格,**只用主题令牌,禁止硬编码颜色**:

- 令牌在 `src/styles/index.scss`,接 `--tg-theme-*`(Telegram 内自动跟随用户深/浅主题),web 有浅/深回退。
- Tailwind 用 `bg-tg-bg` / `bg-tg-secondary` / `bg-tg-section` / `text-tg-text` / `text-tg-hint` / `text-tg-button` / `border-tg-separator` 等;强调色一律 `var(--tg-button)`。
- 布局用 iOS 分组列表:屏幕底 `bg-tg-secondary`,内容放 `.tg-section` 圆角卡,行用 `.tg-row`(≥48px 触控),区头用 `.tg-section-header`(hint 色大写)。复用组件 `TgSection.vue` / `TgRow.vue`。
- **结构图标用内联 SVG,不用 emoji**(BottomNav / 菜单 / 任务图标已是 SVG)。金额/计数加 `.tabular` 等宽数字。
- 主题同步在 `utils/platform.js`(setHeaderColor/背景/themeChanged)。深浅色都要能看。

## 分层规则(改代码前必读)

1. **页面/组件** 不直接发请求、不直接算奖励。UI → `services/*` → `api/client` →(mock 或后端)。
2. **发积分只能走 `services/reward.js` 的 `earn()`**。它统一:更新 store 余额 + 记流水 + 上报 GA + 调后端。任何地方要发币都调它,禁止直接改 `userStore.balance`。
3. **所有可调数值进 `config`**,不要散落魔法数。
4. **后端未接时** `USE_MOCK=true`,services 走本地 mock 实现;接后端时把 mock 分支换成 `client` 调用即可,页面零改动。

## 相关技能

- 加/改广告、激励广告发币 → 用 `adops` 技能
- 加赚币方式、改奖励规则、提现规则 → 用 `reward-economy` 技能
- TON 连钱包 / 提现 / 上链 → 用 `ton-payments` 技能
- Telegram 小程序适配、initData 登录、分享 → 用 `telegram-miniapp` 技能

## 命令

- 开发:`npm run dev`(端口 8888)
- 构建:`npm run build`
- 预览:`npm run preview`

## 后端

后端已实现,在 `server/`(独立 Node/Express 项目)。前端服务层每个文件顶部 `// BACKEND:` 注释标出对应端点。TON 真实打款、initData 校验、反作弊都在后端。详见 `backend-api` 技能与 `server/README.md`。
