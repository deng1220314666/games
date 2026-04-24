<template>
  <div class="game-search-container w-full mx-auto sm:px-4">
    <!-- 游戏列表 -->
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="filteredGames.length === 0" class="text-center py-8">
      <p class="text-lg sm:text-xl text-gray-600">{{ $t('gameSearch.noResults') }}</p>
    </div>

    <!-- 直接使用GameGrild组件展示分类游戏 -->
    <div v-else class="w-full">
      <game-list :games="filteredGames"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import GameList from '@/components/GameList.vue'
import { useGameStore } from '@/stores/gameStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const gameStore = useGameStore()

// 筛选状态
const selectedGameType = ref('')
const loading = ref(false)

// 根据URL参数获取分类ID并过滤游戏
const filteredGames = computed(() => {
  return gameStore.getGameType(selectedGameType.value)
})

// 从URL参数初始化分类筛选
const initFromUrlParams = () => {
  const categoryId = route.query.categoryId
  if (categoryId) {
    selectedGameType.value = categoryId
  }
}

// 监听外部点击
onMounted(() => {
  // 从URL参数初始化分类筛选
  initFromUrlParams()

  // 组件挂载时加载数据
  loading.value = true

  // 模拟数据加载延迟
  setTimeout(() => {
    loading.value = false
  }, 500)
})

// 监听路由变化，更新分类筛选
watch(() => route.query.categoryId, (newCategoryId) => {
  // 分类切换时添加loading效果
  loading.value = true
  selectedGameType.value = newCategoryId || ''
  
  // 模拟数据加载延迟
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
</style>