<template>
  <div class="flex-1 overflow-y-auto px-4 pb-24 pt-4">
    <!-- 用户信息 -->
    <div class="tg-section mb-5 flex items-center gap-3.5 p-4">
      <img
        v-if="user.profile.avatar"
        :src="user.profile.avatar"
        class="h-14 w-14 rounded-full object-cover"
        alt=""
      />
      <div
        v-else
        class="flex h-14 w-14 items-center justify-center rounded-full text-white"
        style="background: var(--tg-button)"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0"/></svg>
      </div>
      <div class="min-w-0 flex-1">
        <div class="truncate text-[17px] font-semibold text-tg-text">{{ user.profile.name || 'Guest' }}</div>
        <div class="tabular mt-0.5 text-xs text-tg-hint">ID {{ user.profile.id?.slice(-8) }} · {{ user.profile.platform }}</div>
      </div>
    </div>

    <BalanceCard class="mb-5" />

    <!-- 功能菜单 -->
    <TgSection>
      <TgRow
        v-for="m in menus"
        :key="m.key"
        chevron
        :icon-bg="m.bg"
        @click="m.action"
      >
        <template #icon>
          <span v-html="m.icon"></span>
        </template>
        {{ t(m.label) }}
      </TgRow>
    </TgSection>

    <!-- 积分流水 -->
    <TgSection :header="t('mine.history')">
      <div v-if="user.coinHistory.length === 0" class="py-8 text-center text-sm text-tg-hint">
        {{ t('mine.noHistory') }}
      </div>
      <div v-for="h in user.coinHistory.slice(0, 20)" :key="h.id" class="tg-row">
        <div class="min-w-0 flex-1 text-[15px] text-tg-text">{{ t('earn.source.' + h.source, h.source) }}</div>
        <span class="tabular text-[15px] font-semibold" style="color: var(--tg-button)">+{{ h.amount }}</span>
      </div>
    </TgSection>

    <div class="mt-5 flex justify-center">
      <LanguageSwitcher />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BalanceCard from '@/components/BalanceCard.vue'
import TgSection from '@/components/TgSection.vue'
import TgRow from '@/components/TgRow.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useUserStore } from '@/stores/userStore.js'
import { track } from '@/utils/event.js'

defineOptions({ name: 'Mine' })

const { t } = useI18n()
const router = useRouter()
const user = useUserStore()

const ic = (d) =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`

const menus = [
  { key: 'invite', bg: '#34c759', icon: ic('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6'), label: 'mine.invite', action: () => router.push('/invite') },
  { key: 'wallet', bg: '#3390ec', icon: ic('M3 8a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2M3 8v9a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3M3 8h16'), label: 'mine.wallet', action: () => router.push('/wallet') },
  { key: 'task', bg: '#ff9500', icon: ic('M8 6h11M8 12h11M8 18h11M3.5 6h.01M3.5 12h.01M3.5 18h.01'), label: 'mine.task', action: () => router.push('/task') },
  { key: 'privacy', bg: '#8e8e93', icon: ic('M14 3v4a1 1 0 0 0 1 1h4M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5z'), label: 'mine.privacy', action: () => router.push('/privacy') },
]

onMounted(() => track.page('mine'))
</script>
