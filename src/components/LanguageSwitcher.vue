<template>
  <div class="language-switcher">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 text-gray-600 xl:hover:text-gray-900 rounded-md xl:hover:bg-gray-100 transition-colors"
    >
      <span v-if="locale === 'en'" class="hidden md:block">{{ currentLanguage.flag }}</span>
      <span class="text-sm font-medium">{{ currentLanguage.name }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
    >
      <div class="py-1">
        <button
          v-for="(lang, code) in languages"
          :key="code"
          @click="switchLanguage(code)"
          class="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          :class="{ 'bg-blue-50 text-blue-600': code === locale }"
        >
          <span class="text-lg">{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { languages } from '@/locales'

const { locale } = useI18n()
const isOpen = ref(false)

const currentLanguage = computed(() => languages[locale.value])

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchLanguage = (langCode) => {
  locale.value = langCode
  isOpen.value = false
  localStorage.setItem('preferred-language', langCode)
}

const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.language-switcher')
  if (!dropdown) {
    isOpen.value = false
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}
</style>