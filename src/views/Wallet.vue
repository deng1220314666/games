<template>
  <div class="flex-1 overflow-y-auto px-4 pb-24 pt-4">
    <div class="mb-4 flex items-center gap-2">
      <button class="flex h-8 w-8 items-center justify-center text-tg-button" @click="$router.back()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
      <h1 class="text-[22px] font-bold text-tg-text">{{ t('nav.wallet') }}</h1>
    </div>

    <BalanceCard class="mb-5" />

    <!-- TON 钱包连接 -->
    <TgSection :header="'TON ' + t('wallet.wallet')">
      <div class="tg-row">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style="background: color-mix(in srgb, var(--tg-button) 14%, transparent)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tg-button)" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3 4 8v3c0 5 3.5 8 8 10 4.5-2 8-5 8-10V8l-8-5z"/></svg>
        </span>
        <div class="min-w-0 flex-1">
          <div class="text-[15px] text-tg-text">{{ wallet.connected ? t('wallet.connected') : t('wallet.disconnected') }}</div>
          <div v-if="wallet.connected" class="tabular mt-0.5 truncate text-xs text-tg-hint">{{ wallet.shortAddress }}</div>
        </div>
        <button
          class="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold"
          :style="wallet.connected
            ? { background: 'var(--tg-secondary-bg)', color: 'var(--tg-hint)' }
            : { background: 'var(--tg-button)', color: 'var(--tg-button-text)' }"
          @click="toggleWallet"
        >
          {{ wallet.connected ? t('wallet.disconnect') : t('wallet.connect') }}
        </button>
      </div>
    </TgSection>

    <!-- 提现 -->
    <TgSection :header="t('wallet.withdrawTitle')" :footer="t('wallet.rate', { rate: coinPerTon, min: minWithdraw })">
      <div class="p-4">
        <div class="flex items-center gap-2 rounded-xl px-3 py-2.5" style="background: var(--tg-secondary-bg)">
          <input
            v-model.number="amount"
            type="number"
            inputmode="decimal"
            :placeholder="t('wallet.amountPlaceholder')"
            class="tabular min-w-0 flex-1 bg-transparent text-[15px] text-tg-text outline-none placeholder:text-tg-hint"
          />
          <span class="text-sm font-semibold text-tg-hint">TON</span>
        </div>
        <p v-if="hint" class="mt-2 text-xs" :style="{ color: hintOk ? 'var(--tg-button)' : 'var(--tg-destructive)' }">{{ hint }}</p>
        <button
          class="mt-3 w-full rounded-xl py-3 text-[15px] font-semibold transition active:scale-[0.99] disabled:opacity-50"
          style="background: var(--tg-button); color: var(--tg-button-text)"
          :disabled="submitting"
          @click="onWithdraw"
        >
          {{ t('wallet.withdrawBtn') }}
        </button>
      </div>
    </TgSection>

    <!-- 提现记录 -->
    <TgSection :header="t('wallet.records')">
      <div v-if="wallet.withdrawals.length === 0" class="py-8 text-center text-sm text-tg-hint">
        {{ t('wallet.noRecords') }}
      </div>
      <div v-for="r in wallet.withdrawals" :key="r.id" class="tg-row">
        <div class="min-w-0 flex-1">
          <div class="tabular text-[15px] text-tg-text">{{ r.amountTon }} TON</div>
          <div class="tabular mt-0.5 text-[11px] text-tg-hint">{{ formatTime(r.time) }}</div>
        </div>
        <span class="text-xs" :style="{ color: statusColor(r.status) }">{{ t('wallet.status.' + r.status) }}</span>
      </div>
    </TgSection>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BalanceCard from '@/components/BalanceCard.vue'
import TgSection from '@/components/TgSection.vue'
import { useWalletStore } from '@/stores/walletStore.js'
import { ECONOMY } from '@/config/index.js'
import { connectWallet, disconnectWallet, requestWithdraw, canWithdraw, restoreWallet } from '@/services/wallet.js'
import { track } from '@/utils/event.js'

defineOptions({ name: 'Wallet' })

const { t } = useI18n()
const wallet = useWalletStore()
const amount = ref(null)
const hint = ref('')
const hintOk = ref(false)
const submitting = ref(false)
const coinPerTon = ECONOMY.coinPerTon
const minWithdraw = ECONOMY.minWithdrawTon

async function toggleWallet() {
  if (wallet.connected) {
    await disconnectWallet()
  } else {
    try {
      await connectWallet()
    } catch (e) {
      hint.value = t('wallet.connectFail')
      hintOk.value = false
    }
  }
}

const reasonMap = {
  no_wallet: 'wallet.errNoWallet',
  below_min: 'wallet.errBelowMin',
  insufficient: 'wallet.errInsufficient',
  network: 'wallet.errNetwork',
}

async function onWithdraw() {
  hint.value = ''
  if (!amount.value || amount.value <= 0) return
  const check = canWithdraw(amount.value)
  if (!check.ok) {
    hint.value = t(reasonMap[check.reason] || 'wallet.errNetwork')
    hintOk.value = false
    return
  }
  submitting.value = true
  const res = await requestWithdraw(amount.value)
  submitting.value = false
  if (res.ok) {
    hint.value = t('wallet.submitted')
    hintOk.value = true
    amount.value = null
  } else {
    hint.value = t(reasonMap[res.reason] || 'wallet.errNetwork')
    hintOk.value = false
  }
}

function statusColor(s) {
  return {
    pending: 'var(--tg-hint)',
    done: 'var(--tg-button)',
    rejected: 'var(--tg-destructive)',
  }[s] || 'var(--tg-hint)'
}
function formatTime(ts) {
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

onMounted(() => {
  track.page('wallet')
  restoreWallet()
})
</script>
