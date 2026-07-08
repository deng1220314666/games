<template>
  <div class="tg-section p-4">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="flex items-center gap-1.5 text-[15px] font-bold text-tg-text">
        <span class="text-lg">📅</span> {{ t('checkin.title') }}
      </h3>
      <span class="rounded-full bg-white/5 px-2.5 py-1 text-xs text-gold">🔥 {{ t('checkin.streak', { n: user.streak }) }}</span>
    </div>

    <div class="mb-3 flex justify-between gap-1.5">
      <div
        v-for="d in 7"
        :key="d"
        class="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all"
        :class="d <= user.streak ? 'grad-gold text-[#4a2c00]' : 'bg-white/5 text-tg-hint'"
        :style="d <= user.streak ? 'box-shadow:0 4px 14px -4px rgba(255,178,62,.6)' : ''"
      >
        <span class="text-base" :class="{ 'coin-bounce': bounced && d === user.streak }">
          {{ d <= user.streak ? '🪙' : '🎁' }}
        </span>
        <span class="text-[10px] font-semibold">D{{ d }}</span>
      </div>
    </div>

    <button
      class="tap w-full rounded-2xl py-3 text-[15px] font-bold transition"
      :class="user.checkedInToday ? 'bg-white/5 text-tg-hint' : 'grad-primary glow-primary text-white glow-pulse'"
      :disabled="user.checkedInToday"
      @click="onCheckIn"
    >
      {{ user.checkedInToday ? '✅ ' + t('checkin.done') : '🎉 ' + t('checkin.action') }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.js'
import { checkIn } from '@/services/task.js'

const { t } = useI18n()
const user = useUserStore()
const bounced = ref(false)

async function onCheckIn() {
  const r = await checkIn()
  if (r.ok) {
    bounced.value = true
    setTimeout(() => (bounced.value = false), 700)
  }
}
</script>
