<template>
  <div class="min-h-full bg-tg-secondary p-4 text-tg-text">
    <h1 class="mb-1 text-lg font-bold">ads3 Reward 广告测试</h1>
    <p class="mb-1 break-all text-xs text-tg-hint">
      blockId: <b>{{ blockId }}</b> · appId: <b>{{ appId || '(未填!)' }}</b>
    </p>
    <p class="mb-4 text-xs" :style="{ color: inTelegram ? 'var(--tg-button)' : 'var(--tg-destructive)' }">
      当前环境:{{ inTelegram ? 'Telegram 小程序 ✓' : '普通浏览器(建议在 Telegram 内打开)' }}
    </p>

    <!-- 余额 -->
    <div class="tg-section mb-4 flex items-center justify-between p-4">
      <span class="text-sm text-tg-hint">当前积分</span>
      <span class="tabular text-xl font-bold" style="color: var(--tg-button)">{{ user.balance }}</span>
    </div>

    <!-- 操作 -->
    <div class="mb-4 grid grid-cols-2 gap-2">
      <button class="rounded-xl py-3 text-sm font-semibold text-tg-button-text" style="background: var(--tg-button)" @click="loadSdk">1. 加载 SDK</button>
      <button class="rounded-xl py-3 text-sm font-semibold text-tg-button-text" style="background: var(--tg-button)" @click="probe">探测全局</button>
      <button class="col-span-2 rounded-xl py-3 text-sm font-semibold text-tg-button-text" style="background:#34c759" @click="showReward">2. 展示激励广告 → 看完(点击)发币</button>
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
import { ADS3 } from '@/config/ads.js'
import { Ads3Reward } from '@/utils/adSdk.js'
import { earn } from '@/services/reward.js'
import { ECONOMY } from '@/config/index.js'
import { platform } from '@/utils/platform.js'

const user = useUserStore()
const blockId = ADS3.blockId
const appId = ADS3.appId
const inTelegram = platform.isTelegram
const logs = ref([])

function log(...args) {
  const t = new Date().toLocaleTimeString()
  logs.value.push(`[${t}] ` + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
}

async function loadSdk() {
  log('加载 ads3 依赖(axios/React17/ReactDOM17/ClientJS)+ SDK ...')
  try {
    await Ads3Reward.load()
    log('加载完成')
  } catch (e) {
    log('❌ 加载失败:' + (e?.message || e))
  }
  probe()
}

function probe() {
  log('SDK 脚本已加载:' + Ads3Reward.loaded)
  log('依赖:React=' + typeof window.React + ', ReactDOM=' + typeof window.ReactDOM + ', ClientJS=' + typeof window.ClientJS + ', axios=' + typeof window.axios)
  log('window.TonAISdk:' + typeof window.TonAISdk)
  if (window.TonAISdk) {
    log('  TonAdInit:' + typeof window.TonAISdk.TonAdInit + ', TonAdPopupShow:' + typeof window.TonAISdk.TonAdPopupShow)
  }
  if (!appId) log('⚠️ appId 未填,init 会失败。')
}

async function showReward() {
  try {
    log(`TonAdPopupShow({ blockId: ${blockId} }) ...`)
    const ok = await Ads3Reward.show()
    log('广告点击(发奖):' + ok + ' → 发币')
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
  log('点「1. 加载 SDK」→「探测全局」,再「2. 展示激励广告」')
  if (!appId) log('⚠️ 注意:ADS3.appId 还没填,init 必需,先去 config/ads.js 填上再测。')
})
</script>
