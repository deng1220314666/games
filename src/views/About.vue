<template>
  <div class="about min-h-screen py-8 bg-gray-50">
    <div class="max-w-4xl mx-auto px-4">

      <!-- 英文 / 中文标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">{{ t('about.title') }}</h1>
        <p class="text-xl text-gray-600 leading-relaxed mb-8">{{ t('about.description') }}</p>
      </div>

      <!-- 我们的使命 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">{{ t('about.mission_title') }}</h2>
        <p class="text-lg text-gray-700 text-center mb-8">{{ t('about.mission_desc') }}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 每条单独写 -->
          <div class="text-center p-6 bg-blue-50 rounded-lg">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl">{{ t('about.mission_points.0.icon') }}</span>
            </div>
            <h3 class="font-semibold text-blue-800 mb-2">{{ t('about.mission_points.0.title') }}</h3>
          </div>
          <div class="text-center p-6 bg-green-50 rounded-lg">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl">{{ t('about.mission_points.1.icon') }}</span>
            </div>
            <h3 class="font-semibold text-green-800 mb-2">{{ t('about.mission_points.1.title') }}</h3>
          </div>
          <div class="text-center p-6 bg-purple-50 rounded-lg">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl">{{ t('about.mission_points.2.icon') }}</span>
            </div>
            <h3 class="font-semibold text-purple-800 mb-2">{{ t('about.mission_points.2.title') }}</h3>
          </div>
        </div>
      </div>

      <!-- 为什么选择TTGame -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">{{ t('about.why_title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">{{ t('about.why_points.0.icon') }}</span>
            <div>
              <h3 class="font-semibold text-gray-800 mb-1">{{ t('about.why_points.0.title') }}</h3>
              <p class="text-gray-600">{{ t('about.why_points.0.desc') }}</p>
            </div>
          </div>
          <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">{{ t('about.why_points.1.icon') }}</span>
            <div>
              <h3 class="font-semibold text-gray-800 mb-1">{{ t('about.why_points.1.title') }}</h3>
              <p class="text-gray-600">{{ t('about.why_points.1.desc') }}</p>
            </div>
          </div>
          <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">{{ t('about.why_points.2.icon') }}</span>
            <div>
              <h3 class="font-semibold text-gray-800 mb-1">{{ t('about.why_points.2.title') }}</h3>
              <p class="text-gray-600">{{ t('about.why_points.2.desc') }}</p>
            </div>
          </div>
          <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">{{ t('about.why_points.3.icon') }}</span>
            <div>
              <h3 class="font-semibold text-gray-800 mb-1">{{ t('about.why_points.3.title') }}</h3>
              <p class="text-gray-600">{{ t('about.why_points.3.desc') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 结尾语 -->
      <div class="text-center">
        <p class="text-lg text-gray-700 italic">{{ t('about.footer') }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.about {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}
</style>
