<template>
  <div class="mobile-item bg-white overflow-hidden">

    <!-- ========== iframe 游戏层（底层） ========== -->
    <div class="absolute inset-0 z-10">
      <iframe
          ref="gameIframe"
          class="w-full h-[calc(100%-50px)]"
          style="border: none"
          allowfullscreen
          allow="autoplay; fullscreen"
      />
      <AdsterraAnchor />
    </div>

    <!-- ========== 顶部信息 + Loading 层 ========== -->
    <div
        class="absolute inset-0 z-20 bg-white transition-transform duration-300 flex flex-col"
        :class="{ '-translate-y-full': !state.isShow }"
    >

      <!-- 顶部卡片 -->
      <div class="relative w-full h-70">
        <img
            v-if="props.gameInfo?.cover"
            :src="props.gameInfo.cover"
            class="w-full h-60 object-cover"
        />
        <div v-else class="w-full h-60 bg-gray-200 flex items-center justify-center">
          <span class="text-gray-400">No Cover</span>
        </div>

        <div
            class="absolute top-0 left-0 w-full h-[15.88rem]
                 backdrop-blur-sm bg-gradient-to-b from-transparent to-white"
        >
          <div class="w-[90%] mt-32 mx-auto flex items-center">
            <img
                v-if="props.gameInfo?.cover"
                :src="props.gameInfo.cover"
                class="w-16 h-16 rounded-xl"
            />
            <div v-else class="w-16 h-16 rounded-xl bg-gray-200"/>

            <div class="flex-1 ml-4">
              <div class="text-xl font-bold text-black">
                {{ props.gameInfo.name }}
              </div>
              <div class="text-xs text-black/70 mt-1">
                {{ props.gameInfo.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading / Play -->
      <div
          class="w-[calc(100%-2rem)] h-12 rounded-xl overflow-hidden relative
               bg-cyan-400 mx-auto"
      >
        <div
            v-if="state.progress < 100"
            class="absolute inset-0 flex items-center justify-center
                 text-white text-lg font-bold"
        >
          Loading {{ state.progress }}%
        </div>

        <div
            v-else
            class="absolute inset-0 flex items-center justify-center
                 text-white text-lg font-bold cursor-pointer"
            @click="enterGame"
        >
          PLAY
        </div>
      </div>


      <!-- 推荐列表 -->
      <div class="flex-1 overflow-auto mt-4">
        <div id="container-155789be5aa8a606b97a7d9e19e14adb"></div>

        <GameList :games="gameStore.recommendList"/>
      </div>
    </div>

    <!-- ========== 关闭按钮（最高层） ========== -->
    <div class="closeBtn" id="closeBtn" data-v-7e32e512="" title="close" @click="goBack">
      <svg t="1750155431203" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
           p-id="10848" width="16" height="16">
        <path
            d="M858.3 311.2C894 372.5 912 439.4 912 512s-17.9 139.5-53.7 200.8C822.5 774 774 822.6 712.8 858.3S584.6 912 512 912s-139.5-17.9-200.8-53.7c-61.2-35.7-109.7-84.2-145.6-145.6C129.9 651.5 112 584.6 112 512c0-72.5 17.9-139.4 53.7-200.8 35.7-61.2 84.2-109.7 145.6-145.6C372.5 130 439.4 112 512 112c72.5 0 139.4 17.9 200.8 53.7C774 201.5 822.5 250 858.3 311.2z m-204.1-44.4c-43.4-25.3-90.8-38-142.2-38s-98.8 12.7-142.2 38-77.8 59.7-103.1 103.1-38 90.8-38 142.2c0 51.4 12.7 98.8 38 142.2s59.7 77.8 103.1 103.1c43.4 25.3 90.8 38 142.2 38s98.8-12.7 142.2-38c43.4-25.3 77.8-59.7 103.1-103.1 25.3-43.4 38-90.8 38-142.2s-12.7-98.8-38-142.2c-25.4-43.4-59.8-77.8-103.1-103.1z m-47.9 151c26.1 26.1 39.1 57.5 39.1 94.3s-13 68.2-39.1 94.3c-26.1 26.1-57.5 39.1-94.3 39.1s-68.2-13-94.3-39.1c-26.1-26.1-39.1-57.5-39.1-94.3s13-68.2 39.1-94.3c26.1-26.1 57.5-39.1 94.3-39.1s68.2 13 94.3 39.1z"
            p-id="10849" fill="#dbdbdb"></path>
      </svg>
    </div>

  </div>
</template>

<script setup>
import {onMounted, reactive, ref, defineProps, watch} from "vue";
import {useRouter} from "vue-router";
import {useGameStore} from "@/stores/gameStore";
import GameList from "./GameList.vue";
import AdsterraAnchor from "./AdsterraAnchor.vue";
import { AdsterraAd } from "@/utils/adSdk.js";
import { gaLogEvent } from "@/utils/event.js";

const router = useRouter();
const gameStore = useGameStore();
const gameIframe = ref(null);

const props = defineProps({
  gameInfo: {type: Object, default: ""},
  gameUrl: {type: String, default: ""}
});

const state = reactive({
  progress: 0,
  isShow: true
});

watch(
    () => props.gameUrl,
    (url) => {
      if (!url || !gameIframe.value) return;
      gameIframe.value.src = url;
    },
    { immediate: true }
);

onMounted(() => {
  if (AdsterraAd) {
    AdsterraAd.showNativeBanner("ttgame");
  }
  startLoading();
});

const startLoading = () => {
  const timer = setInterval(() => {
    state.progress += 2;
    if (state.progress >= 100) {
      state.progress = 100;
      clearInterval(timer);
    }
  }, 40);
};

const enterGame = () => {
  state.isShow = false;
  gameStore.addHistoryGame(props.gameInfo.game_id);
  gaLogEvent.logEvent({
    eventName: "enter_game_details",
    eventValue: props.gameInfo.game_id,
    eventLog: `Enter Game Details`
  })
  startGame();
};

async function startGame() {
  const cid = localStorage.getItem("bemob_cid");

  if (!cid) {
    console.warn("No cid found");
    return;
  }

  try {
    // 👉 回传 Bemob（核心）
    await fetch(
        `https://h4imw.bemobtrcks.com/postback?cid=${cid}&status=1`,
        {
          method: "GET",
          mode: "no-cors"
        }
    );
    gaLogEvent.logEvent({
      eventName: "bemobtrcks_start",
      eventLog: `Bemobtrcks Start`
    })
    console.log("Conversion sent:", cid);
  } catch (e) {
    console.error("postback failed", e);
  }
}

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.mobile-item {
  position: fixed;
  inset: 0;
  z-index: 100000;
  height: 100%;
}

/* 关闭按钮 */
.closeBtn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 25px;
  text-align: center;
  line-height: 31px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
}
</style>
