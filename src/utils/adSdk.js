// ===== 广告 SDK(仅 Adsterra + OnClick) =====
// 配置见 src/config/ads.js;发币只经 services/reward.js,勿在此直接发币。
import { loadScript } from '@/utils/index.js'
import { track } from '@/utils/event.js'
import { platform } from '@/utils/platform.js'
import { ADSTERRA, ONCLICK } from '@/config/ads.js'

export const AdsterraAd = {
  adQueue: [],
  isLoading: false,

  runNext() {
    if (this.isLoading || this.adQueue.length === 0) return
    this.isLoading = true
    this.adQueue.shift()()
  },
  enqueue(task) {
    this.adQueue.push(task)
    this.runNext()
  },

  // 队列化 banner,避免并发抢占 window.atOptions
  showBanner(containerId, options, scriptSrc) {
    const container = document.getElementById(containerId)
    if (!container) return
    this.enqueue(() => {
      window.atOptions = options
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = scriptSrc
      script.async = true
      script.onload = script.onerror = () => {
        setTimeout(() => {
          this.isLoading = false
          this.runNext()
        }, 120)
      }
      container.appendChild(script)
      track.adShow('adsterra_banner')
    })
  },

  showSocialBar() {
    return loadScript(ADSTERRA.socialBar).catch(() => {})
  },
  showNativeBanner() {
    return loadScript(ADSTERRA.nativeInvoke).catch(() => {})
  },
  showPopunder() {
    track.adShow('adsterra_popunder')
    return loadScript(ADSTERRA.popunder).catch(() => {})
  },

  // 底部锚点 320x50
  showAnchor(anchorId = 'adsterra-anchor-1-box') {
    const anchorDom = document.getElementById(anchorId)
    if (!anchorDom || anchorDom.dataset.loaded) return
    anchorDom.dataset.loaded = '1'
    window.atOptions = {
      key: ADSTERRA.anchorKey,
      format: 'iframe',
      height: 50,
      width: 320,
      params: {},
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = ADSTERRA.anchorInvoke
    anchorDom.appendChild(script)
    track.adShow('adsterra_anchor')
  },
}

export const OnClickA = {
  showBanner(zone = ONCLICK.bannerZone) {
    if (document.querySelector(`script[data-admpid="${zone}"]`)) return
    const script = document.createElement('script')
    script.async = true
    script.src = ONCLICK.loader
    script.dataset.admpid = zone
    document.head.appendChild(script)
    track.adShow('onclick_banner')
  },
  loadAdManager() {
    if (document.querySelector(`script[data-admpid="${ONCLICK.adManagerZone}"]`)) return
    const script = document.createElement('script')
    script.setAttribute('data-cfasync', 'false')
    script.setAttribute('data-admpid', ONCLICK.adManagerZone)
    script.async = true
    script.src = ONCLICK.adManager
    document.head.appendChild(script)
  },
}

// ===== OnClick TMA 激励(reward)广告 =====
// 官方集成:加载 in-stream tma.js -> window.initCdTma({id}) -> Promise<show>
//          -> window.show() -> Promise(看完 resolve)。无需容器 div。
// ⚠️ tg_app 类型广告通常只在 Telegram 小程序内才能真正展示。
export const OnClickReward = {
  loaded: false,
  _showFn: null, // 预加载好的 show 函数;为 null 表示还没备好广告
  _preloading: null, // 进行中的预加载 Promise(防并发重复 init)

  // 是否已备好一支广告(可即时播放)
  get ready() {
    return !!this._showFn
  },

  load() {
    // index.html 的 <head> 已静态引入 tma.js;这里兜底,避免重复注入
    if (this.loaded || document.querySelector(`script[src="${ONCLICK.rewardTmaScript}"]`)) {
      this.loaded = true
      return
    }
    const s = document.createElement('script')
    s.src = ONCLICK.rewardTmaScript
    document.head.appendChild(s)
    this.loaded = true
  },

  // 等待 initCdTma 就绪
  _waitInit(timeout = 8000) {
    return new Promise((resolve, reject) => {
      const start = Date.now()
      const t = setInterval(() => {
        if (typeof window.initCdTma === 'function') {
          clearInterval(t)
          resolve()
        } else if (Date.now() - start > timeout) {
          clearInterval(t)
          reject(new Error('reward SDK 未就绪(initCdTma 未出现)'))
        }
      }, 200)
    })
  },

  // 预加载:提前 initCdTma 备好一支广告,缓存 show。幂等、可重复调用。
  preload() {
    if (this._showFn) return Promise.resolve(this._showFn)
    if (this._preloading) return this._preloading
    this._preloading = (async () => {
      this.load()
      await this._waitInit()
      const show = await window.initCdTma({ id: Number(ONCLICK.rewardSpotId) })
      this._showFn = show
      window.show = show
      return show
    })()
      .catch((e) => {
        track.adError('reward_preload')
        throw e
      })
      .finally(() => {
        this._preloading = null
      })
    return this._preloading
  },

  // 展示激励广告;resolve(true) 表示用户看完拿到奖励。
  async show() {
    track.adShow('onclick_reward')
    const showFn = await this.preload() // 已预加载则立即返回
    try {
      await showFn()
      track.adRewardComplete()
      return true
    } finally {
      // 一支广告播完即失效,清掉并预加载下一支,保证下次点击即时
      this._showFn = null
      this.preload().catch(() => {})
    }
  },
}

// ===== 激励广告(看广告赚币核心,全站统一入口) =====
// show() resolve(true) 表示「有效观看」,调用方据此发币。
// Telegram 内:走 OnClick 真·TMA 激励广告;web:回退 Popunder + 最短停留时长。
export const RewardedAd = {
  minWatchMs: 5000, // web 回退的最短有效观看

  async show() {
    // Telegram 小程序:真实激励广告(tg_app)
    if (platform.isTelegram) {
      try {
        return await OnClickReward.show()
      } catch (e) {
        track.adError('reward_tma')
        // 无填充/失败则落到下面的回退
      }
    }
    // web 或 TMA 失败:Popunder + 计时(占位,防刷靠后端)
    track.adShow('rewarded_fallback')
    try {
      await this._present()
      const ok = await this._waitWatched()
      if (ok) track.adRewardComplete()
      return ok
    } catch (e) {
      track.adError('rewarded')
      return false
    }
  },

  // 展示广告载体(可替换为真实激励视频 SDK)
  async _present() {
    // 优先 OnClick 广告,回退 Adsterra Popunder
    OnClickA.showBanner(ONCLICK.videoZone)
    await AdsterraAd.showPopunder()
  },

  // 最短观看时长校验(前端第一道防刷,后端二次校验)
  _waitWatched() {
    return new Promise((resolve) => {
      const start = Date.now()
      let elapsed = 0
      const onHide = () => (elapsed += Date.now() - start)
      document.addEventListener('visibilitychange', onHide)
      setTimeout(() => {
        document.removeEventListener('visibilitychange', onHide)
        resolve(Date.now() - start >= this.minWatchMs)
      }, this.minWatchMs)
    })
  },
}
