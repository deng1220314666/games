// ===== GA 埋点(gtag) + 网赚事件 =====
import { IS_PROD } from '@/config/index.js'

let gaLoaded = false
const GA_ID = 'G-JNMVKZ8RCM'

export function initGA() {
  if (!IS_PROD) return false
  if (gaLoaded) return
  gaLoaded = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID, { send_page_view: true })
}

// 通用事件
export const gaLogEvent = {
  logEvent({ eventName, eventValue, eventLog }) {
    if (!IS_PROD) {
      console.log(`【event】${eventName} value=${eventValue} ${eventLog || ''}`)
      return
    }
    if (!eventName || !window?.gtag) return
    if (eventValue !== undefined) {
      window.gtag('event', eventName, { value: eventValue })
    } else {
      window.gtag('event', eventName)
    }
  },
}

// ===== 网赚业务事件(语义化封装) =====
export const track = {
  earn(source, amount) {
    gaLogEvent.logEvent({ eventName: 'earn', eventValue: amount, eventLog: source })
    gaLogEvent.logEvent({ eventName: `earn_${source}`, eventValue: amount })
  },
  checkIn(streak) {
    gaLogEvent.logEvent({ eventName: 'daily_checkin', eventValue: streak })
  },
  adShow(type) {
    gaLogEvent.logEvent({ eventName: 'ad_show', eventValue: type })
  },
  adRewardComplete() {
    gaLogEvent.logEvent({ eventName: 'ad_reward_complete' })
  },
  adError(type) {
    gaLogEvent.logEvent({ eventName: 'ad_error', eventValue: type })
  },
  withdrawRequest(amountTon) {
    gaLogEvent.logEvent({ eventName: 'withdraw_request', eventValue: amountTon })
  },
  walletConnect() {
    gaLogEvent.logEvent({ eventName: 'wallet_connect' })
  },
  invite() {
    gaLogEvent.logEvent({ eventName: 'invite_share' })
  },
  page(name) {
    gaLogEvent.logEvent({ eventName: 'enter_page', eventValue: name })
  },
}
