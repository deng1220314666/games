<template>
  <div class="card-neon shimmer glow-primary relative overflow-hidden p-5">
    <!-- 背景光斑 -->
    <div class="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl" style="background: var(--grad-cyan)"></div>

    <div class="relative flex items-center gap-2 text-[13px] text-tg-hint">
      <span class="grad-primary inline-block h-2 w-2 rounded-full glow-pulse"></span>
      {{ t('earn.balance') }}
    </div>

    <div class="relative mt-2 flex items-end gap-2.5">
      <span class="coin float text-3xl leading-none">🪙</span>
      <span class="tabular bg-gradient-to-br from-white to-[#cfe0ff] bg-clip-text text-[40px] font-extrabold leading-none text-transparent">
        {{ formatNumber(display) }}
      </span>
    </div>
    <div class="tabular relative mt-1.5 text-[13px] text-tg-hint">≈ <span class="text-gold font-semibold">{{ tonValue }}</span> TON</div>

    <div class="relative mt-4 grid grid-cols-2 gap-2.5">
      <button class="tap rounded-2xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold backdrop-blur" @click="$router.push('/task')">
        ⚡ {{ t('earn.earnMore') }}
      </button>
      <button class="tap grad-gold glow-gold rounded-2xl py-2.5 text-sm font-bold text-[#4a2c00]" @click="$router.push('/wallet')">
        💸 {{ t('earn.withdraw') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.js'
import { ECONOMY } from '@/config/index.js'
import { formatNumber } from '@/utils/index.js'
import { useCountUp } from '@/composables/useCountUp.js'

const { t } = useI18n()
const user = useUserStore()
const display = useCountUp(() => user.balance)
const tonValue = computed(() => (user.balance / ECONOMY.coinPerTon).toFixed(4))
</script>
