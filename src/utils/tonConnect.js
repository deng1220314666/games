// ===== TON Connect 封装 =====
// 通过 CDN 懒加载 @tonconnect/ui，避免打包依赖；连接钱包、读地址、发起转账。
// 真实提现打款走后端，这里负责「连钱包 + 展示 + 用户侧签名」。
import { TON } from '@/config/index.js'
import { loadScript } from '@/utils/index.js'

const CDN = 'https://unpkg.com/@tonconnect/ui@2/dist/tonconnect-ui.min.js'

let _ui = null
let _loading = null

// 懒加载并单例化 TonConnectUI
async function getUI() {
  if (_ui) return _ui
  if (_loading) return _loading

  _loading = (async () => {
    if (!window.TON_CONNECT_UI) {
      await loadScript(CDN, 'TonConnect')
    }
    const TonConnectUI = window.TON_CONNECT_UI?.TonConnectUI
    if (!TonConnectUI) throw new Error('TonConnectUI 加载失败')

    _ui = new TonConnectUI({
      manifestUrl: TON.manifestUrl,
    })
    return _ui
  })()

  return _loading
}

export const tonConnect = {
  // 是否已连接
  isAvailable() {
    return typeof window !== 'undefined'
  },

  // 弹出连接钱包
  async connect() {
    const ui = await getUI()
    if (ui.connected) return this.currentWallet(ui)
    await ui.openModal()
    return new Promise((resolve) => {
      const unsub = ui.onStatusChange((w) => {
        if (w) {
          unsub()
          resolve(this.currentWallet(ui))
        }
      })
    })
  },

  async disconnect() {
    const ui = await getUI()
    await ui.disconnect()
  },

  // 当前钱包信息
  currentWallet(ui = _ui) {
    if (!ui || !ui.account) return null
    return {
      address: ui.account.address, // 原始 raw 地址
      chain: ui.account.chain,
      publicKey: ui.account.publicKey,
    }
  },

  // 监听连接状态变化，返回取消函数
  async onChange(cb) {
    const ui = await getUI()
    return ui.onStatusChange((w) => cb(w ? this.currentWallet(ui) : null))
  },

  // 发起一笔 TON 转账（充值 / 上链场景），金额单位 nanoTON
  async sendTransaction({ to, amountNano, payload }) {
    const ui = await getUI()
    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [{ address: to, amount: String(amountNano), payload }],
    }
    return ui.sendTransaction(tx)
  },
}

// TON <-> nanoTON
export const toNano = (ton) => String(Math.round(Number(ton) * 1e9))
export const fromNano = (nano) => Number(nano) / 1e9
