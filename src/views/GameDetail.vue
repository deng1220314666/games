<template>
  <!-- fixed inset-0 直接铺满视口,不依赖父级高度链 -->
  <div ref="screen" class="fixed inset-0 z-50 flex flex-col bg-slate-900">
    <!-- 顶栏(留顶部安全区) -->
    <div
      class="flex items-center justify-between px-3 py-2 text-white"
      style="padding-top: calc(env(safe-area-inset-top, 0px) + 0.5rem)"
    >
      <button class="flex items-center gap-1 text-sm" @click="$router.back()">
        ‹ {{ t('gameDetail.back') }}
      </button>
      <span class="truncate px-2 text-sm font-semibold">{{ game.name }}</span>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs">
          <span>🪙</span>
          <span class="font-bold text-amber-300">+{{ earnedThisSession }}</span>
        </div>
        <button
          class="rounded-full bg-white/10 px-2 py-1 text-sm"
          :title="t('gameDetail.fullscreen')"
          @click="toggleFullscreen"
        >
          {{ isFullscreen ? '🗗' : '⛶' }}
        </button>
      </div>
    </div>

    <!-- 赚币进度条 -->
    <div class="px-3 pb-2">
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div class="h-full bg-amber-400 transition-all" :style="{ width: progressPct + '%' }"></div>
      </div>
      <div class="mt-1 text-center text-[11px] text-white/60">
        {{ t('gameDetail.earnHint', { coin: perMinute }) }}
      </div>
    </div>

    <!-- 游戏区:flex-1 填满剩余空间 -->
    <div class="relative min-h-0 flex-1 bg-black">
      <iframe
        v-if="gameUrl"
        :src="gameUrl"
        class="absolute inset-0 h-full w-full border-0"
        allowfullscreen
        allow="autoplay; fullscreen; gyroscope; accelerometer"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-orientation-lock"
      ></iframe>
      <div v-else class="flex h-full items-center justify-center text-white/50">
        {{ error || t('gameDetail.loading') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@/stores/gameStore.js'
import { fetchGames } from '@/services/content.js'
import { earn } from '@/services/reward.js'
import { ECONOMY } from '@/config/index.js'
import { track } from '@/utils/event.js'

const route = useRoute()
const { t } = useI18n()
const gameStore = useGameStore()

const screen = ref(null)
const game = ref({})
const gameUrl = ref('')
const error = ref('')
const earnedThisSession = ref(0)
const secondsInMinute = ref(0)
const isFullscreen = ref(false)
const perMinute = ECONOMY.reward.playGamePerMinute

const progressPct = computed(() => Math.min(100, (secondsInMinute.value / 60) * 100))

let timer = null

async function loadGame() {
  if (!gameStore.games.length) gameStore.games = await fetchGames()
  const found = gameStore.games.find((g) => g.game_id === route.params.id)
  if (found) {
    game.value = found
    gameUrl.value = found.url
    gameStore.addHistoryGame(found.game_id)
  } else {
    error.value = t('gameDetail.notFound')
  }
}

// 真·全屏(设备全屏 API);不支持时退化为已铺满的视口
async function toggleFullscreen() {
  const el = screen.value
  try {
    if (!document.fullscreenElement) {
      await (el.requestFullscreen?.() || el.webkitRequestFullscreen?.())
    } else {
      await (document.exitFullscreen?.() || document.webkitExitFullscreen?.())
    }
  } catch (e) {
    /* iOS Safari 不支持元素全屏,已是铺满视口的布局 */
  }
}
function onFsChange() {
  isFullscreen.value = !!document.fullscreenElement
}

// 每玩满 1 分钟发一次币(页面可见时计时)
function startEarnTimer() {
  timer = setInterval(async () => {
    if (document.hidden) return
    secondsInMinute.value += 1
    if (secondsInMinute.value >= 60) {
      secondsInMinute.value = 0
      const res = await earn('play_game', perMinute)
      if (res.ok) earnedThisSession.value += res.amount
    }
  }, 1000)
}

onMounted(async () => {
  track.page('game_detail')
  document.addEventListener('fullscreenchange', onFsChange)
  await loadGame()
  if (gameUrl.value) startEarnTimer()
})
onUnmounted(() => {
  clearInterval(timer)
  document.removeEventListener('fullscreenchange', onFsChange)
})
</script>
