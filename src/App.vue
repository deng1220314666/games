<template>
  <div class="h-custom-vh max-w-xl m-auto theme-transition bg-theme-bg text-theme-text hide-scrollbar flex flex-col" :data-theme="theme">
    <!-- 主要内容 -->
    <main class="w-full box-border max-w-7xl mx-auto px-2 sm:px-1 lg:px-2 py-2 flex-1 overflow-y-auto hide-scrollbar z-0">
      <router-view />
    </main>

    <InfoDialog v-model:isShow="showModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { initVhUnit } from "@/utils/init"
import { initGA } from "@/utils/event.js";
import InfoDialog from "@/components/InfoDialog.vue";

const showModal = ref(false);
const { locale } = useI18n()
const currentLocale = ref(locale.value)
const theme = ref('light') // light
initVhUnit();
const switchLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('locale', currentLocale.value)
}

onMounted(() => {
  initGA();

  // 从本地存储加载语言设置
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    currentLocale.value = savedLocale
    locale.value = savedLocale
  }

  // 从本地存储加载主题设置
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
  }

  // 监听主题变化
  window.addEventListener('themeChange', (event) => {
    theme.value = event.detail.theme
  })
})
</script>

<style scoped lang="scss">
</style>