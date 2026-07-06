// ===== 广告 SDK(仅 Adsterra + OnClick) =====
// 配置见 src/config/ads.js;发币只经 services/reward.js,勿在此直接发币。
import { loadScript } from '@/utils/index.js'
import { track } from '@/utils/event.js'
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

// ===== 激励广告(看广告赚币核心) =====
// show() resolve(true) 表示「有效观看」,调用方据此发币;
// 当前用 Popunder + 最短停留时长模拟激励,真实激励接入后替换 present() 即可。
export const RewardedAd = {
  minWatchMs: 5000, // 最短有效观看

  async show() {
    track.adShow('rewarded')
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
