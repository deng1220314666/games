// TON 打款(占位;真实打款按 TODO 装 @ton/ton)
import { env } from '../env.js'

const hasWallet = !!env.ton.mnemonic
export function payoutEnabled() {
  return hasWallet
}

export async function payout({ toAddress, amountTon }) {
  if (!hasWallet) return { ok: true, status: 'pending' }
  // TODO: 装 @ton/ton @ton/crypto,用热钱包给 toAddress 转 amountTon
  return { ok: true, status: 'pending' }
}

export async function getBalance() {
  return 0
}
