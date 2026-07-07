// 后台 API 服务(纯 JSON;后台前端是独立的 admin-web,由 nginx 托管)
import express from 'express'
import cors from 'cors'
import { env } from '../shared/env.js'
import { authRouter } from './routes/auth.js'
import { manageRouter } from './routes/manage.js'

const app = express()
app.use(cors({ origin: env.adminOrigin, credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true, service: 'admin', ts: Date.now() }))
app.use('/api/auth', authRouter)
app.use('/api', manageRouter)

app.use((err, req, res, next) => {
  console.error('[admin error]', err)
  res.status(500).json({ error: 'internal_error' })
})

app.listen(env.adminPort, () => {
  console.log(`TTEarn admin api on http://localhost:${env.adminPort}`)
})
