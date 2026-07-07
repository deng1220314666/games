<template>
  <div class="flex-1 overflow-y-auto px-4 pb-24 pt-4">
    <BalanceCard class="mb-5" />

    <!-- 快捷赚币入口 -->
    <div class="mb-5 grid grid-cols-4 gap-2.5">
      <button
        v-for="q in quickEntries"
        :key="q.key"
        class="tg-section flex flex-col items-center gap-1.5 py-3.5 transition active:scale-[0.97]"
        @click="q.action"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full"
          style="background: color-mix(in srgb, var(--tg-button) 14%, transparent)"
          v-html="q.icon"
        ></span>
        <span class="text-[11px] text-tg-text">{{ t(q.label) }}</span>
      </button>
    </div>

    <CheckInBar class="mb-5" />

    <!-- 广告位 -->
    <div id="home-banner-box" class="mb-5 flex min-h-[100px] w-full items-center justify-center overflow-hidden rounded-xl"></div>

    <!-- 玩游戏赚币 -->
    <div class="tg-section-header flex items-center justify-between">
      <span>{{ t('home.playToEarn') }}</span>
      <span class="normal-case tracking-normal text-tg-hint">+{{ perMinute }} {{ coinSymbol }}/min</span>
    </div>
    <div class="grid grid-cols-3 gap-2.5">
      <div
        v-for="g in games"
        :key="g.game_id"
        class="tg-section aspect-square"
      >
        <GameCard :value="g" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BalanceCard from '@/components/BalanceCard.vue'
import CheckInBar from '@/components/CheckInBar.vue'
import GameCard from '@/components/GameCard.vue'
import { useGameStore } from '@/stores/gameStore.js'
import { fetchGames } from '@/services/content.js'
import { AdsterraAd, RewardedAd } from '@/utils/adSdk.js'
import { earn } from '@/services/reward.js'
import { APP, ECONOMY } from '@/config/index.js'
import { ADSTERRA } from '@/config/ads.js'
import { track } from '@/utils/event.js'

defineOptions({ name: 'Home' })

const { t } = useI18n()
const router = useRouter()
const gameStore = useGameStore()
const games = ref([])
const coinSymbol = APP.coinSymbol
const perMinute = ECONOMY.reward.playGamePerMinute

// 简洁描边 SVG 图标(currentColor=tg-button)
const svg = (d) =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tg-button)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`

const quickEntries = [
  { key: 'ad', icon: svg('m10 8 6 4-6 4V8zM4 5v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z'), label: 'home.watchAd', action: watchAd },
  { key: 'task', icon: svg('M8 6h11M8 12h11M8 18h11M3.5 6h.01M3.5 12h.01M3.5 18h.01'), label: 'home.tasks', action: () => router.push('/task') },
  { key: 'invite', icon: svg('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6'), label: 'home.invite', action: () => router.push('/invite') },
  { key: 'wallet', icon: svg('M3 8a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2M3 8v9a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3M3 8h16m2 3h-4a2 2 0 0 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z'), label: 'home.wallet', action: () => router.push('/wallet') },
]

async function watchAd() {
  const ok = await RewardedAd.show()
  if (ok) await earn('watch_ad', ECONOMY.reward.watchAd)
}

onMounted(async () => {
  track.page('home')
  gameStore.games = await fetchGames()
  games.value = gameStore.games.slice(0, 12)
  await gameStore.setRecommendGame()
  AdsterraAd.showBanner(
    'home-banner-box',
    { key: ADSTERRA.bannerKey, format: 'iframe', height: 250, width: 300, params: {} },
    `https://www.highperformanceformat.com/${ADSTERRA.bannerKey}/invoke.js`
  )
})
</script>
