<template>
  <div class="tg-section p-5" style="background: var(--tg-button); color: var(--tg-button-text)">
    <div class="text-[13px] opacity-80">{{ t('earn.balance') }}</div>
    <div class="mt-1.5 flex items-end gap-2">
      <span class="tabular text-[34px] font-bold leading-none">{{ formatNumber(user.balance) }}</span>
      <span class="pb-0.5 text-base opacity-90">{{ coinSymbol }}</span>
    </div>
    <div class="tabular mt-1 text-[13px] opacity-80">≈ {{ tonValue }} TON</div>

    <div class="mt-4 grid grid-cols-2 gap-2.5">
      <button
        class="rounded-xl bg-white/15 py-2.5 text-sm font-semibold backdrop-blur transition active:scale-[0.98]"
        @click="$router.push('/task')"
      >
        {{ t('earn.earnMore') }}
      </button>
      <button
        class="rounded-xl bg-white py-2.5 text-sm font-semibold transition active:scale-[0.98]"
        style="color: var(--tg-button)"
        @click="$router.push('/wallet')"
      >
        {{ t('earn.withdraw') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.js'
import { APP, ECONOMY } from '@/config/index.js'
import { formatNumber } from '@/utils/index.js'

const { t } = useI18n()
const user = useUserStore()
const coinSymbol = APP.coinSymbol
const tonValue = computed(() => (user.balance / ECONOMY.coinPerTon).toFixed(4))
</script>
