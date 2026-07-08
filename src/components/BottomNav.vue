<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-xl items-stretch justify-around border-t border-white/10 bg-[#0b0c22]/85 backdrop-blur-xl"
    style="padding-bottom: env(safe-area-inset-bottom, 0px)"
  >
    <button
      v-for="item in items"
      :key="item.path"
      class="tap relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 pt-1.5"
      :class="isActive(item.path) ? 'text-white' : 'text-tg-hint'"
      :aria-label="t('nav.' + item.key)"
      @click="go(item.path)"
    >
      <span
        v-if="isActive(item.path)"
        class="absolute top-0 h-1 w-8 rounded-full grad-primary"
        style="box-shadow: 0 0 12px 2px rgba(108,92,255,0.7)"
      ></span>
      <span
        class="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200"
        :class="isActive(item.path) ? 'grad-primary glow-primary' : ''"
      >
        <svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" :fill="isActive(item.path) ? 'none' : 'none'" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path :d="item.icon" />
        </svg>
      </span>
      <span class="text-[10px] font-semibold leading-none">{{ t('nav.' + item.key) }}</span>
    </button>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TABS } from '@/config/index.js'
import { haptic } from '@/utils/platform.js'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// 单路径 SVG(描边风格,统一 1.8 stroke)
const paths = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5',
  task: 'M9 4h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1zM7 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1M8.5 12l2 2 4-4',
  invite: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6',
  wallet: 'M3 8a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2M3 8v9a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3M3 8h16m2 3h-4a2 2 0 0 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z',
  mine: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0',
}
const items = TABS.map((tab) => ({ ...tab, icon: paths[tab.key] }))

const isActive = (path) => route.path === path
const go = (path) => {
  haptic('light')
  if (route.path !== path) router.push(path)
}
</script>
