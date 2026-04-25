<template>
  <div class="min-h-screen flex  bg-gray-100 py-8">
    <div class="hidden sm:block container mx-auto px-4 max-w-6xl">
      <!-- 返回按钮 -->
      <button
        @click="$router.back()"
        class="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        {{ t('gameDetail.backButton') }}
      </button>

      <!-- 游戏详情卡片 -->
      <div v-if="game" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- 游戏封面和基本信息 -->
        <div class="md:flex">
          <div class="md:w-1/3">
            <div v-if="game.cover">
              <LazyImage
                :src="game.cover"
                :alt="game.name"
                container-class="absolute inset-0 bg-gray-200"
                image-class="w-full h-64 md:h-full object-cover"
                spinner-size="medium"
              />
            </div>
            <div v-else class="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          <div class="md:w-2/3 p-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ game.name }}</h1>

            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="category in game.categoryList"
                :key="category.id"
                class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                <span v-if="locale === 'en'">{{ category.name }}</span>
                <span v-else>{{ category.cn_name }}</span>
              </span>
            </div>

            <p class="text-gray-600 mb-6 leading-relaxed">{{ game.desc }}</p>

            <!-- 游戏标签 -->
<!--            <div v-if="game.tags" class="mb-6">-->
<!--              <h3 class="text-sm font-semibold text-gray-700 mb-2">{{ t('gameDetail.tagsLabel') }}</h3>-->
<!--              <div class="flex flex-wrap gap-2">-->
<!--                <span -->
<!--                  v-for="tag in game.tags.split(',')"-->
<!--                  :key="tag"-->
<!--                  class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"-->
<!--                >-->
<!--                  {{ tag.trim() }}-->
<!--                </span>-->
<!--              </div>-->
<!--            </div>-->

            <!-- 开始游戏按钮 -->
            <button
              @click="startGame"
              class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ t('gameDetail.startGame') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 游戏加载区域 -->
      <div v-if="isGameLoading" class="mt-8 bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">{{ t('gameDetail.gameLoading') }}</p>
      </div>
      <!-- 游戏iframe容器 -->
      <div v-if="!isGameLoading && gameUrl" :class="isFullscreen ? 'fixed top-0 left-0 w-full h-full' : 'mt-8 bg-white rounded-lg shadow-lg overflow-hidden'" ref="gameContainer">
        <div class="bg-gray-800 px-4 py-2 flex justify-between items-center">
           <span class="text-white text-sm">{{ t('gameDetail.playingGame') }} {{ game.name }}</span>
           <div class="flex justify-center items-center">
             <button
                 @click="toggleFullscreen"
                 class="text-gray-400 hover:text-white transition-colors"
                 :title="t('gameDetail.fullscreen')"
             >
               <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                 <path d="M18.8 4.2H12.9c-0.46 0-0.82 0.37-0.82 0.82s0.37 0.82 0.82 0.82h5.05L12.6 10.65c-0.33 0.33-0.33 0.96 0 1.29 0.16 0.16 0.37 0.25 0.59 0.25 0.21 0 0.42-0.08 0.58-0.25l5.55-5.55V11.3c0 0.46 0.37 0.82 0.82 0.82s0.82-0.37 0.82-0.82V5.2c0-0.46-0.37-0.82-0.82-0.82zM10.9 18.35H6.63l4.36-4.36c0.33-0.33 0.33-0.96 0-1.29-0.33-0.33-0.96-0.33-1.29 0L5.85 16.63V12.65c0-0.46-0.37-0.82-0.82-0.82s-0.82 0.37-0.82 0.82v6.34c0 0.46 0.37 0.82 0.82 0.82h6.17c0.46 0 0.82-0.37 0.82-0.82s-0.36-0.82-0.82-0.82z"/>
               </svg>
             </button>
           </div>
        </div>
        <div :class="isFullscreen ? 'w-full h-full bg-white' : 'aspect-video bg-black'">
          <iframe
            :src="gameUrl"
            :class="isFullscreen ? 'w-[414px] h-[calc(100%-32px)] mx-auto' : 'mx-auto h-full'"
            frameborder="0"
            allowfullscreen
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          ></iframe>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">{{ t('gameDetail.loading') }}</p>
      </div>

      <!-- 错误状态 -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{{ error }}</p>
      </div>

    </div>

	  <Mobile-GameDetail-Vue class="sm:hidden" :gameInfo="game" :gameUrl="gameUrl" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useI18n } from 'vue-i18n'
import LazyImage from '@/components/LazyImage.vue'
import MobileGameDetailVue from '@/components/MobileGameDetail.vue'
import {getQueryParam} from "@/utils/index.js";
import { gaLogEvent } from "@/utils/event.js";

const route = useRoute()
const gameStore = useGameStore()
const { t, locale } = useI18n()

const game = ref({})
const gameUrl = ref('')
const isGameLoading = ref(false)
const loading = ref(true)
const error = ref('')
const isTest = ref(false)
const gameContainer = ref(null)
const isFullscreen = ref(false)

// 根据游戏ID获取游戏详情
const fetchGameDetail = () => {
  try {
    console.log(route)
    const gameId = route.params.id
    const foundGame = gameStore.games.find(g => g.game_id === gameId)
    console.log(foundGame)
    if (foundGame) {
      game.value = foundGame
      gameUrl.value = foundGame.url
    } else {
      error.value = t('gameDetail.gameNotFound')
    }
  } catch (err) {
    error.value = t('gameDetail.loadFailed')
    console.error('Error fetching game detail:', err)
  } finally {
    loading.value = false
  }
}

// 开始游戏
const startGame = () => {
  isGameLoading.value = true
  gameStore.addHistoryGame(route.params.id)
  // 模拟加载延迟
  setTimeout(() => {
    isGameLoading.value = false
  }, 1000)
}

// 关闭游戏
const closeGame = () => {
  gameUrl.value = ''
  isFullscreen.value = !isFullscreen.value
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

onMounted(() => {
  gaLogEvent.logEvent({
    eventName: "enter_info",
    eventValue: game.value.game_id,
    eventLog: `Enter info`
  })
  fetchGameDetail()
  isTest.value = !!getQueryParam("isTest")
})
</script>

<style scoped>
/* 移动端适配 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .md\:flex {
    flex-direction: column;
  }

  .md\:w-1\/3 {
    width: 100%;
  }

  .md\:w-2\/3 {
    width: 100%;
  }

  .md\:w-auto {
    width: 100%;
  }
}

/* 游戏iframe响应式 */
.aspect-video {
  aspect-ratio: 16/9;
}

@media (max-width: 640px) {
  .aspect-video {
    height: 300px;
  }
}
</style>