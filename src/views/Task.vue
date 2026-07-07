<template>
  <div class="flex-1 overflow-y-auto px-4 pb-24 pt-4">
    <h1 class="mb-4 px-1 text-[22px] font-bold text-tg-text">{{ t('nav.task') }}</h1>

    <CheckInBar class="mb-5" />

    <div id="task-banner-box" class="mb-5 flex min-h-[100px] w-full items-center justify-center overflow-hidden rounded-xl"></div>

    <TgSection :header="t('nav.task')">
      <TgRow
        v-for="task in tasks"
        :key="task.id"
        :interactive="!task.done"
        @click="doTask(task)"
      >
        <template #icon>
          <span v-html="icons[task.type]"></span>
        </template>
        <div class="truncate text-[15px] text-tg-text">{{ t(task.title) }}</div>
        <div class="tabular mt-0.5 text-xs" style="color: var(--tg-button)">
          +{{ task.reward }} {{ coinSymbol }}
          <span v-if="task.total" class="text-tg-hint">· {{ task.progress }}/{{ task.total }}</span>
        </div>
        <template #value>
          <span
            v-if="task.done"
            class="rounded-full px-3 py-1 text-xs text-tg-hint"
            style="background: var(--tg-secondary-bg)"
          >
            {{ t('task.done') }}
          </span>
          <span
            v-else
            class="rounded-full px-3.5 py-1.5 text-xs font-semibold"
            style="background: var(--tg-button); color: var(--tg-button-text)"
          >
            {{ t('task.go') }}
          </span>
        </template>
      </TgRow>
    </TgSection>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CheckInBar from '@/components/CheckInBar.vue'
import TgSection from '@/components/TgSection.vue'
import TgRow from '@/components/TgRow.vue'
import { APP, ECONOMY } from '@/config/index.js'
import { ADSTERRA } from '@/config/ads.js'
import { getTasks, checkIn } from '@/services/task.js'
import { earn } from '@/services/reward.js'
import { RewardedAd, AdsterraAd } from '@/utils/adSdk.js'
import { track } from '@/utils/event.js'

defineOptions({ name: 'Task' })

const { t } = useI18n()
const router = useRouter()
const coinSymbol = APP.coinSymbol
const tasks = ref([])

const svg = (d) =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--tg-button)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`
const icons = {
  checkin: svg('M8 2v3M16 2v3M3.5 9h17M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'),
  watch_ad: svg('m10 8 6 4-6 4V8zM4 5v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z'),
  play_game: svg('M6 12h4m-2-2v4M15 11h.01M18 13h.01M17 6a5 5 0 0 1 5 5v1a4 4 0 0 1-7 3H9a4 4 0 0 1-7-3v-1a5 5 0 0 1 5-5z'),
  invite: svg('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6'),
}

function refresh() {
  tasks.value = getTasks()
}

async function doTask(task) {
  if (task.done) return
  if (task.type === 'checkin') {
    await checkIn()
  } else if (task.type === 'watch_ad') {
    const ok = await RewardedAd.show()
    if (ok) await earn('watch_ad', ECONOMY.reward.watchAd)
  } else if (task.type === 'play_game') {
    router.push('/')
  } else if (task.type === 'invite') {
    router.push('/invite')
  }
  refresh()
}

onMounted(() => {
  track.page('task')
  refresh()
  AdsterraAd.showBanner(
    'task-banner-box',
    { key: ADSTERRA.bannerKey, format: 'iframe', height: 250, width: 300, params: {} },
    `https://www.highperformanceformat.com/${ADSTERRA.bannerKey}/invoke.js`
  )
})
onActivated(refresh)
</script>
