<template>
  <transition name="reward-pop">
    <div
      v-if="visible"
      class="tabular fixed left-1/2 top-20 z-[9999] -translate-x-1/2 rounded-full px-6 py-3 text-lg font-bold shadow-xl"
      style="background: var(--tg-button); color: var(--tg-button-text)"
    >
      +{{ amount }} {{ coinSymbol }}
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { APP } from '@/config/index.js'
import { haptic } from '@/utils/platform.js'

const coinSymbol = APP.coinSymbol
const visible = ref(false)
const amount = ref(0)
let timer = null

function onEarn(e) {
  amount.value = e.detail.amount
  visible.value = true
  haptic('medium')
  clearTimeout(timer)
  timer = setTimeout(() => (visible.value = false), 1600)
}

onMounted(() => window.addEventListener('reward:earn', onEarn))
onUnmounted(() => {
  window.removeEventListener('reward:earn', onEarn)
  clearTimeout(timer)
})
</script>

<style scoped>
.reward-pop-enter-active,
.reward-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.reward-pop-enter-from,
.reward-pop-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.8);
}
</style>
