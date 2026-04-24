<template>
  <div class="w-full h-full contact bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">{{ t('contact.title') }}</h1>
      <p class="text-xl text-gray-600 mb-4 leading-relaxed">{{ t('contact.desc') }}</p>
      <p class="text-lg text-gray-700 font-semibold">{{ t('contact.email') }} {{ mail_1 }}gmail.com | {{ mail_2 }}qq.com</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const mail_1 = "ttgame.contact@"
const mail_2 = "842334785@"

</script>

<style scoped>
.contact {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}
</style>
