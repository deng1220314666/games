import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { authRouter } from './routes/auth.js'
import { rewardRouter } from './routes/reward.js'
import { taskRouter } from './routes/task.js'
import { walletRouter } from './routes/wallet.js'
import { referralRouter } from './routes/referral.js'

const app = express()

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }))

app.use('/auth', authRouter)
app.use('/reward', rewardRouter)
app.use('/task', taskRouter)
app.use('/wallet', walletRouter)
app.use('/referral', referralRouter)

// 统一错误处理
app.use((err, req, res, next) => {
  console.error('[error]', err)
  res.status(500).json({ error: 'internal_error' })
})

app.listen(config.port, () => {
  console.log(`TTEarn server on http://localhost:${config.port}`)
  console.log(`CORS origin: ${config.corsOrigin.join(', ')}`)
  if (!config.telegramBotToken) console.warn('⚠️  TELEGRAM_BOT_TOKEN 未配置:initData 校验被跳过(仅限开发)')
  if (!config.ton.mnemonic) console.warn('⚠️  TON_WALLET_MNEMONIC 未配置:提现只落 pending,不会真实打款')
})
