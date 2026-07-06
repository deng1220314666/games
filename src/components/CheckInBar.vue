<template>
  <div class="tg-section p-4">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-[15px] font-semibold text-tg-text">{{ t('checkin.title') }}</h3>
      <span class="text-xs text-tg-hint">{{ t('checkin.streak', { n: user.streak }) }}</span>
    </div>
    <div class="mb-3 flex justify-between gap-1.5">
      <div
        v-for="d in 7"
        :key="d"
        class="flex flex-1 flex-col items-center gap-1 rounded-lg py-2"
        :style="
          d <= user.streak
            ? { background: 'color-mix(in srgb, var(--tg-button) 14%, transparent)' }
            : { background: 'var(--tg-secondary-bg)' }
        "
      >
        <svg
          v-if="d <= user.streak"
          class="h-4 w-4 text-tg-button"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <span v-else class="h-4 w-4 rounded-full border-2 border-dashed" style="border-color: var(--tg-separator)"></span>
        <span class="text-[10px] text-tg-hint">D{{ d }}</span>
      </div>
    </div>
    <button
      class="w-full rounded-xl py-3 text-[15px] font-semibold transition active:scale-[0.99]"
      :class="user.checkedInToday ? 'text-tg-hint' : 'text-tg-button-text'"
      :style="
        user.checkedInToday
          ? { background: 'var(--tg-secondary-bg)' }
          : { background: 'var(--tg-button)' }
      "
      :disabled="user.checkedInToday"
      @click="onCheckIn"
    >
      {{ user.checkedInToday ? t('checkin.done') : t('checkin.action') }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.js'
import { checkIn } from '@/services/task.js'

const { t } = useI18n()
const user = useUserStore()

async function onCheckIn() {
  await checkIn()
}
</script>
