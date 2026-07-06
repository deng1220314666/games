// ===== 运行环境探测：Telegram 小程序 vs 独立 H5 =====
// 单一入口，业务代码用 platform.isTelegram 判断，不要各处读 window.Telegram。

let _tg = null

function detectTelegram() {
  if (typeof window === 'undefined') return null
  const tg = window.Telegram && window.Telegram.WebApp
  // initData 非空才算真正跑在 Telegram 客户端里
  if (tg && tg.initData) return tg
  return null
}

export const platform = {
  // 'telegram' | 'web'
  get type() {
    return detectTelegram() ? 'telegram' : 'web'
  },
  get isTelegram() {
    return this.type === 'telegram'
  },
  get isWeb() {
    return this.type === 'web'
  },
  // 原始 Telegram.WebApp 对象（可能为 null）
  get tg() {
    if (!_tg) _tg = detectTelegram()
    return _tg
  },
}

// 初始化：在 App 挂载时调一次
export function initPlatform() {
  const tg = platform.tg
  if (tg) {
    try {
      tg.ready()
      tg.expand()
      // 关闭下拉关闭确认，网赚场景避免误退出
      tg.enableClosingConfirmation && tg.enableClosingConfirmation()
      // 头部/背景跟随分组列表底色(secondary),与页面一致
      tg.setHeaderColor && tg.setHeaderColor('secondary_bg_color')
      tg.setBackgroundColor && tg.setBackgroundColor('secondary_bg_color')
      tg.onEvent &&
        tg.onEvent('themeChanged', () => {
          document.documentElement.dataset.tgColorScheme = tg.colorScheme
        })
      document.documentElement.dataset.tgColorScheme = tg.colorScheme
    } catch (e) {
      console.warn('[platform] telegram init error', e)
    }
  }
  return platform.type
}

// 轻震动反馈（Telegram 内有效，web 静默）
export function haptic(style = 'light') {
  const tg = platform.tg
  if (tg && tg.HapticFeedback) {
    try {
      tg.HapticFeedback.impactOccurred(style)
    } catch (e) {
      /* noop */
    }
  }
}
