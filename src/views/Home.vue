<template>
  <div class="home flex flex-col items-start">
    <div v-for="(item, index) in category" :key="index" class="w-full mb-4">
      <!-- 分类标题栏 -->
      <div 
        class="category-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl mb-4 cursor-pointer hover:shadow-lg transition-all duration-300"
        @click="navigateToCategory(item.id)"
      >
        <div class="flex items-center">
          <img :src="item.img" alt="" class="w-10 h-10 mr-3 bg-white rounded-full p-1">
          <h2 class="text-xl font-bold">
            {{ $t('gameSearch.' + item.name.toLowerCase()) || (locale === 'zh' ? item.cn_name : item.name) }}
          </h2>
        </div>
        <div class="font-medium flex items-center">
          {{ $t('gameSearch.more') }} <span class="ml-1">></span>
        </div>
      </div>
      <!-- 游戏网格 -->
      <GameGrild :games="item.games"/>
    </div>
  </div>
</template>

<script setup>

import GameCard from "@/components/GameCard.vue"
import HistoryGame from "@/components/HistoryGame.vue"
import GameGroup from "@/components/GameGroup.vue"
import {useGameStore} from '@/stores/gameStore'
import {useI18n} from 'vue-i18n'
import {computed, onMounted, ref} from 'vue'
import {getQueryParam} from "@/utils/index.js"
import {useRouter} from "vue-router";
import GameGrild from "@/components/GameGrild.vue";
import { getGames, getCategory} from "@/api/mock.js";

const router = useRouter()

const {t, locale} = useI18n()
const gameStore = useGameStore()
const category = ref([])

const isTest = ref(false)

onMounted(async () => {
  await gameStore.setRecommendGame()
  gameStore.games = await getGames()
  category.value = await getCategory()
  isTest.value = !!getQueryParam("isTest")
  // 设置首页默认选中
  gameStore.selectedCategoryIndex = -2
})

const navigateToGameDetail = (id) => {
  router.push(`/game/${id}`)
}

// 跳转到分类游戏页面
const navigateToCategory = (categoryId) => {
  router.push({path: '/search', query: {categoryId}})
}
</script>

<style scoped>
.home {
  margin: 0 auto;
  width: 100%;
}
</style>