<template>
  <footer class="relative bottom-0 left-0 bg-white border-t border-gray-200 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-600 text-sm">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a
            href="/"
            class="text-gray-600 hover:text-gray-900 text-sm transition-colors"
          >
            {{ $t('nav.home') }}
          </a>
					<router-link
					  to="/privacy"
					  class="text-gray-600 hover:text-gray-900 text-sm transition-colors"
					>
					  {{ $t('nav.privacyPolicy') }}
					</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.router-link-active {
  font-weight: 500;
  color: #2563eb;
}
</style>