<template>
  <div class="flex flex-col">
    <Header />

    <div class="flex flex-1 p-4 w-screen items-center justify-center flex-col">

    </div>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue"
import {onMounted, reactive} from "vue"
import { useGameStore } from '@/stores/gameStore'

const { games } = useGameStore();

const state = reactive({
  searchValue: "",
  searchGames: []
})

/**
 * 查询游戏
 */
const searchGames = () => {
  return games.filter(game => {
    return game.name.includes(state.searchValue);
  });
}

onMounted(() => {
})
</script>

<style scoped>

</style>