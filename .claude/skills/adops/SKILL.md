---
name: adops
description: 在 TTEarn 项目里管理广告(仅 Adsterra 与 OnClick)与「看广告赚币」的激励广告流程。当任务涉及:新增/修改广告位、banner/social bar/popunder/native、激励视频看完发积分、广告 key 或 zone 变更、广告相关 GA 埋点时使用。
---

# 广告运营(Adsterra + OnClick)

本项目**只保留两家广告**:Adsterra 和 OnClick。Monetag、ExoClick、BeMob、成人广告、smartLink 联盟直链已全部移除,不要再引入。

## 唯一配置来源

所有广告 key / zone / 脚本地址在 `src/config/ads.js`(`ADSTERRA`、`ONCLICK`)。
**改广告位只改这里**,业务代码引用常量,禁止在组件里写死 URL 或 key。

## 广告 SDK:`src/utils/adSdk.js`

- `AdsterraAd`:`showBanner(containerId, options, src)`、`showAnchor()`、`showSocialBar()`、`showNativeBanner()`、`showPopunder()`。内部有队列 + 防风控缓冲(120ms),多个 banner 用 `enqueue`,不要并发抢 `window.atOptions`。
- `OnClickA`:`showBanner()`、`loadAdManager()`。用 `data-admpid` 区分 zone。
- `RewardedAd`:激励广告(看广告赚币核心),见下。

## 加一个展示型 banner

1. 在 `config/ads.js` 加 key。
2. 模板里放容器 `<div id="my-banner-box"></div>`。
3. `onMounted` 里 `AdsterraAd.showBanner('my-banner-box', { key, format:'iframe', width, height, params:{} }, ADSTERRA.bannerInvoke)`。

## 看广告赚币(激励广告)—— 核心变现

看广告发币**必须**走 `RewardedAd.show()`,它保证「先看完、后发币」并防刷:

```js
import { RewardedAd } from '@/utils/adSdk.js'
import { earn } from '@/services/reward.js'
import { ECONOMY } from '@/config/index.js'

async function onWatchAd() {
  const ok = await RewardedAd.show()          // 展示广告,resolve 表示有效观看
  if (!ok) return                              // 未看完/加载失败 → 不发币
  await earn('watch_ad', ECONOMY.reward.watchAd) // 只经 reward 服务发币
}
```

约束:
- **发币只经 `services/reward.js` 的 `earn()`**,不要在广告回调里直接改余额。
- 每日次数上限 `ECONOMY.watchAdDailyLimit`,由 reward 服务/后端校验,前端也要禁用按钮。
- 广告加载失败要有回退(如 Popunder),但**回退不发币**,避免刷量。

## 埋点(GA)

广告相关事件走 `src/utils/event.js`:
- 展示:`ad_show`,value=广告类型
- 激励看完:`ad_reward_complete`
- 关闭/失败:`ad_close` / `ad_error`

## 反作弊要点(前端能做的)

- 激励广告加最短观看时长校验(后端二次校验)。
- 发币请求带幂等 token(reward 服务生成),防重复上报。
- 真实发放金额以**后端**为准,前端只做乐观更新。
