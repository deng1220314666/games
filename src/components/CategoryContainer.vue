<template>
	<div class="category-scroll-container bg-white rounded-lg shadow p-2 w-full">
	  <div ref="categoryContainer" class="category-container flex space-x-4 overflow-x-auto hide-scrollbar">
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
</template>

<script setup>
	import { ref, onMounted, onUnmounted, nextTick } from 'vue'
	import { useI18n } from 'vue-i18n'
	import { useGameStore } from '@/stores/gameStore'
	import { useRouter } from 'vue-router'
	
	const { t, locale } = useI18n()
	const gameStore = useGameStore()
	const router = useRouter()
	
	// 分类选择相关
	const categoryContainer = ref(null)
	
	// 跳转到首页
	const navigateToHome = async (event) => {
    gameStore.selectedCategoryIndex = -2
    router.push({ path: '/' })
    
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
    // 设置选中状态
    gameStore.selectedCategoryIndex = index
    console.log('Selected category index:', index)

    // 跳转到游戏搜索页面并携带分类参数
    if (index === -1) {
      // 全部类型
      router.push({ path: '/search', query: {} })
    } else {
      // 特定分类
      const categoryId = gameStore.category[index].id
      router.push({ path: '/search', query: { categoryId } })
    }

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
	
	// 初始化时，从持久化存储中恢复选中的分类
onMounted(() => {
    gameStore.setCategoryGame();
    
    // 直接根据当前路由设置选中状态，不调用滚动函数避免重复跳转
    updateSelectedCategoryByRoute();
    
    // 监听路由变化，更新选中状态
    window.addEventListener('popstate', updateSelectedCategoryByRoute);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
    window.removeEventListener('popstate', updateSelectedCategoryByRoute);
});

// 根据路由更新选中的分类
const updateSelectedCategoryByRoute = () => {
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      // 首页
      gameStore.selectedCategoryIndex = -2;
    } else if (currentPath === '/search') {
      // 搜索页，检查是否有分类参数
      const urlParams = new URLSearchParams(window.location.search);
      const categoryId = urlParams.get('categoryId');
      if (categoryId) {
        // 特定分类，找到对应的索引
        const categoryIndex = gameStore.category.findIndex(cat => cat.id == categoryId);
        if (categoryIndex !== -1) {
          gameStore.selectedCategoryIndex = categoryIndex;
        } else {
          // 全部类型
          gameStore.selectedCategoryIndex = -1;
        }
      } else {
        // 全部类型
        gameStore.selectedCategoryIndex = -1;
      }
    } else {
      // 其他页面（如游戏详情页），不选中任何分类
      gameStore.selectedCategoryIndex = -3;
    }
}
</script>

<style scoped>
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