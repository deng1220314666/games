<template>
  <div class="min-h-full bg-tg-secondary p-4 text-tg-text">
    <h1 class="mb-1 text-lg font-bold">OnClick TMA Reward 广告测试</h1>
    <p class="mb-1 text-xs text-tg-hint">Spot ID: <b>{{ spotId }}</b> · 脚本 tma.js · initCdTma({{ '{id}' }}) → show()</p>
    <p class="mb-4 text-xs" :style="{ color: inTelegram ? 'var(--tg-button)' : 'var(--tg-destructive)' }">
      当前环境:{{ inTelegram ? 'Telegram 小程序 ✓' : '普通浏览器(tg_app 广告可能不展示,建议在 Telegram 内打开)' }}
    </p>

    <!-- 余额 -->
    <div class="tg-section mb-4 flex items-center justify-between p-4">
      <span class="text-sm text-tg-hint">当前积分</span>
      <span class="tabular text-xl font-bold" style="color: var(--tg-button)">{{ user.balance }}</span>
    </div>

    <!-- 操作 -->
    <div class="mb-4 grid grid-cols-2 gap-2">
      <button class="rounded-xl py-3 text-sm font-semibold text-tg-button-text" style="background: var(--tg-button)" @click="loadSdk">1. 加载 SDK 脚本</button>
      <button class="rounded-xl py-3 text-sm font-semibold text-tg-button-text" style="background: var(--tg-button)" @click="probe">探测全局</button>
      <button class="col-span-2 rounded-xl py-3 text-sm font-semibold text-tg-button-text" style="background:#34c759" @click="showReward">2. 展示激励广告(点击时拉广告)→ 看完发币</button>
      <button class="col-span-2 rounded-xl py-2.5 text-sm font-semibold text-tg-hint" style="background: var(--tg-section-bg); border:1px solid var(--tg-separator)" @click="simulate">模拟发奖(仅测下游发币)</button>
    </div>

    <!-- 日志 -->
    <div class="tg-section p-3">
      <div class="mb-1 flex items-center justify-between">
        <span class="text-xs font-semibold text-tg-hint">日志</span>
        <button class="text-xs text-tg-button" @click="logs = []">清空</button>
      </div>
      <pre class="max-h-80 overflow-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed" style="color: var(--tg-text)">{{ logs.join('\n') || '(暂无)' }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { ONCLICK } from '@/config/ads.js'
import { OnClickReward } from '@/utils/adSdk.js'
import { earn } from '@/services/reward.js'
import { ECONOMY } from '@/config/index.js'
import { platform } from '@/utils/platform.js'

const user = useUserStore()
const spotId = ONCLICK.rewardSpotId
const inTelegram = platform.isTelegram
const logs = ref([])

function log(...args) {
  const t = new Date().toLocaleTimeString()
  logs.value.push(`[${t}] ` + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
}

// 只加载 SDK 脚本(不拉广告)
function loadSdk() {
  log('加载 SDK 脚本 tma.js(不拉广告)...')
  OnClickReward.load()
  setTimeout(probe, 1500)
}

function probe() {
  const candidates = ['initCdTma', 'show', 'Telegram', 'onclicka']
  const found = candidates.map((k) => `${k}:${typeof window[k]}`)
  log('tma.js 已加载:' + OnClickReward.loaded)
  log('全局:' + found.join(', '))
}

async function showReward() {
  try {
    log('OnClickReward.show():点击时 initCdTma 拉广告 → 播放 ...')
    const ok = await OnClickReward.show()
    log('广告播完:' + ok + ' → 发币')
    const res = await earn('watch_ad', ECONOMY.reward.watchAd)
    log(res.ok ? `发币成功 +${res.amount},余额 ${res.balance}` : `发币被拒(每日上限?)`)
  } catch (e) {
    log('❌ ' + (e?.message || e))
    log('把这行报错发我,以便对齐 SDK 真实行为')
  }
}

async function simulate() {
  const res = await earn('watch_ad', ECONOMY.reward.watchAd)
  log(res.ok ? `模拟发奖 +${res.amount},余额 ${res.balance}` : `发币被拒(每日上限?)`)
}

onMounted(() => {
  log('页面就绪。环境:' + (inTelegram ? 'Telegram' : '浏览器'))
  log('SDK 脚本已在 head 预加载。点「2. 展示激励广告」才会拉广告。')
  OnClickReward.load() // 只确保脚本就位,不拉广告
})
</script>
