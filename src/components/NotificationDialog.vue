<template>
  <div v-if="isVisible" class="fixed bottom-[40%] border-red left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-lg z-[999] overflow-hidden">
    <div class="p-5">
      <h3 class="text-lg font-semibold text-gray-900 mb-2 text-red-700">WARNING</h3>
      <p class="text-sm text-gray-500 mb-4 text-red-700">WARNING: Enable 18+ explicit content in the game. Are you over 18?</p>
      <div class="flex gap-3">
        <button
          @click="handleCancel"
          class="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          NO
        </button>
        <button
          @click="handleConfirm"
          class="flex-1 py-2.5 px-4 rounded-xl bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 transition-colors"
        >
          [YES, I AM 18+]
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {jumpUrl} from "../utils";

const isVisible = ref(true)
const emit = defineEmits(['confirm', 'cancel'])

const show = () => {
  isVisible.value = true
}

const hide = () => {
  isVisible.value = false
}

const handleConfirm = async () => {
  jumpUrl("https://www.profitablecpmratenetwork.com/eet0d835?key=edd631eedc507862650ff626c430b6da")
  // if ('Notification' in window && Notification.permission === 'default') {
  //   const permission = await Notification.requestPermission()
  //   if (permission === 'granted') {
  //     localStorage.setItem('notification_enabled', 'true')
  //   }
  // }
  hide()
  emit('confirm')
}

const handleCancel = () => {
  hide()
  emit('cancel')
  // jumpUrl("https://www.profitablecpmratenetwork.com/fq3key41?key=fc5b02ea1eb8e2a60efbe3e0a4204089")
}

defineExpose({ show, hide })

onMounted(() => {
  // if (!('Notification' in window)) return
  // if (Notification.permission === 'granted') return
  //
  // const hasShown = localStorage.getItem('notification_dialog_shown')
  // if (!hasShown) {
  //   setTimeout(() => {
  //     show()
  //     localStorage.setItem('notification_dialog_shown', 'true')
  //   }, 1000)
  // }
})
</script>

<style scoped>
</style>