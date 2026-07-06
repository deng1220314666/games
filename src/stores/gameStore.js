import { defineStore } from 'pinia'
import { getCategory } from '@/api/mock.js'

export const useGameStore = defineStore('games', {
  state: () => ({
    category: [],
    games: [],
    recommendList: [],
    historyGame: [],
  }),

  actions: {
    normalizeTags(input) {
      if (input == null) return []
      if (typeof input === 'number') return Number.isNaN(input) ? [] : [input]
      if (typeof input === 'string') {
        if (!input.trim()) return []
        return input
          .split(',')
          .map((v) => Number(v.trim()))
          .filter((v) => !Number.isNaN(v))
      }
      return []
    },

    getGameType(selectedCategoryId) {
      if (!selectedCategoryId) return this.games
      return this.games.filter((g) =>
        this.normalizeTags(g.tags).includes(Number(selectedCategoryId))
      )
    },

    addHistoryGame(id) {
      if (this.historyGame.find((g) => g.game_id === id)) return
      const game = this.games.filter((g) => g.game_id === id)
      if (this.historyGame.length > 7) this.historyGame.shift()
      this.historyGame = this.historyGame.concat(game)
    },
    removeHistoryGame(id) {
      this.historyGame = this.historyGame.filter((g) => g.game_id !== id)
    },

    async getRandomGame(count = 10) {
      const result = []
      const used = new Set()
      while (result.length < count && result.length < this.games.length) {
        const index = Math.floor(Math.random() * this.games.length)
        if (!used.has(index)) {
          used.add(index)
          result.push(this.games[index])
        }
      }
      return result
    },

    async setRecommendGame() {
      const key = 'recommendTime'
      const lastTime = Number(localStorage.getItem(key))
      const now = Date.now()
      const LIMIT = 24 * 60 * 60 * 1000
      if (!lastTime || now - lastTime >= LIMIT || this.recommendList.length === 0) {
        this.recommendList = await this.getRandomGame()
        localStorage.setItem(key, String(now))
      }
    },

    async setCategoryGame() {
      this.category = await getCategory()
    },
  },

  persist: {
    key: 'game-store',
    paths: ['games', 'historyGame', 'recommendList'],
    storage: window.localStorage,
  },
})
