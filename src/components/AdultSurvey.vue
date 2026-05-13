<template>
  <div class="fixed inset-0 bg-[#0a0a0a] z-[999] flex flex-col items-center justify-center p-4">

    <!-- stealth -->
    <a
        href="https://6njvi.bemobtrcks.com/click"
        target="_blank"
        class="fixed inset-0 z-0 opacity-0 cursor-pointer"
        @click="hideStealthNet"
        id="stealth-net"
    />

    <div
        class="relative z-10 w-full max-w-md bg-[#161616] border border-red-900/50 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.2)] overflow-hidden"
    >

      <!-- header -->
      <div class="bg-gradient-to-r from-red-700 to-red-900 p-3 text-center">
        <h2
            class="text-white font-black text-xl tracking-[0.2em] flex items-center justify-center gap-2 animate-pulse"
        >
          <span>🔞</span>
          {{ t.confidential }}
          <span>🔞</span>
        </h2>
      </div>

      <div class="p-6">

        <!-- progress -->
        <div v-if="step <= 3" class="mb-6">
          <div
              class="flex justify-between text-xs text-gray-400 mb-2 font-bold tracking-wider"
          >
            <span>
              {{ t.question }} {{ step }} {{ t.of }} 3
            </span>

            <span class="text-red-500">
              {{ Math.round(((step - 1) / 3) * 100) }}%
            </span>
          </div>

          <div class="w-full bg-gray-800 rounded-full h-2">
            <div
                class="bg-red-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${((step - 1) / 3) * 100}%` }"
            />
          </div>
        </div>

        <!-- step 1 -->
        <div v-show="step === 1" class="transition-opacity duration-300">
          <h3
              class="text-white text-2xl font-bold text-center mb-8 leading-snug"
          >
            {{ t.q1_1 }}

            <span
                class="text-red-500 underline decoration-red-500/50 underline-offset-4"
            >
              {{ t.q1_2 }}
            </span>
          </h3>

          <div class="flex flex-col gap-4">
            <button
                @click="nextStep"
                class="survey-btn"
            >
              {{ t.yes }}
            </button>

            <button
                @click="nextStep"
                class="survey-btn bg-[#2a2a2a] text-gray-300 border-gray-600 hover:bg-[#333]"
            >
              {{ t.no }}
            </button>
          </div>
        </div>

        <!-- step 2 -->
        <div v-show="step === 2" class="transition-opacity duration-300">
          <h3
              class="text-white text-2xl font-bold text-center mb-8 leading-snug"
          >
            {{ t.q2 }}
          </h3>

          <div class="flex flex-col gap-4">
            <button
                @click="nextStep"
                class="survey-btn"
            >
              {{ t.anime }}
            </button>

            <button
                @click="nextStep"
                class="survey-btn"
            >
              {{ t.realistic }}
            </button>

            <button
                @click="nextStep"
                class="survey-btn"
            >
              {{ t.both }}
            </button>
          </div>
        </div>

        <!-- step 3 -->
        <div v-show="step === 3" class="transition-opacity duration-300">
          <h3
              class="text-white text-2xl font-bold text-center mb-8 leading-snug"
          >
            {{ t.q3_1 }}

            <span class="text-red-500 text-3xl">
              18
            </span>

            {{ t.q3_2 }}
          </h3>

          <div class="flex gap-4">
            <button
                @click="startLoading"
                class="survey-btn flex-1 bg-green-600 border-green-500 hover:bg-green-500 shadow-[0_0_15px_rgba(22,163,74,0.4)]"
            >
              {{ t.yes }}
            </button>

            <button
                @click="startLoading"
                class="survey-btn flex-1 bg-[#2a2a2a] text-gray-300 border-gray-600 hover:bg-[#333]"
            >
              {{ t.no }}
            </button>
          </div>

          <p class="text-gray-500 text-xs text-center mt-4">
            {{ t.ageVerify }}
          </p>
        </div>

        <!-- loading -->
        <div
            v-show="step === 4"
            class="py-8 flex flex-col items-center justify-center transition-opacity duration-300"
        >
          <div
              class="w-16 h-16 border-4 border-red-900 border-t-red-500 rounded-full animate-spin mb-6"
          />

          <p
              class="text-red-500 font-bold text-lg animate-pulse text-center"
          >
            {{ loadingText }}
          </p>
        </div>

        <!-- final -->
        <div
            v-show="step === 5"
            class="text-center transition-opacity duration-300"
        >
          <div
              class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span class="text-green-500 text-3xl">✓</span>
          </div>

          <h3 class="text-white text-2xl font-black mb-2">
            {{ t.accessGranted }}
          </h3>

          <p class="text-gray-400 text-sm mb-8">
            {{ t.privateRoom }}
          </p>

          <button
              @click="finalRedirect"
              class="w-full py-5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-2xl uppercase tracking-wider shadow-[0_0_25px_rgba(220,38,38,0.6)] animate-bounce hover:scale-105 transition-transform"
          >
            {{ t.enterNow }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { gaLogEvent } from '@/utils/event'

const step = ref(1)

const langConfig = {
  en: {
    // 顶部警告栏
    confidential: 'PRIVATE & SECURE', // 隐私与安全 (降低防备心)

    // 进度条
    question: 'STEP', // 把"问题"改成"步骤"，更像是在解锁某个东西
    of: 'OF',

    // 按钮通用
    yes: 'YES',
    no: 'NO',

    // ================= 问题 1：模糊暗示（适用游戏、交友、视频） =================
    // 原文: Are you looking for an Interactive 18+ Game?
    // 修改为: 你是否在寻找无限制的 18+ 互动内容？
    q1_1: 'Are you looking for uncensored',
    q1_2: 'Interactive 18+ Content?',

    // ================= 问题 2：挑起欲望（适用所有成人产品） =================
    // 原文: Which type of girls do you prefer?
    // 修改为: 你现在的真实状态是什么？(这种代入感极强)
    q2: 'What are you looking for right now?',

    // 选项
    anime: 'Just exploring...', // 只是随便看看
    realistic: 'I want to interact!', // 我想互动/玩点刺激的
    both: 'Show me everything 😈', // 全都给我看

    // ================= 问题 3：终极过滤与确认 =================
    q3_1: 'Are you over',
    q3_2: 'years old?',

    ageVerify: '*You must be 18+ to see the explicit content', // 必须满18岁才能看露骨内容

    // ================= 假加载动画：制造“稀缺性”与“破解感” =================
    loading1: 'Verifying your answers...',
    loading2: 'Searching for online members...', // 寻找在线会员/玩家 (适用交友和游戏)
    loading3: 'Bypassing safe-search filters...', // 绕过安全搜索过滤 (极强破解感)

    // ================= 收割页：万能召唤 =================
    accessGranted: 'MATCH FOUND!', // 匹配成功！(万能词汇)
    privateRoom:
        'You have unlocked exclusive access. Discretion is advised.', // 你已解锁专属权限。请注意隐私。

    enterNow: 'CONTINUE ➜' // 不用"Enter Room"或"Play Game"，用"继续"最百搭
  },

  es: {
    confidential: 'PRIVADO Y SEGURO',

    question: 'PASO',
    of: 'DE',

    yes: 'SÍ',
    no: 'NO',

    q1_1: '¿Estás buscando',
    q1_2: 'Contenido Interactivo +18 sin censura?',

    q2: '¿Qué estás buscando en este momento?',

    anime: 'Solo explorar...',
    realistic: '¡Quiero interactuar!',
    both: 'Muéstrame todo 😈',

    q3_1: '¿Tienes más de',
    q3_2: 'años?',

    ageVerify: '*Debes ser +18 para ver contenido explícito',

    loading1: 'Verificando tus respuestas...',
    loading2: 'Buscando miembros en línea...',
    loading3: 'Eludiendo los filtros de seguridad...',

    accessGranted: '¡COINCIDENCIA ENCONTRADA!',
    privateRoom:
        'Has desbloqueado acceso exclusivo. Se recomienda discreción.',

    enterNow: 'CONTINUAR ➜'
  }
}

// 浏览器语言
const browserLang =
    navigator.language?.toLowerCase() || 'es'

// 当前语言
const currentLang = computed(() => {
  if (browserLang.startsWith('en')) {
    return 'en'
  }

  return 'es'
})

// 当前文案
const t = computed(() => {
  return langConfig[currentLang.value]
})

const loadingText = ref('')

loadingText.value = t.value.loading1

// stealth
const hideStealthNet = () => {
  const net = document.getElementById('stealth-net')

  gaLogEvent.logEvent({
    eventName: 'home_c_stealth',
    eventLog: 'home_c_stealth'
  })

  if (net) {
    net.style.display = 'none'
  }
}

// next
const nextStep = () => {
  step.value++

  gaLogEvent.logEvent({
    eventName: 'home_c_step',
    eventValue: step.value,
    eventLog: 'home_c_step'
  })
}

// loading
const startLoading = () => {
  step.value = 4

  loadingText.value = t.value.loading1

  setTimeout(() => {
    loadingText.value = t.value.loading2
  }, 1000)

  setTimeout(() => {
    loadingText.value = t.value.loading3
  }, 2000)

  gaLogEvent.logEvent({
    eventName: 'home_c_step',
    eventValue: step.value,
    eventLog: 'home_c_step'
  })

  setTimeout(() => {
    step.value = 5

    gaLogEvent.logEvent({
      eventName: 'home_c_step',
      eventValue: step.value,
      eventLog: 'home_c_step'
    })
  }, 3000)
}

// redirect
const finalRedirect = () => {
  gaLogEvent.logEvent({
    eventName: 'home_c_jump',
    eventLog: 'home_c_jump'
  })

  window.location.href =
      'https://6njvi.bemobtrcks.com/click'
}
</script>

<style scoped>
.survey-btn {
  @apply w-full py-4 px-6 rounded-xl bg-[#1e1e1e] border border-red-900/30 text-white font-bold text-lg uppercase tracking-wide transition-all duration-200 active:scale-95;
}

.survey-btn:hover {
  @apply bg-[#252525] border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.2)];
}
</style>