import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from '../shared/env.js'
import { authRouter } from './routes/auth.js'
import { manageRouter } from './routes/manage.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors({ origin: env.adminOrigin, credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true, service: 'admin', ts: Date.now() }))
app.use('/api/auth', authRouter)
app.use('/api', manageRouter)

// 后台 UI(单页)
app.use('/', express.static(path.join(__dirname, 'ui')))

app.use((err, req, res, next) => {
  console.error('[admin error]', err)
  res.status(500).json({ error: 'internal_error' })
})

app.listen(env.adminPort, () => {
  console.log(`TTEarn admin on http://localhost:${env.adminPort}`)
})
