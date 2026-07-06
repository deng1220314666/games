---
name: ton-payments
description: TTEarn 的 TON 支付/提现集成约定 —— TON Connect 连钱包、读地址余额、发起转账、提现流程、tonconnect-manifest 配置、nano 换算。当任务涉及:连钱包、钱包页、提现、充值、上链交易、TON 相关配置时使用。支付优先 TON,其他渠道预留。
---

# TON 支付与提现

**支付优先 TON**,其他渠道(卡/USDT 等)后续预留。前端负责「连钱包 + 展示 + 用户侧签名」;**真实给用户打款走后端**,前端不直接给用户转账。

## 封装:`src/utils/tonConnect.js`

通过 CDN 懒加载 `@tonconnect/ui`(不打进包,符合「可预留后接」)。API:

```js
import { tonConnect, toNano, fromNano } from '@/utils/tonConnect.js'

const wallet = await tonConnect.connect()      // 弹窗连钱包,返回 { address, chain, publicKey }
tonConnect.currentWallet()                      // 当前钱包(未连返回 null)
await tonConnect.onChange(w => { ... })         // 监听连接状态
await tonConnect.disconnect()
await tonConnect.sendTransaction({ to, amountNano, payload }) // 用户主动转账(充值场景)
```

## Manifest(必需)

TON Connect 要求 `public/tonconnect-manifest.json`,`TON.manifestUrl` 指向它。
字段:`url`、`name`、`iconUrl`。域名换了要同步改。TG 小程序里 iconUrl 必须是 https 可达。

## 状态存 `src/stores/walletStore.js`

- `connected` / `address` / `tonBalance`
- `withdrawals`:提现记录(pending / done / rejected)
- 连接后可选调后端把地址绑到账户。

## 提现流程(标准)

1. 用户在钱包页点提现 → 若未连钱包,先 `tonConnect.connect()`。
2. 校验:余额折算 ≥ `ECONOMY.minWithdrawTon`,金额合法。
3. 调 `services/wallet.js` 的 `requestWithdraw({ amountTon, address })`:
   - 扣减积分(乐观)、生成 pending 记录、上报 GA `withdraw_request`。
   - `USE_MOCK` 时本地模拟;接后端时 POST `/wallet/withdraw`,由**后端签名打款**到用户地址。
4. 展示 pending,后端回调/轮询更新为 done。

## 充值 / 上链(用户 → 平台)

用 `tonConnect.sendTransaction`,金额用 `toNano(ton)` 转 nanoTON。收款地址来自后端下发,不要写死在前端。

## 单位换算

链上金额单位是 **nanoTON**(1 TON = 1e9)。永远用 `toNano` / `fromNano`,不要手写 `* 1e9`。

## 安全红线

- 私钥/助记词**永不**出现在前端或仓库。
- 打款给用户一定在后端做,前端提现只是「申请」。
- 提现地址以钱包实际连接地址为准,可让后端二次确认。
- 金额、余额最终以后端账本为准,前端乐观显示。
