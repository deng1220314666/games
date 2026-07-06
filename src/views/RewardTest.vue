<template>
  <div class="min-h-full bg-tg-secondary p-4 text-tg-text">
    <h1 class="mb-1 text-lg font-bold">OnClick Reward 广告测试</h1>
    <p class="mb-4 text-xs text-tg-hint">
      zone(data-admpid): <b>{{ zone }}</b> · 容器: <b>#{{ containerId }}</b>
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
      <button class="col-span-2 rounded-xl py-3 text-sm font-semibold text-tg-button-text" style="background:#34c759" @click="showReward">2. 展示激励广告 → 看完发币</button>
      <button class="col-span-2 rounded-xl py-2.5 text-sm font-semibold text-tg-hint" style="background: var(--tg-section-bg); border:1px solid var(--tg-separator)" @click="simulate">模拟发奖(仅测下游发币,不看广告)</button>
    </div>

    <!-- 广告容器(SDK 要往这里渲染) -->
    <div class="mb-4">
      <div class="mb-1 text-xs text-tg-hint">广告容器 #{{ containerId }}:</div>
      <div :id="containerId" class="min-h-[80px] rounded-xl border border-dashed" style="border-color: var(--tg-separator)"></div>
    </div>

    <!-- 日志 -->
    <div class="tg-section p-3">
      <div class="mb-1 flex items-center justify-between">
        <span class="text-xs font-semibold text-tg-hint">日志</span>
        <button class="text-xs text-tg-button" @click="logs = []">清空</button>
      </div>
      <pre class="max-h-72 overflow-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed" style="color: var(--tg-text)">{{ logs.join('\n') || '(暂无)' }}</pre>
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

const user = useUserStore()
const zone = ONCLICK.rewardZone
const containerId = 'reward-1'
const logs = ref([])

function log(...args) {
  const t = new Date().toLocaleTimeString()
  logs.value.push(`[${t}] ` + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
}

function loadSdk() {
  log('加载 onclicka.js, data-admpid=' + zone)
  OnClickReward.load(zone)
  setTimeout(probe, 1500)
}

// 打印 SDK 可能暴露的全局,帮助锁定真实调用 API
function probe() {
  const candidates = ['initCdTma', 'onclicka', 'OnClicka', 'Onclicka', 'AdController', 'wpn', 'show']
  const found = candidates.filter((k) => typeof window[k] !== 'undefined')
  log('已加载 onclicka 脚本:' + !!document.querySelector(`script[data-admpid="${zone}"]`))
  log('检测到的全局:' + (found.length ? found.map((k) => `${k}(${typeof window[k]})`).join(', ') : '无(可能还没就绪或此广告位非 reward 类型)'))
}

async function showReward() {
  try {
    log('调用 OnClickReward.show("' + containerId + '") ...')
    const ok = await OnClickReward.show(containerId)
    log('广告返回:' + ok + ' → 发币')
    const res = await earn('watch_ad', ECONOMY.reward.watchAd)
    log(res.ok ? `发币成功 +${res.amount},余额 ${res.balance}` : `发币被拒:${res.balance}(可能到达每日上限)`)
  } catch (e) {
    log('❌ ' + (e?.message || e))
    log('提示:若一直失败,点"探测全局"看 SDK 暴露了什么,把真实的展示函数名告诉我,我改 OnClickReward.show')
  }
}

async function simulate() {
  const res = await earn('watch_ad', ECONOMY.reward.watchAd)
  log(res.ok ? `模拟发奖 +${res.amount},余额 ${res.balance}` : `发币被拒(每日上限?)`)
}

onMounted(() => log('页面就绪。先点「1. 加载 SDK」,再点「2. 展示激励广告」。'))
</script>
