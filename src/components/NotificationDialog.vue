<template>
  <!-- 1. 全屏黑色半透明遮罩，禁止用户点其他地方 -->
  <div v-if="isVisible" class="fixed flex-col inset-0 bg-black/25 backdrop-blur-sm z-[999] flex items-center justify-start">

    <!-- 2. 弹窗主体：暗黑风格，红色边框，震慑力拉满 -->
    <div class="w-[90%] max-w-sm bg-gray-900 border-2 border-red-600 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] overflow-hidden mt-[11rem]">

      <!-- 警告图标与标题 -->
      <div class="bg-red-600 p-3 text-center">
        <h3 class="text-xl font-extrabold text-white tracking-widest flex items-center justify-center gap-2">
          <span>⚠️</span> 18+ WARNING <span>⚠️</span>
        </h3>
      </div>

      <div class="p-6 text-center">
        <p class="text-base text-gray-200 mb-6 font-medium leading-relaxed">
          This game contains highly explicit <span class="text-red-500 font-bold">ADULT CONTENT</span>.<br>
          You must be 18+ to enter.
        </p>

        <!-- 3. 按钮布局：巨大无比的 YES，微小的 NO -->
        <div class="flex flex-col gap-4">
          <!-- YES 按钮：极其醒目，带有呼吸灯动画吸引点击 -->
          <button
              @click="handleConfirm"
              class="w-full py-4 px-4 rounded-lg bg-green-500 text-white font-black text-xl shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse hover:bg-green-400 active:scale-95 transition-all"
          >
            YES, I AM 18+ !
          </button>

          <!-- NO 按钮：弱化成文字，颜色暗淡 -->
          <button
              @click="handleCancel"
              class="text-gray-500 font-medium text-sm hover:text-gray-300"
          >
            No, I want to leave
          </button>
        </div>
      </div>
    </div>

    <AdsterraManager style="position: fixed; bottom: 0; left: 0;" idTxt="adsterra-banner-1-box" :zid="1" :immediate="false" :showTitle="true"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { jumpUrl } from "../utils";
import {gaLogEvent} from "@/utils/event";
import AdsterraManager from "@/components/AdsterraManager.vue";

const isVisible = ref(true)
const emit = defineEmits(['confirm', 'cancel'])

// 收割逻辑 1：点 YES 直接进高收益直链
const handleConfirm = async () => {
  // 这是你的高收益主打链接
  window.location.href = "https://www.profitablecpmratenetwork.com/eet0d835?key=edd631eedc507862650ff626c430b6da";
  isVisible.value = false
  emit('confirm')

  gaLogEvent.logEvent({
    eventName: "dialog_confirm",
    eventValue: "",
    eventLog: `dialog_confirm`
  })
}

// 收割逻辑 2：点 NO 也不放过，跳另一个直链赚差价！
const handleCancel = () => {
  // 把原来注释掉的链接打开！他只要动了手指，就必须变现！
  window.location.href = "https://www.profitablecpmratenetwork.com/fq3key41?key=fc5b02ea1eb8e2a60efbe3e0a4204089";
  isVisible.value = false
  emit('cancel')

  gaLogEvent.logEvent({
    eventName: "dialog_cancel",
    eventValue: "",
    eventLog: `dialog_cancel`
  })
}
</script>