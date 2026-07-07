// ===== 广告 SDK(仅 Adsterra + OnClick) =====
// 配置见 src/config/ads.js;发币只经 services/reward.js,勿在此直接发币。
import { loadScript } from '@/utils/index.js'
import { track } from '@/utils/event.js'
import { ADSTERRA, ONCLICK, GIGAPUB, ADS3 } from '@/config/ads.js'

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
// GigaPub 官方集成:head 引入 script?id=<id> -> window.showGiga(placement)
//   -> Promise(看完 resolve;失败/无填充 reject)。无需容器 div。
export const GigaReward = {
  loaded: false,

  // 加载 SDK 脚本(index.html <head> 已静态引入,这里兜底/去重)
  load() {
    if (this.loaded || document.querySelector(`script[src="${GIGAPUB.script}"]`)) {
      this.loaded = true
      return
    }
    const s = document.createElement('script')
    s.src = GIGAPUB.script
    document.head.appendChild(s)
    this.loaded = true
  },

  // 等待 showGiga 就绪(脚本加载完)
  _waitReady(timeout = 8000) {
    return new Promise((resolve, reject) => {
      const start = Date.now()
      const t = setInterval(() => {
        if (typeof window.showGiga === 'function') {
          clearInterval(t)
          resolve()
        } else if (Date.now() - start > timeout) {
          clearInterval(t)
          reject(new Error('Giga SDK 未就绪(showGiga 未出现)'))
        }
      }, 200)
    })
  },

  // 展示激励广告(点击时才拉广告):showGiga(placement)。
  // resolve(true)=看完拿奖励;失败抛错(调用方据此不发币)。
  async show() {
    track.adShow('giga_reward')
    this.load()
    await this._waitReady()
    try {
      await window.showGiga(GIGAPUB.placement)
      track.adRewardComplete()
      return true
    } catch (e) {
      track.adError('giga_reward') // 无填充 / 播放失败
      throw new Error('广告播放失败(可能无填充):' + (e?.message || e))
    }
  },
}

// ===== ads3 (ton-ai-sdk) 激励广告 =====
// 官方:TonAdInit({appId,debug}) → TonAdPopupShow({blockId,onAdClick,onAdError})
// 奖励在 onAdClick 里发放(文档口径)。
export const Ads3Reward = {
  loaded: false,
  inited: false,
  _loadPromise: null,

  // 按顺序加载依赖(axios/React17/ReactDOM17/ClientJS)后再加载 SDK。幂等、缓存。
  load() {
    if (this._loadPromise) return this._loadPromise
    this._loadPromise = (async () => {
      if (!document.querySelector(`link[href="${ADS3.css}"]`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = ADS3.css
        document.head.appendChild(link)
      }
      for (const url of ADS3.deps) {
        await loadScript(url) // 顺序加载,react-dom 依赖 react 先就位
      }
      await loadScript(ADS3.js)
      this.loaded = true
    })()
    return this._loadPromise
  },

  // 等待 window.TonAISdk 就绪
  _waitReady(timeout = 8000) {
    return new Promise((resolve, reject) => {
      const start = Date.now()
      const t = setInterval(() => {
        if (window.TonAISdk && typeof window.TonAISdk.TonAdPopupShow === 'function') {
          clearInterval(t)
          resolve()
        } else if (Date.now() - start > timeout) {
          clearInterval(t)
          reject(new Error('ads3 SDK 未就绪(TonAISdk 未出现)'))
        }
      }, 200)
    })
  },

  async _ensureInit() {
    await this.load()
    await this._waitReady()
    if (!this.inited) {
      if (!ADS3.appId) throw new Error('缺少 appId:请在 config/ads.js 的 ADS3.appId 填 ads3 后台的 AppId')
      window.TonAISdk.TonAdInit({ appId: ADS3.appId, debug: ADS3.debug })
      this.inited = true
    }
  },

  // 弹窗广告统一执行:param = { blockId } 或 { tonAd }
  // resolve(true)=看完(onAdComplete,发奖);resolve(false)=手动关闭(未看完,不发奖);
  // reject=错误。
  _popup(param) {
    return new Promise((resolve, reject) => {
      let settled = false
      const done = (v) => {
        if (!settled) {
          settled = true
          resolve(v)
        }
      }
      window.TonAISdk.TonAdPopupShow({
        ...param,
        countdown: ADS3.countdown,
        autoClose: true,
        onAdComplete: () => {
          track.adRewardComplete()
          done(true) // 看完 → 发奖
        },
        onAdClose: () => done(false), // 手动关闭 → 不发奖
        onAdError: (err) => {
          if (!settled) {
            settled = true
            track.adError('ads3')
            reject(new Error('广告错误:' + (err?.message || JSON.stringify(err))))
          }
        },
      })
    })
  },

  // 激励广告(按 blockId 直接拉一支弹窗)
  async show() {
    track.adShow('ads3_reward')
    await this._ensureInit()
    return this._popup({ blockId: ADS3.blockId })
  },

  // 拉取一组原生广告数据(自己渲染成任务/banner):{ ads: [{ adId, image, icon, brandName, text, buttonText, ... }] }
  async getAds(limit = 5) {
    await this._ensureInit()
    return window.TonAISdk.GetMultiTonAd(ADS3.blockId, limit)
  },

  // 展示指定的一条广告(原生任务点击时用),看完(onAdComplete)发奖
  async showAd(tonAd) {
    track.adShow('ads3_native')
    await this._ensureInit()
    return this._popup({ tonAd })
  },
}

// ===== 激励广告(看广告赚币核心,全站统一入口) =====
// show() resolve(true) 表示「有效观看」,调用方据此发币。走 GigaPub 激励广告。
export const RewardedAd = {
  async show() {
    try {
      return await GigaReward.show()
    } catch (e) {
      track.adError('reward') // 无填充 / 播放失败 → 不发币
      return false
    }
  },

  // 只加载 SDK 脚本(不拉广告),供页面进入时调用
  preloadSdk() {
    GigaReward.load()
  },
}
