<template>
  <!-- 全屏遮罩背景 -->
  <div v-if="isVisible" class="fixed inset-0 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
    
    <!-- 主卡片 -->
    <div class="w-full max-w-[340px] bg-gradient-to-b from-[#1a1f35] to-[#12162a] rounded-3xl shadow-[0_8px_40px_rgba(99,102,241,0.15),0_0_80px_rgba(139,92,246,0.1)] border border-white/10 overflow-hidden">
      
      <!-- 顶部状态栏 -->
      <div class="px-5 pt-6 pb-4 flex items-center gap-3 border-b border-white/5">
        <!-- 在线状态指示器 -->
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
          </div>
          <!-- 绿色在线点 -->
          <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#1a1f35]">
            <div class="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
        
        <!-- 用户在线文字 -->
        <div class="flex flex-col">
          <span class="text-white/90 text-sm font-semibold">{{ t.privateAccess }}</span>
          <span class="text-emerald-400/80 text-xs">{{ randomNumStr }} {{ t.onlineUsers }}</span>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="px-5 py-6 text-center">
        <!-- 标题 -->
        <h2 class="text-2xl font-bold text-white mb-3 tracking-tight">
          {{ t.title }}
        </h2>
        
        <!-- 副标题 -->
        <p class="text-white/60 text-sm leading-relaxed mb-6">
          {{ t.desc1 }}<br>
          {{ t.desc2 }}
        </p>

        <!-- 用户预览卡片 -->
        <div class="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
          <div class="flex items-center gap-4">
            <!-- 女性头像（模糊效果） -->
            <div class="relative w-14 h-14 rounded-full flex-shrink-0">
<!--              <div class="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500"></div>-->
              <div class="relative rounded-full inset-0 overflow-hidden z-[20]">
                <div class="absolute w-full h-full rounded-full backdrop-blur-sm z-[999999]"></div>
                <img :src="randomUser.img" alt="img">
              </div>

              <!-- 在线徽章 -->
              <div class="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#1a1f35] z-[30]"></div>
            </div>
            
            <!-- 用户信息 -->
            <div class="flex-1 text-left">
              <div class="flex items-center gap-2">
                <span class="text-white font-semibold text-base">{{ randomUser.name }}, {{ randomUser.age }}</span>
                <span class="bg-emerald-400/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">{{ t.online }}</span>
              </div>
              <p class="text-white/40 text-xs mt-1">{{ t.requestText }}</p>
            </div>
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="flex flex-col gap-3">
          <!-- 主要按钮：紫色渐变 -->
          <button
            @click="handleConfirm"
            class="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-base shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_30px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all duration-200"
          >
            {{ t.continueBtn }}
          </button>

          <!-- 次要按钮：灰色透明 -->
          <button
            @click="handleCancel"
            class="w-full py-3 px-6 rounded-xl bg-white/5 text-white/50 font-medium text-sm hover:bg-white/10 hover:text-white/70 active:scale-[0.98] transition-all duration-200"
          >
            {{ t.laterBtn }}
          </button>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="px-5 pb-5 text-center">
        <p class="text-white/30 text-xs">
          {{ t.footer }}
        </p>
      </div>
    </div>

<!--    <AdsterraManager style="position: fixed; bottom: 0; left: 0;" idTxt="adsterra-banner-1-box" :zid="1" :immediate="false" :showTitle="true"/>-->
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import { jumpUrl, randomNum } from "../utils";
import {gaLogEvent} from "@/utils/event";
import { getLangConfig } from "@/config/langConfig";
import AdsterraManager from "@/components/AdsterraManager.vue";

const t = computed(() => getLangConfig())

const userList = ref([
  {
    id: 0,
    name: 'Angela',
    age: 24,
    img: new URL('../assets/adsimg/b.png', import.meta.url).href
  },
  {
    id: 1,
    name: 'Jasmine',
    age: 22,
    img: new URL('../assets/adsimg/c.webp', import.meta.url).href
  },
  {
    id: 2,
    name: 'Nicole',
    age: 19,
    img: new URL('../assets/adsimg/d.jpg', import.meta.url).href
  },
  {
    id: 3,
    name: 'Princess',
    age: 21,
    img: new URL('../assets/adsimg/e.jpeg', import.meta.url).href
  }
])

const isVisible = ref(true)
const emit = defineEmits(['confirm', 'cancel'])
const randomNumStr = computed(() => randomNum())
const randomUser = computed(() => getRandomUser(userList.value))

// 收割逻辑 1：点 YES 直接进高收益直链
const handleConfirm = async () => {
  // 这是你的高收益主打链接
  window.location.href = "https://6njvi.bemobtrcks.com/click";
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
  window.location.href = "https://6njvi.bemobtrcks.com/click";
  isVisible.value = false
  emit('cancel')

  gaLogEvent.logEvent({
    eventName: "dialog_cancel",
    eventValue: "",
    eventLog: `dialog_cancel`
  })
}

const getRandomUser = (data) => {
  if (!data?.length) {
    return null
  }

  const index = Math.floor(Math.random() * data.length)

  return data[index]
}
</script>