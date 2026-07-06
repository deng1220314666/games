<template>
  <div
    class="app-shell max-w-xl m-auto flex flex-col bg-tg-secondary text-tg-text"
    :style="{ minHeight: 'calc(var(--vh, 1vh) * 100)' }"
  >
    <router-view v-slot="{ Component }">
      <keep-alive include="Home,Task,Wallet,Mine">
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <BottomNav v-if="showTab" />
    <RewardToast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BottomNav from '@/components/BottomNav.vue'
import RewardToast from '@/components/RewardToast.vue'
import { initVhUnit } from '@/utils/init.js'
import { initGA } from '@/utils/event.js'
import { registerPwa } from '@/utils/pwa.js'
import { initPlatform } from '@/utils/platform.js'
import { OnClickReward } from '@/utils/adSdk.js'
import { login } from '@/services/user.js'
import { bindReferrerFromStart } from '@/services/referral.js'
import { restoreWallet } from '@/services/wallet.js'

const route = useRoute()
const { locale } = useI18n()
const showTab = computed(() => route.meta.tab === true)

initVhUnit()

onMounted(async () => {
  initPlatform()
  initGA()
  registerPwa()

  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) locale.value = savedLocale

  await login()
  await bindReferrerFromStart()
  restoreWallet()

  // 提前加载激励广告 SDK 脚本(仅脚本,不拉广告;广告在点击时才请求)
  OnClickReward.load()
})
</script>
