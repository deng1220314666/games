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

  // 预加载 SDK 脚本(仅 tma.js 本身,不拉广告)。
  // index.html 的 <head> 已静态引入,这里兜底/去重;可在进页面时调。
  load() {
    if (this.loaded || document.querySelector(`script[src="${ONCLICK.rewardTmaScript}"]`)) {
      this.loaded = true
      return
    }
    const s = document.createElement('script')
    s.src = ONCLICK.rewardTmaScript
    document.head.appendChild(s)
    this.loaded = true
  },

  // 等待 initCdTma 就绪(脚本加载完)
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

  // 展示激励广告(点击时才拉广告):initCdTma({id}) → show()。
  // resolve(true)=看完拿奖励;失败抛错(调用方据此不发币)。
  async show() {
    track.adShow('onclick_reward')
    this.load()
    await this._waitInit()

    let showFn
    try {
      showFn = await window.initCdTma({ id: Number(ONCLICK.rewardSpotId) })
    } catch (e) {
      track.adError('reward_init')
      throw new Error('拉取广告失败:' + (e?.message || e))
    }
    if (typeof showFn !== 'function') {
      track.adError('reward_nofill')
      throw new Error('NO_FILL:暂无广告填充')
    }
    window.show = showFn

    try {
      await showFn()
      track.adRewardComplete()
      return true
    } catch (e) {
      // SDK 内部报错(常见于无填充/会话失效,如 "e is not a function")
      throw new Error('广告播放失败(可能无填充或会话已失效):' + (e?.message || e))
    }
  },
}

// ===== 激励广告(看广告赚币核心,全站统一入口) =====
// show() resolve(true) 表示「有效观看」,调用方据此发币。
// 只走 OnClick 真·TMA 激励广告(tg_app);非 Telegram 环境不可用,
// 不再加载 Adsterra popunder,避免无关的 403 请求。
export const RewardedAd = {
  async show() {
    if (!platform.isTelegram) {
      track.adError('reward_no_tg') // 需在 Telegram 小程序内
      return false
    }
    try {
      return await OnClickReward.show()
    } catch (e) {
      track.adError('reward_tma') // 无填充 / 播放失败 → 不发币
      return false
    }
  },

  // 只预加载 SDK 脚本(不拉广告),供页面进入时调用
  preloadSdk() {
    OnClickReward.load()
  },
}
