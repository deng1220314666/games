<template>
  <div class="flex-1 overflow-y-auto px-4 pb-24 pt-4">
    <div class="mb-4 flex items-center gap-2">
      <button class="flex h-8 w-8 items-center justify-center text-tg-button" @click="$router.back()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
      <h1 class="text-[22px] font-bold text-tg-text">{{ t('mine.coinHistory') }}</h1>
    </div>

    <!-- 当前余额 -->
    <div class="tg-section mb-4 flex items-center justify-between p-4">
      <span class="text-sm text-tg-hint">{{ t('earn.balance') }}</span>
      <span class="tabular text-xl font-bold" style="color: var(--tg-button)">{{ formatNumber(user.balance) }} {{ coinSymbol }}</span>
    </div>

    <TgSection>
      <div v-if="loading" class="py-10 text-center text-sm text-tg-hint">{{ t('gameDetail.loading') }}</div>
      <div v-else-if="list.length === 0" class="py-10 text-center text-sm text-tg-hint">{{ t('mine.noHistory') }}</div>
      <div v-for="(h, i) in list" :key="i" class="tg-row">
        <div class="min-w-0 flex-1">
          <div class="text-[15px] text-tg-text">{{ t('earn.source.' + h.source, h.source) }}</div>
          <div class="tabular mt-0.5 text-[11px] text-tg-hint">{{ formatTime(h.time) }}</div>
        </div>
        <span
          class="tabular text-[15px] font-semibold"
          :style="{ color: h.amount >= 0 ? 'var(--tg-button)' : 'var(--tg-destructive)' }"
        >
          {{ h.amount >= 0 ? '+' : '' }}{{ h.amount }}
        </span>
      </div>
    </TgSection>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import TgSection from '@/components/TgSection.vue'
import { useUserStore } from '@/stores/userStore.js'
import { APP } from '@/config/index.js'
import { formatNumber } from '@/utils/index.js'
import { getHistory } from '@/services/reward.js'
import { track } from '@/utils/event.js'

const { t } = useI18n()
const user = useUserStore()
const coinSymbol = APP.coinSymbol
const list = ref([])
const loading = ref(true)

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

onMounted(async () => {
  track.page('coin_history')
  list.value = await getHistory()
  loading.value = false
})
</script>
