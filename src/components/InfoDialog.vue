<template>
  <div v-if="props.isShow" class="fixed top-0 left-0 w-full h-full z-[999999] flex justify-center items-center">
    <div class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)]"></div>

    <div class="flex flex-col justify-center items-center w-[90%] min-h-[15rem] max-h-[80vh]">
      <div class="flex flex-col transform w-[90%] min-h-[15rem] max-h-[80vh] bg-white rounded-xl relative">

        <!-- 关闭按钮 -->
        <div @click="handleClose()" class="absolute right-[1rem] top-[.1rem] cursor-pointer">
          X
        </div>

<!--        <div class="w-[80%] pt-[1rem] pb-[.5rem] mx-auto text-center">-->
<!--          Do you want to exit?-->
<!--        </div>-->

        <div class="flex-1 mx-auto w-full max-w-[90%] max-h-[80vh] overflow-auto mt-[2rem]">
          <AdsterraManager style="min-height: 250px;" idTxt="adsterra-banner-4-box" :zid="1" />
        </div>

        <div
            @click="jump"
            class="w-[60%] h-[3rem] mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white flex justify-center items-center my-[.5rem]"
        >
          More exciting content
        </div>
      </div>

      <!-- 底部区域 -->
      <div class="flex-col w-[90%] justify-center items-center mt-[1rem] z-10">
        <div v-if="props.duration > 0" class="w-full text-center text-white mt-2 text-[.7rem]">
          Redirecting automatically in {{ timeNum }} seconds
        </div>

        <div class="w-full h-[3rem] mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white flex justify-center items-center mt-2">
          To Game
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import AdsterraManager from "./AdsterraManager.vue";
import { jumpUrl } from "../utils";
import { gaLogEvent } from "@/utils/event";
import { useAdUtilsStore } from "@/stores/adsUtils";

const adsUtilsStore = useAdUtilsStore();

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 3
  }
});

const timeNum = ref(0);
let timer = null;

/**
 * 清理定时器
 */
const clearTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

/**
 * 监听弹窗开关（核心）
 */
watch(
    () => props.isShow,
    (val) => {
      if (val) {
        // 打开
        timeNum.value = props.duration;
        startTimes();

        gaLogEvent.logEvent({
          eventName: "back_dialog",
          eventValue: "dialog",
          eventLog: `back_dialog`
        });
      } else {
        clearTimer();
      }
    },
    { immediate: true }
);

/**
 * 开始倒计时
 */
const startTimes = () => {
  clearTimer();

  if (timeNum.value > 0) {
    timer = setInterval(() => {
      timeNum.value--;

      if (timeNum.value <= 0) {
        clearTimer();
        handleClose();
      }
    }, 1000);
  }
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  clearTimer();

  adsUtilsStore.setDialogStatus(false);
};

/**
 * 跳转
 */
const jump = () => {
  jumpUrl("https://www.profitablecpmratenetwork.com/y5p95qwz?key=60cd56236d8caddc568fdc4744ec1f18");
};

/**
 * 组件销毁时清理
 */
onUnmounted(() => {
  clearTimer();
});
</script>

<style scoped>
</style>