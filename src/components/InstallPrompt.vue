<template>
  <div v-if="isVisible && isAndroidChrome()" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] w-full bg-white rounded-t-2xl shadow-lg z-[998] overflow-hidden">
    <div class="p-4 flex items-center gap-3">
      <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold text-gray-900">Add to Home Screen</h4>
        <p class="text-xs text-gray-500 truncate">Install for better experience</p>
      </div>
      <button
        @click="handleInstall"
        class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors"
      >
        Install
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {gaLogEvent} from "../utils/event";

const isVisible = ref(true)
let deferredPrompt = null

const isAndroidChrome = () => {
  const ua = navigator.userAgent.toLowerCase()
  const isAndroid = ua.includes('android')
  const isChrome = ua.includes('chrome') && !ua.includes('edg') && !ua.includes('opr')
  const isWebView = ua.includes('wv') || ua.includes('version') || ua.includes('line/') || ua.includes('fbav') || ua.includes('instagram')
  return isAndroid && isChrome && !isWebView
}

const handleInstall = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      isVisible.value = false
      gaLogEvent.logEvent({
        eventName: "install_prompt_shown",
        eventValue: "",
        eventLog: `install_prompt_shown Smart Link`
      })
    }
    deferredPrompt = null
  }
}

const handleBeforeInstall = (e) => {
  e.preventDefault()
  deferredPrompt = e
}

onMounted(() => {
  if (!isAndroidChrome()) return

  window.addEventListener('beforeinstallprompt', handleBeforeInstall)

  const isInPwa = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  if (isInPwa) return

  const hasShown = localStorage.getItem('install_prompt_shown')
  if (!hasShown) {
    setTimeout(() => {
      if (deferredPrompt) {
        isVisible.value = true
        localStorage.setItem('install_prompt_shown', 'true')
      }
    }, 2000)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
})
</script>

<style scoped>
</style>