---
name: telegram-miniapp
description: TTEarn 的 Telegram 小程序适配约定 —— 双端探测、initData 免密登录、启动参数/邀请码、主题/安全区、分享、震动。当任务涉及:Telegram 小程序特性、initData 鉴权、TG 内分享邀请、TG 与浏览器行为差异、WebApp SDK 时使用。
---

# Telegram 小程序适配

同一套代码同时跑 **Telegram 小程序** 和 **独立浏览器 H5**,运行时探测,不分叉两套代码。

## 探测:`src/utils/platform.js`

```js
import { platform, initPlatform, haptic } from '@/utils/platform.js'

platform.isTelegram   // 是否在 Telegram 客户端(initData 非空才算)
platform.type         // 'telegram' | 'web'
initPlatform()        // App 挂载时调一次:ready/expand/关闭确认
haptic('light')       // 震动,web 下静默
```

判断环境**只用** `platform.*`,不要各处读 `window.Telegram`。

## 登录鉴权:`src/utils/telegram.js`

- Telegram:`getTelegramAuth().initData` → **交后端校验 hash** 后签发会话。前端 `initDataUnsafe` 只用于展示,不可信任。
- Web:无 initData,用匿名 ID(后端未接前本地生成)/手机/邮箱。
- `getTelegramUser()` 统一取用户资料(TG 优先,web 返回 null 由上层兜底)。

登录逻辑在 `services/user.js` 的 `login()`:内部按 `platform.type` 选鉴权方式,页面不感知差异。

## 邀请码 / 启动参数

统一 `getStartParam()`:TG 读 `start_param`,web 读 `?ref=` / `?startapp=`。
邀请链接生成两份:
- TG:`https://t.me/<bot>/<app>?startapp=<code>`
- Web:`https://<域名>/?ref=<code>`

## 分享

`shareInvite(link, text)`:TG 内走 `openTelegramLink` 分享;web 走 `navigator.share` 或复制。调用方不用判断环境。

## UI 注意

- 顶部留 TG 头部安全区,底部导航留 `env(safe-area-inset-bottom)`。
- 主题色可读 `tg.themeParams` 适配深浅色(可选)。
- TG 里外链要用 `tg.openLink` / `openTelegramLink`,普通 `window.open` 在部分客户端被拦。

## index.html

需引入 Telegram WebApp SDK:`<script src="https://telegram.org/js/telegram-web-app.js"></script>`(在 `#app` 之前)。web 环境下该脚本无副作用。

## 相关

- 连钱包/提现 → `ton-payments` 技能
- 邀请返佣 → `reward-economy` 技能
