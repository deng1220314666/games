<template>
	<div class="w-full h-full relative cursor-pointer group overflow-hidden" @click="jumpGame">
		<LazyImage
			:src="props.value.cover"
			:alt="props.value.name"
			container-class="w-full h-full bg-gray-200"
			image-class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
			spinner-size="medium"
		/>
		<!-- 游戏名称悬浮层 -->
		<div class="hidden sm:block absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
      <div class="w-full h-full flex items-center justify-center z-0">
        <h3 class="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
          {{ props.value.name }}
        </h3>
      </div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LazyImage from './LazyImage.vue'
import { gaLogEvent } from "@/utils/event.js"
import {onMounted, ref, defineProps} from "vue";
import {useAdUtilsStore} from "@/stores/adsUtils"

const props = defineProps({
	value: {
		type: Object,
		default: () => {},
		required: true
	}
})

const router = useRouter()

const adsUtilsStore = useAdUtilsStore();

const showDialog = () => {
  adsUtilsStore.setDialogStatus(true);
  adsUtilsStore.gameId = props.value.game_id;
}

const jumpGame = () => {
  gaLogEvent.logEvent({
    eventName: "enter_game",
    eventValue: props.value.game_id,
    eventLog: `Enter Game`
  });
  router.push(`/game/${props.value.game_id}`);
}
</script>

<style scoped>
/* .w-full {
	position: relative;
	overflow: hidden;
	border-radius: 0.5rem;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.w-full:hover {
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
} */
</style>