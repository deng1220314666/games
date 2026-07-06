// ===== TON 打款 / 余额 =====
// 提现审核通过后由后端从热钱包给用户打款。
// 为保持零重依赖,这里默认是「记账占位」实现;接真实链上时按下方 TODO 引入 @ton/ton。
import { config } from '../config.js'

const hasWallet = !!config.ton.mnemonic

// 是否具备真实打款能力
export function payoutEnabled() {
  return hasWallet
}

/**
 * 给用户地址打款
 * @returns {Promise<{ok:boolean, txHash?:string, status:string}>}
 */
export async function payout({ toAddress, amountTon }) {
  if (!hasWallet) {
    // 未配置热钱包:仅落 pending,由人工/后续任务处理
    return { ok: true, status: 'pending' }
  }

  // TODO: 真实打款(需要 `npm i @ton/ton @ton/crypto @ton/core`)
  //
  // import { TonClient, WalletContractV4, internal } from '@ton/ton'
  // import { mnemonicToPrivateKey } from '@ton/crypto'
  // const key = await mnemonicToPrivateKey(config.ton.mnemonic.split(' '))
  // const client = new TonClient({ endpoint, apiKey: config.ton.toncenterKey })
  // const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey })
  // const contract = client.open(wallet)
  // const seqno = await contract.getSeqno()
  // await contract.sendTransfer({ seqno, secretKey: key.secretKey,
  //   messages: [internal({ to: toAddress, value: String(amountTon), bounce: false })] })
  // return { ok: true, status: 'done', txHash: '...' }

  return { ok: true, status: 'pending' }
}

// 查询某地址链上余额(接 toncenter 后实现)
export async function getBalance(address) {
  // TODO: fetch(`https://toncenter.com/api/v3/account?address=${address}&api_key=...`)
  return 0
}
