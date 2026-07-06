// ===== 钱包 / 提现 =====
// 真实打款走后端;前端提现 = 生成申请 + 乐观扣币。
// BACKEND: POST /wallet/withdraw { amountTon, address } -> { id, status }
//          GET  /wallet/balance -> { tonBalance }
import { useUserStore } from '@/stores/userStore.js'
import { useWalletStore } from '@/stores/walletStore.js'
import { ECONOMY, USE_MOCK } from '@/config/index.js'
import { client } from '@/api/client.js'
import { spend } from '@/services/reward.js'
import { tonConnect } from '@/utils/tonConnect.js'
import { track } from '@/utils/event.js'

// 连接 TON 钱包
export async function connectWallet() {
  const wallet = useWalletStore()
  const w = await tonConnect.connect()
  wallet.setWallet(w)
  if (w) {
    track.walletConnect()
    refreshTonBalance()
  }
  return w
}

export async function disconnectWallet() {
  const wallet = useWalletStore()
  await tonConnect.disconnect().catch(() => {})
  wallet.setWallet(null)
}

// 恢复已连接的钱包(页面加载时调)
export async function restoreWallet() {
  const wallet = useWalletStore()
  try {
    await tonConnect.onChange((w) => wallet.setWallet(w))
    const cur = tonConnect.currentWallet()
    if (cur) wallet.setWallet(cur)
  } catch (e) {
    /* TON Connect 未就绪,忽略 */
  }
}

// 校验能否提现
export function canWithdraw(amountTon) {
  const user = useUserStore()
  const wallet = useWalletStore()
  if (!wallet.connected) return { ok: false, reason: 'no_wallet' }
  if (amountTon < ECONOMY.minWithdrawTon) return { ok: false, reason: 'below_min' }
  const needCoins = amountTon * ECONOMY.coinPerTon
  if (user.balance < needCoins) return { ok: false, reason: 'insufficient' }
  return { ok: true, needCoins }
}

export async function requestWithdraw(amountTon) {
  const user = useUserStore()
  const wallet = useWalletStore()
  const check = canWithdraw(amountTon)
  if (!check.ok) return { ok: false, reason: check.reason }

  const record = {
    id: `wd_${Date.now()}`,
    amountTon,
    address: wallet.address,
    fee: ECONOMY.withdrawFeeTon,
    status: 'pending',
    time: Date.now(),
  }

  if (!USE_MOCK) {
    try {
      const res = await client.post('/wallet/withdraw', {
        amountTon,
        address: wallet.address,
      })
      record.id = res.id
      record.status = res.status || 'pending'
      user.balance = res.balance // 后端已扣币,余额以后端为准
    } catch (e) {
      const reason = e?.response?.data?.error || 'network'
      return { ok: false, reason }
    }
  } else {
    await spend(check.needCoins) // mock 模式本地扣币
  }

  wallet.addWithdrawal(record)
  track.withdrawRequest(amountTon)
  return { ok: true, record }
}

// 拉取链上余额(mock 返回 0,接后端/toncenter 后替换)
export async function refreshTonBalance() {
  const wallet = useWalletStore()
  if (!wallet.connected) return 0
  if (!USE_MOCK) {
    try {
      const res = await client.get('/wallet/balance', { params: { address: wallet.address } })
      wallet.tonBalance = res.tonBalance
    } catch (e) {
      /* noop */
    }
  }
  return wallet.tonBalance
}
