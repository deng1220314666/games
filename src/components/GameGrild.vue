<template>
  <div class="grid" v-if="showGrid">
    <div
      class="grid-item"
      v-for="(item, index) in gamesToRender"
      :key="index"
      :class="{ big: isBigItem(index) }"
    >
      <div class="content">
        <GameCard :value="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import GameCard from "@/components/GameCard.vue";

const props = defineProps({
  games: {
    type: Array,
    default: () => []
  }
});

// 是否展示整个组件
const showGrid = computed(() => props.games.length >= 6);

// 实际渲染的数据
const gamesToRender = computed(() => {
  const len = props.games.length;

  if (len < 6) return [];

  if (len > 6 && len < 9) {
    return props.games.slice(0, 6);
  }

  return props.games;
});

// 是否是需要放大的 item（第二条）
const isBigItem = (index) => {
  return props.games.length > 6 && props.games.length < 9 && index === 1;
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px;
  box-sizing: border-box;
  width: 100%;
  background: white;
  border-radius: 12px;
}

.grid-item {
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-2px);
}

/* 关键：第二条占 4 格 */
.grid-item.big {
  grid-column: span 2;
  grid-row: span 2;
  aspect-ratio: auto; /* 跨格后必须取消正方形限制 */
}

.content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

