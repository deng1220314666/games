import express from 'express'
import cors from 'cors'
import { env } from '../shared/env.js'
import { authRouter } from './routes/auth.js'
import { rewardRouter } from './routes/reward.js'
import { taskRouter } from './routes/task.js'
import { walletRouter } from './routes/wallet.js'
import { referralRouter } from './routes/referral.js'
import { configRouter } from './routes/config.js'

const app = express()
app.use(cors({ origin: env.corsOrigin, credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true, service: 'api', ts: Date.now() }))

app.use('/auth', authRouter)
app.use('/reward', rewardRouter)
app.use('/task', taskRouter)
app.use('/wallet', walletRouter)
app.use('/referral', referralRouter)
app.use('/', configRouter) // /config, /games

app.use((err, req, res, next) => {
  console.error('[api error]', err)
  res.status(500).json({ error: 'internal_error' })
})

app.listen(env.apiPort, () => {
  console.log(`TTEarn api on http://localhost:${env.apiPort}`)
  if (!env.telegramBotToken) console.warn('⚠️ TELEGRAM_BOT_TOKEN 未配置:initData 校验跳过(仅开发)')
})
