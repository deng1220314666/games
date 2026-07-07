<template>
  <div class="flex-1 overflow-y-auto px-4 pb-24 pt-4">
    <h1 class="mb-4 px-1 text-[22px] font-bold text-tg-text">{{ t('nav.invite') }}</h1>

    <!-- 奖励说明卡 -->
    <div class="tg-section mb-5 p-5" style="background: var(--tg-button); color: var(--tg-button-text)">
      <div class="text-[13px] opacity-85">{{ t('invite.headline') }}</div>
      <div class="tabular mt-1 text-[32px] font-bold leading-none">+{{ inviteReward }} {{ coinSymbol }}</div>
      <div class="mt-1.5 text-[13px] opacity-85">{{ t('invite.rebate', { pct: rebatePct }) }}</div>
    </div>

    <!-- 邀请码 -->
    <TgSection :header="t('invite.yourCode')">
      <div class="p-4">
        <div class="flex items-center gap-2">
          <div class="tabular flex-1 rounded-xl py-3 text-center text-lg font-bold tracking-[0.2em] text-tg-text" style="background: var(--tg-secondary-bg)">
            {{ links.code }}
          </div>
          <button
            class="rounded-xl px-4 py-3 text-sm font-semibold text-tg-hint"
            style="background: var(--tg-secondary-bg)"
            @click="copyCode"
          >
            {{ copied ? t('invite.copied') : t('invite.copy') }}
          </button>
        </div>
        <button
          class="mt-3 w-full rounded-xl py-3 text-[15px] font-semibold transition active:scale-[0.99]"
          style="background: var(--tg-button); color: var(--tg-button-text)"
          @click="onShare"
        >
          {{ t('invite.share') }}
        </button>
      </div>
    </TgSection>

    <!-- 已邀请列表 -->
    <TgSection :header="t('invite.friends') + ' · ' + referrals.length">
      <div v-if="referrals.length === 0" class="py-8 text-center text-sm text-tg-hint">
        {{ t('invite.noFriends') }}
      </div>
      <div v-for="r in referrals" :key="r.id" class="tg-row">
        <div class="min-w-0 flex-1 text-[15px] text-tg-text">{{ r.name }}</div>
        <span class="tabular text-[15px] font-semibold" style="color: var(--tg-button)">+{{ r.earned }}</span>
      </div>
    </TgSection>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import TgSection from '@/components/TgSection.vue'
import { APP, ECONOMY } from '@/config/index.js'
import { getInviteLinks, share, getReferrals, loadReferrals } from '@/services/referral.js'
import { track } from '@/utils/event.js'

defineOptions({ name: 'Invite' })

const { t } = useI18n()
const coinSymbol = APP.coinSymbol
const inviteReward = ECONOMY.reward.inviteRegister
const rebatePct = Math.round(ECONOMY.reward.inviteActiveRebate * 100)

const links = ref(getInviteLinks())
const referrals = ref(getReferrals())
const copied = ref(false)

function copyCode() {
  navigator.clipboard?.writeText(links.value.code)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
function onShare() {
  share()
}

onMounted(async () => {
  track.page('invite')
  await loadReferrals()
  referrals.value = getReferrals()
  links.value = getInviteLinks()
})
</script>
