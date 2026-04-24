<template>
  <div class="w-full h-full flex flex-col">
    <div v-if="props.title" class="px-4 my-2 box-border">{{ props.title }}</div>

    <div class="flex-1 my-2 box-border px-4 overflow-x-auto scrollbar-hide">
      <div class="w-full h-full overflow-auto box-border flex flex-col gap-4">
        <div
          v-for="game in props.games"
          :key="game.id"
          class="flex items-center gap-4"
        >
          <!-- 封面 -->
          <img
            v-lazy="game.cover"
            :src="game.cover"
            alt=""
            class="w-16 h-16 rounded-xl flex-shrink-0 object-cover"
          />

          <!-- 文本区（关键：min-w-0） -->
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <div class="text-black text-base font-medium truncate">
              {{ game.name }}
            </div>

            <div class="text-[#333] text-xs mt-2 line-clamp-2">
              {{ game.desc }}
            </div>
          </div>

          <!-- 操作按钮 -->
          <button
            class="w-20 h-10 rounded-xl flex-shrink-0
             text-white text-sm font-medium
             bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"
            @click="handleGameClick(game)"
          >
            PLAY
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  games: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
})

const handleGameClick = (game) => {
  // router.replace(/game/${game.game_id})
  const url = new URL(window.location.href)
  url.pathname = `/game/${game.game_id}`
  window.location.href = url.toString()
}
</script>

<style scoped>

</style>