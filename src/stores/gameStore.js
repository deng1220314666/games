import {defineStore} from 'pinia'
import {getCategory} from "@/api/mock.js"
import router from '../router'

export const useGameStore = defineStore('games', {
	state: () => ({
		selectedCategoryIndex: -1,
		category: [],
		games: [],
		recommendList: [],
		historyGame: []
	}),
	actions: {
		// 根据搜索条件过滤游戏
		filterGames(searchQuery = '', selectedCategoryId = '') {
			return this.games.filter(game => {
				// 类型筛选 - 检查categoryList中的GameCategoryMap.category_id
				const typeMatch = !selectedCategoryId ||
					game.categoryList?.some(cat => cat['GameCategoryMap.category_id'] === selectedCategoryId)

				// 搜索查询筛选（标题和描述）
				const searchLower = searchQuery.toLowerCase()
				const titleMatch = game.name.toLowerCase().includes(searchLower)
				const descMatch = game.desc?.toLowerCase().includes(searchLower)

				return typeMatch && (titleMatch || descMatch)
			})
		},

    getGameType(selectedCategoryId) {
      const a = this.games.filter(game => {
        const tags = this.normalizeTags(game.tags)

        return (
            !selectedCategoryId ||
            tags.includes(Number(selectedCategoryId))
        )
      })
      console.log(a)
      return a
    },

    normalizeTags(input) {
      if (input === null || input === undefined) return []

      if (typeof input === "number") {
        return Number.isNaN(input) ? [] : [input]
      }

      if (typeof input === "string") {
        if (!input.trim()) return []

        return input
            .split(",")
            .map(v => Number(v.trim()))
            .filter(v => !Number.isNaN(v))
      }

      return []
    },

    // 获取游戏类型名称
		getGameTypeName(game, locale) {
			if (!game.categoryList || game.categoryList.length === 0) return 'Unknown'
			// 获取第一个分类的中文名或英文名
			const firstCategory = game.categoryList[0]

			const category = this.category.find(c => c.id === firstCategory['id'])
			const lang = locale.value === "en" ? category.name : category.cn_name
			return category ? lang : category.cn_name
		},

		// 高亮显示搜索文本
		highlightSearchText(text, searchQuery) {
			if (!searchQuery || !text) return text

			const searchLower = searchQuery.toLowerCase()
			const textLower = text.toLowerCase()
			const startIndex = textLower.indexOf(searchLower)

			if (startIndex === -1) return text

			const endIndex = startIndex + searchLower.length
			const beforeMatch = text.substring(0, startIndex)
			const matchText = text.substring(startIndex, endIndex)
			const afterMatch = text.substring(endIndex)

			return `${beforeMatch}<span class="bg-yellow-300 text-gray-900 px-0.5 rounded">${matchText}</span>${afterMatch}`
		},

		// 添加历史游戏
		addHistoryGame(id) {
			const isExist = this.historyGame.find(game => game.game_id === id);

			if (!isExist) {
				const game = this.games.filter(game => game.game_id === id);

				if (this.historyGame.length > 7) {
					this.historyGame.shift();
				}

				this.historyGame = this.historyGame.concat(game);
			}
		},

		// 移除历史游戏
		removeHistoryGame(id) {
			this.historyGame = this.historyGame.filter(game => game.game_id !== id);
		},

		async getHistoryGame() {
			return this.historyGame;
		},

		async setRecommendGame() {
			const key = "recommendTime";
			const lastTime = Number(localStorage.getItem(key));
			const now = Date.now();

			// 24 小时 = 86400000 毫秒
			const LIMIT = 24 * 60 * 60 * 1000;

			// 无缓存 or 超时
			if (!lastTime || now - lastTime >= LIMIT) {
				this.recommendList = await this.getRandomGame();
				localStorage.setItem(key, String(now));
			}
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

    async setCategoryGame() {
      this.category = await getCategory()
    },

    // 根据当前路由更新选中的分类
    updateSelectedCategoryByRoute() {
      const currentPath = window.location.pathname;
      if (currentPath === '/') {
        // 首页
        this.selectedCategoryIndex = -2;
      } else if (currentPath === '/search') {
        // 搜索页，检查是否有分类参数
        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get('categoryId');
        if (categoryId) {
          // 特定分类，找到对应的索引
          const categoryIndex = this.category.findIndex(cat => cat.id == categoryId);
          if (categoryIndex !== -1) {
            this.selectedCategoryIndex = categoryIndex;
          } else {
            // 全部类型
            this.selectedCategoryIndex = -1;
          }
        } else {
          // 全部类型
          this.selectedCategoryIndex = -1;
        }
      } else {
        // 其他页面（如游戏详情页），不选中任何分类
        this.selectedCategoryIndex = -3;
      }
    },

    // 导航到首页
    navigateToHome() {
      // 设置选中状态
      this.selectedCategoryIndex = -2;
      router.push({ path: '/' });
    },

    // 选择分类并导航
    selectCategory(index) {
      // 设置选中状态
      this.selectedCategoryIndex = index;
      
      // 跳转到游戏搜索页面并携带分类参数
      if (index === -1) {
        // 全部类型
        router.push({ path: '/search', query: {} });
      } else {
        // 特定分类
        const categoryId = this.category[index].id;
        router.push({ path: '/search', query: { categoryId } });
      }
    }
	},
	persist: {
		key: 'game-store',
		paths: ['games', 'historyGame', 'recommendList'],          // 只持久化 games
		storage: window.localStorage
	}
})