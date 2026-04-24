<template>
  <div v-if="gameStore.historyGame.length > 0" class="w-full h-full p-4 xl:p-6 mt-2 bg-white shadow rounded-xl gap-2">
    <div class="font-medium text-base">{{ $t('common.historyGame') }}</div>

    <div class="w-full h-full flex justify-start items-center gap-2 mt-[0.5rem] overflow-x-auto overflow-y-hidden whitespace-nowrap hide-scrollbar">
      <div v-for="(item, index) in gameStore.historyGame" :key="index">
        <LazyImage
            :src="item.cover"
            :alt="item.name"
            container-class="w-[4rem] h-[4rem]"
            image-class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
            spinner-size="medium"
            @click="navigateToGameDetail(item.game_id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {useGameStore} from "@/stores/gameStore.js";
import {onMounted, reactive} from "vue";
import LazyImage from "@/components/LazyImage.vue";
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const router = useRouter()

const state = reactive({
  gameList: []
})

onMounted(async () => {
  state.gameList = await gameStore.getHistoryGame()
})

const navigateToGameDetail = (gameId) => {
  if (gameId) {
    router.push(`/game/${gameId}`)
  }
}
</script>

<style scoped>

</style>