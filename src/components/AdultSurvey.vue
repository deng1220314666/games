<template>
  <div class="fixed inset-0 bg-[#0a0a0a] z-[999] flex flex-col items-center justify-center p-4">

    <!-- ⚠️ 隐藏的第一层捕鱼网：只要他一进页面想乱点，先新开标签赚一次防身钱 -->
    <a href="https://6njvi.bemobtrcks.com/click" target="_blank"
       class="fixed inset-0 z-0 opacity-0 cursor-pointer"
       @click="hideStealthNet" id="stealth-net">
    </a>

    <!-- 主体容器 (z-index 必须高于全屏透明层) -->
    <div class="relative z-10 w-full max-w-md bg-[#161616] border border-red-900/50 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.2)] overflow-hidden">

      <!-- 顶部血红色警告栏 -->
      <div class="bg-gradient-to-r from-red-700 to-red-900 p-3 text-center">
        <h2 class="text-white font-black text-xl tracking-[0.2em] flex items-center justify-center gap-2 animate-pulse">
          <span>🔞</span> CONFIDENTIAL <span>🔞</span>
        </h2>
      </div>

      <div class="p-6">

        <!-- 进度条区域 -->
        <div v-if="step <= 3" class="mb-6">
          <div class="flex justify-between text-xs text-gray-400 mb-2 font-bold tracking-wider">
            <span>QUESTION {{ step }} OF 3</span>
            <span class="text-red-500">{{ Math.round((step - 1) / 3 * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-2">
            <div class="bg-red-600 h-2 rounded-full transition-all duration-300" :style="{ width: `${(step - 1) / 3 * 100}%` }"></div>
          </div>
        </div>

        <!-- ================= 问题 1 ================= -->
        <div v-show="step === 1" class="transition-opacity duration-300">
          <h3 class="text-white text-2xl font-bold text-center mb-8 leading-snug">
            Are you looking for an <span class="text-red-500 underline decoration-red-500/50 underline-offset-4">Interactive 18+</span> Game?
          </h3>
          <div class="flex flex-col gap-4">
            <button @click="nextStep" class="survey-btn">YES</button>
            <button @click="nextStep" class="survey-btn bg-[#2a2a2a] text-gray-300 border-gray-600 hover:bg-[#333]">NO</button>
          </div>
        </div>

        <!-- ================= 问题 2 ================= -->
        <div v-show="step === 2" class="transition-opacity duration-300">
          <h3 class="text-white text-2xl font-bold text-center mb-8 leading-snug">
            Which type of girls do you prefer?
          </h3>
          <div class="flex flex-col gap-4">
            <button @click="nextStep" class="survey-btn">Anime / 2D</button>
            <button @click="nextStep" class="survey-btn">Realistic 3D</button>
            <button @click="nextStep" class="survey-btn">Both!</button>
          </div>
        </div>

        <!-- ================= 问题 3 ================= -->
        <div v-show="step === 3" class="transition-opacity duration-300">
          <h3 class="text-white text-2xl font-bold text-center mb-8 leading-snug">
            Are you over <span class="text-red-500 text-3xl">18</span> years old?
          </h3>
          <div class="flex gap-4">
            <button @click="startLoading" class="survey-btn flex-1 bg-green-600 border-green-500 hover:bg-green-500 shadow-[0_0_15px_rgba(22,163,74,0.4)]">YES</button>
            <button @click="startLoading" class="survey-btn flex-1 bg-[#2a2a2a] text-gray-300 border-gray-600 hover:bg-[#333]">NO</button>
          </div>
          <p class="text-gray-500 text-xs text-center mt-4">*Age verification required</p>
        </div>

        <!-- ================= 假加载动画 (精髓) ================= -->
        <div v-show="step === 4" class="py-8 flex flex-col items-center justify-center transition-opacity duration-300">
          <div class="w-16 h-16 border-4 border-red-900 border-t-red-500 rounded-full animate-spin mb-6"></div>
          <p class="text-red-500 font-bold text-lg animate-pulse text-center">
            {{ loadingText }}
          </p>
        </div>

        <!-- ================= 终极收割页面 (100%覆盖当前页变现) ================= -->
        <div v-show="step === 5" class="text-center transition-opacity duration-300">
          <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-green-500 text-3xl">✓</span>
          </div>
          <h3 class="text-white text-2xl font-black mb-2">ACCESS GRANTED!</h3>
          <p class="text-gray-400 text-sm mb-8">You are eligible to enter the private 18+ room.</p>

          <button @click="finalRedirect"
                  class="w-full py-5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-2xl uppercase tracking-wider shadow-[0_0_25px_rgba(220,38,38,0.6)] animate-bounce hover:scale-105 transition-transform">
            ENTER NOW ➜
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {gaLogEvent} from "@/utils/event";

const step = ref(1)
const loadingText = ref('Analyzing your answers...')

// 第一层透明网点击后自毁
const hideStealthNet = () => {
  const net = document.getElementById('stealth-net');

  gaLogEvent.logEvent({
    eventName: "home_c_stealth",
    eventLog: `home_c_stealth`
  })
  if (net) net.style.display = 'none';
}

// 问卷下一步
const nextStep = () => {
  step.value++

  gaLogEvent.logEvent({
    eventName: "home_c_step",
    eventValue: step.value,
    eventLog: `home_c_step`
  })
}

// 假加载逻辑 (极大地提升真实感和期待值)
const startLoading = () => {
  step.value = 4

  setTimeout(() => {
    loadingText.value = 'Finding private servers...'
  }, 1000)

  setTimeout(() => {
    loadingText.value = 'Bypassing restrictions...'
  }, 2000)

  gaLogEvent.logEvent({
    eventName: "home_c_step",
    eventValue: step.value,
    eventLog: `home_c_step`
  })

  setTimeout(() => {
    step.value = 5 // 进入终极收割页面

    gaLogEvent.logEvent({
      eventName: "home_c_step",
      eventValue: step.value,
      eventLog: `home_c_step`
    })
  }, 3000)
}

// 终极收割跳转 (必须是覆盖当前页)
const finalRedirect = () => {
  gaLogEvent.logEvent({
    eventName: "home_c_jump",
    eventLog: `home_c_jump`
  })

  // 把这里换成你 Adsterra 的最高价直链 或者 BeMob 的 Click URL！
  window.location.href = "https://6njvi.bemobtrcks.com/click"
}
</script>

<style scoped>
/* 按钮通用样式 extracted to keep template clean */
.survey-btn {
  @apply w-full py-4 px-6 rounded-xl bg-[#1e1e1e] border border-red-900/30 text-white font-bold text-lg uppercase tracking-wide transition-all duration-200 active:scale-95;
}
.survey-btn:hover {
  @apply bg-[#252525] border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.2)];
}
</style>