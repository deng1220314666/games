<template>
  <div v-if="props.gameList.length > 0" class="w-full h-full p-4 xl:p-6 mt-2 bg-white shadow rounded-xl gap-2">
    <div class="font-medium text-base">{{ props.title }}</div>

    <div class="w-full h-full flex justify-start items-center gap-2 mt-[0.5rem] overflow-y-hidden whitespace-nowrap">
      <div
        class="overflow-x-auto hide-scrollbar py-2"
        ref="scrollContainer"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mouseleave="onMouseLeave"
        @mousemove="onMouseMove"
      >
        <div class="flex gap-2">
          <div
            v-for="(item, index) in props.gameList"
            :key="index"
            class="w-16 h-16 flex-shrink-0 relative"
            @click="handleClick(item.game_id)"
          >
            <!-- Close button for history games -->
            <button
              v-if="props.type === 'history'"
              @click.stop="handleRemoveGame(item.game_id)"
              class="absolute top-1 right-1 w-5 h-5 bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center z-10"
              title="Remove from history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <lazy-image
              :src="item.cover"
              :alt="item.name"
              container-class="w-full h-full"
              image-class="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
              spinner-size="medium"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useGameStore} from "@/stores/gameStore.js";
import {onMounted, reactive, defineProps, ref} from "vue";
import LazyImage from "@/components/LazyImage.vue";
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

const router = useRouter()
const gameStore = useGameStore()

const props = defineProps({
  gameList: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  }
})

const navigateToGameDetail = (gameId) => {
  if (gameId) {
    router.push(`/game/${gameId}`)
  }
}

// Remove game from history
const handleRemoveGame = (gameId) => {
  if (!gameId) return false
  gameStore.removeHistoryGame(gameId)
}

const scrollContainer = ref(null)
let isDragging = false
let startX = 0
let scrollLeft = 0

const onMouseDown = (e) => {
  isDragging = false
  startX = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft = scrollContainer.value.scrollLeft
  scrollContainer.value.style.cursor = 'grabbing'
  scrollContainer.value.addEventListener('mousemove', onDrag)
}

const onMouseUp = () => {
  scrollContainer.value.style.cursor = 'grab'
  scrollContainer.value.removeEventListener('mousemove', onDrag)
}

const onMouseLeave = () => {
  scrollContainer.value.style.cursor = 'grab'
  scrollContainer.value.removeEventListener('mousemove', onDrag)
}

const onDrag = (e) => {
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = x - startX
  if (Math.abs(walk) > 5) isDragging = true  // 超过5px认为是拖动
  scrollContainer.value.scrollLeft = scrollLeft - walk
}

const onMouseMove = () => {} // 占位，防止 Vue 警告

const handleClick = (gameId) => {
  if (!isDragging) {
    navigateToGameDetail(gameId)
  }
}
</script>

<style scoped>

</style>