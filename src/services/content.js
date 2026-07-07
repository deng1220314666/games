// 内容(游戏/配置):后端模式从 api 拉取(后台可管理),mock 模式用本地数据
import { getGames as mockGames } from '@/api/mock.js'
import { client, USE_MOCK } from '@/api/client.js'

export async function fetchGames() {
  if (USE_MOCK) return mockGames()
  try {
    const res = await client.get('/games')
    return Array.isArray(res.games) && res.games.length ? res.games : mockGames()
  } catch (e) {
    return mockGames()
  }
}
