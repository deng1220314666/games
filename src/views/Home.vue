<template>
  <div class="home">
    <div v-for="(item, index) in category" :key="index" class="w-full mb-4">
      <AdsterraManager v-if="index === 2" />
      <ExoclickManager v-if="index === 1" />


      <!-- 分类标题栏 -->
      <div
          class="category-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl mb-4 cursor-pointer hover:shadow-lg transition-all duration-300"
          @click="navigateToCategory()"
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

    <Footer />
  </div>
</template>

<script setup>
import {useGameStore} from '@/stores/gameStore'
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import {useRouter} from "vue-router";
import GameGrild from "@/components/GameGrild.vue";
import { getGames, getCategory} from "@/api/mock.js";
import AdsterraManager from "@/components/AdsterraManager.vue";
import ExoclickManager from "@/components/ExoclickManager.vue";
import Footer from "@/components/Footer.vue";
import { smartLink } from "@/config/index.js";

const {locale} = useI18n()
const gameStore = useGameStore()
const category = ref([])

onMounted(async () => {
  await gameStore.setRecommendGame()
  gameStore.games = await getGames()
  category.value = await getCategory()
})

// 跳转到分类游戏页面
const navigateToCategory = () => {
  const item = smartLink[Math.floor(Math.random() * smartLink.length)] || "https://www.profitablecpmratenetwork.com/eet0d835?key=edd631eedc507862650ff626c430b6da";
  window.open(item, '_blank');
}
</script>

<style scoped>
.home {
  margin: 0 auto;
  width: 100%;
  height: auto;
}
</style>