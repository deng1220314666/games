<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-xl items-stretch justify-around border-t border-tg-separator bg-tg-bg"
    style="padding-bottom: env(safe-area-inset-bottom, 0px)"
  >
    <button
      v-for="item in items"
      :key="item.path"
      class="flex min-h-[49px] flex-1 flex-col items-center justify-center gap-0.5 pt-1.5 transition-colors"
      :class="isActive(item.path) ? 'text-tg-button' : 'text-tg-hint'"
      :aria-label="t('nav.' + item.key)"
      @click="go(item.path)"
    >
      <svg class="h-6 w-6" viewBox="0 0 24 24" :fill="isActive(item.path) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path :d="item.icon" />
      </svg>
      <span class="text-[10px] font-medium leading-none">{{ t('nav.' + item.key) }}</span>
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
