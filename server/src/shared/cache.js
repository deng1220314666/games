// Redis 缓存(可选:REDIS_URL 未配置时降级为无缓存,不影响功能)
import Redis from 'ioredis'
import { env } from './env.js'

const PREFIX = 'ttearn:'
let redis = null

if (env.redisUrl) {
  redis = new Redis(env.redisUrl, {
    lazyConnect: false,
    maxRetriesPerRequest: 2,
    keyPrefix: PREFIX,
  })
  redis.on('error', (e) => console.warn('[redis] error', e.message))
} else {
  console.warn('[redis] REDIS_URL 未配置,缓存禁用')
}

export const cache = {
  enabled: !!redis,

  async get(key) {
    if (!redis) return null
    try {
      const v = await redis.get(key)
      return v ? JSON.parse(v) : null
    } catch {
      return null
    }
  },

  async set(key, value, ttlSec = 300) {
    if (!redis) return
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSec)
    } catch {
      /* noop */
    }
  },

  async del(...keys) {
    if (!redis || keys.length === 0) return
    try {
      await redis.del(...keys)
    } catch {
      /* noop */
    }
  },
}
