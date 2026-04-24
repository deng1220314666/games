<template>
  <header class="w-full bg-white shadow-sm relative top-0 z-10000">
    <!-- 可滑动的分类菜单 -->
    <div class="category-scroll-container bg-white rounded-lg shadow p-2 w-full">
      <div ref="categoryContainer" class="category-container flex space-x-4 overflow-x-auto hide-scrollbar">
        <!-- 首页选项 -->
        <div
          class="category-item flex-shrink-0 px-4 py-2 rounded-2xl cursor-pointer transition-all duration-300"
          :class="{ 'bg-blue-500 text-white': gameStore.selectedCategoryIndex === -2, 'bg-gray-100 text-gray-800': gameStore.selectedCategoryIndex !== -2 }"
          @click="navigateToHome($event)"
        >
            <div class="w-full h-full flex items-center">
              <img class="w-6 h-6" src="@/assets/icons/all.png" alt="">
              <span class="pl-2">
                {{ $t('nav.home') }}
              </span>
            </div>
        </div>
        
        <!-- 游戏类型选项 -->
        <div
          v-for="(item, index) in gameStore.category" 
          :key="index"
          class="category-item flex-shrink-0 px-4 py-2 rounded-2xl cursor-pointer transition-all duration-300"
          :class="{ 'bg-blue-500 text-white': gameStore.selectedCategoryIndex === index, 'bg-gray-100 text-gray-800': gameStore.selectedCategoryIndex !== index }"
          @click="selectCategory(index, $event)"
        >
          <div class="w-full h-full flex items-center">
          <img class="w-6 h-6" v-lazy="item.img" alt="">
          <span class="pl-2">
            {{ locale === 'zh' ? item.cn_name : item.name }}
          </span>
        </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@/stores/gameStore'

const categoryContainer = ref(null)

// 监听 ESC 键关闭抽屉
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeDrawer()
  }
}

// I18n 和游戏商店
const { t, locale } = useI18n()
const gameStore = useGameStore()

// 跳转到首页
const navigateToHome = async (event) => {
  // 调用store中的导航方法
  gameStore.navigateToHome()
  
  await nextTick()
  
  // 获取点击的元素和容器
  const clickedElement = event.currentTarget
  const container = categoryContainer.value
  
  if (!clickedElement || !container) return
  
  // 计算滚动位置，使选中项居中
  const elementWidth = clickedElement.offsetWidth
  const containerWidth = container.offsetWidth
  const elementLeft = clickedElement.offsetLeft
  
  // 计算需要滚动的位置，使元素居中
  const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2)
  
  // 平滑滚动到计算的位置
  container.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  })
}

// 选择分类并滚动到中间
const selectCategory = async (index, event) => {
  // 调用store中的选择分类方法
  gameStore.selectCategory(index)

  await nextTick()
  
  // 获取点击的元素和容器
  const clickedElement = event.currentTarget
  const container = categoryContainer.value
  
  if (!clickedElement || !container) return
  
  // 计算滚动位置，使选中项居中
  const elementWidth = clickedElement.offsetWidth
  const containerWidth = container.offsetWidth
  const elementLeft = clickedElement.offsetLeft
  
  // 计算需要滚动的位置，使元素居中
  const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2)
  
  // 平滑滚动到计算的位置
  container.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  })
}

// 抽屉相关（保留原有功能）
const isDrawerOpen = ref(false)
const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}
const closeDrawer = () => {
  isDrawerOpen.value = false
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  
  // 初始化游戏分类数据
  gameStore.setCategoryGame();
  
  // 设置默认选中状态
  gameStore.updateSelectedCategoryByRoute();
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.router-link-active {
  font-weight: 500;
}

/* 抽屉动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* 抽屉内容动画 */
.drawer-content {
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
}

.drawer-open {
  transform: translateX(0);
}

/* 分类菜单样式 */
.category-container {
  padding: 4px;
  scroll-behavior: smooth;
}

.category-item {
  white-space: nowrap;
  transition: all 0.3s ease;
}

.category-item:hover {
  transform: translateY(-2px);
}
</style>