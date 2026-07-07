// 公开配置(前端拉取,无需登录):settings / games / categories
import { Router } from 'express'
import { getSettings, getCategories } from '../../shared/models/config.js'
import { listGames } from '../../shared/models/games.js'

export const configRouter = Router()

configRouter.get('/config', async (req, res) => {
  res.json({ settings: await getSettings(), categories: await getCategories() })
})

configRouter.get('/games', async (req, res) => {
  const games = await listGames({ enabledOnly: true })
  res.json({
    games: games.map((g) => ({
      game_id: g.id,
      name: g.name,
      cover: g.cover,
      url: g.url,
      category: g.category,
    })),
  })
})
