<template>
  <div class="min-h-full bg-tg-secondary p-4 text-tg-text">
    <h1 class="mb-1 text-lg font-bold">ads3 广告测试</h1>
    <p class="mb-1 break-all text-xs text-tg-hint">blockId: <b>{{ blockId }}</b> · appId: <b>{{ appId || '(未填!)' }}</b></p>
    <p class="mb-4 text-xs" :style="{ color: inTelegram ? 'var(--tg-button)' : 'var(--tg-destructive)' }">
      环境:{{ inTelegram ? 'Telegram ✓' : '浏览器(建议在 Telegram 内测)' }}
    </p>

    <!-- 余额 -->
    <div class="tg-section mb-4 flex items-center justify-between p-4">
      <span class="text-sm text-tg-hint">当前积分</span>
      <span class="tabular text-xl font-bold" style="color: var(--tg-button)">{{ user.balance }}</span>
    </div>

    <!-- 示例1:激励广告 popup -->
    <TgSection header="示例1 · 激励广告(popup)">
      <div class="p-3">
        <button class="w-full rounded-xl py-3 text-sm font-semibold text-tg-button-text" style="background:#34c759" @click="showReward">展示激励广告 → 看完发币</button>
      </div>
    </TgSection>

    <!-- 示例2:原生广告 / Earn Task -->
    <TgSection header="示例2 · 原生广告(看广告完成任务)">
      <div class="p-3">
        <button class="mb-3 w-full rounded-xl py-2.5 text-sm font-semibold text-tg-button-text" style="background: var(--tg-button)" @click="loadNative">拉取原生广告任务</button>
        <div v-if="nativeAds.length === 0" class="py-2 text-center text-xs text-tg-hint">(点上面按钮拉取)</div>
        <div v-for="ad in nativeAds" :key="ad.adId" class="mb-2 flex items-center gap-3 rounded-xl p-2.5" style="background: var(--tg-secondary-bg)">
          <img v-if="ad.icon" :src="ad.icon" class="h-10 w-10 shrink-0 rounded-lg object-cover" alt="" />
          <div class="min-w-0 flex-1">
            <div class="truncate text-[13px] font-semibold text-tg-text">{{ ad.brandName || 'Ad' }}</div>
            <div class="truncate text-[11px] text-tg-hint">{{ ad.text }}</div>
          </div>
          <button class="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-tg-button-text" style="background:#34c759" @click="doTaskAd(ad)">{{ ad.buttonText || '去完成' }}</button>
        </div>
      </div>
    </TgSection>

    <!-- 示例3:Banner -->
    <TgSection header="示例3 · Banner 广告">
      <div class="p-3">
        <button class="mb-3 w-full rounded-xl py-2.5 text-sm font-semibold text-tg-button-text" style="background: var(--tg-button)" @click="loadBanner">拉取 Banner</button>
        <div v-if="!banner" class="py-2 text-center text-xs text-tg-hint">(点上面按钮拉取)</div>
        <div v-else class="cursor-pointer overflow-hidden rounded-xl" style="background: var(--tg-secondary-bg)" @click="doBanner(banner)">
          <img v-if="banner.image" :src="banner.image" class="h-24 w-full object-cover" alt="" />
          <div class="flex items-center gap-2 p-2.5">
            <img v-if="banner.icon" :src="banner.icon" class="h-8 w-8 rounded object-cover" alt="" />
            <div class="min-w-0 flex-1">
              <div class="truncate text-[13px] font-semibold">{{ banner.brandName || 'Ad' }}</div>
              <div class="truncate text-[11px] text-tg-hint">{{ banner.text }}</div>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-bold text-tg-button-text" style="background: var(--tg-button)">{{ banner.buttonText || '查看' }}</span>
          </div>
        </div>
      </div>
    </TgSection>

    <!-- 工具 + 日志 -->
    <div class="mb-3 grid grid-cols-2 gap-2">
      <button class="rounded-xl py-2.5 text-sm text-tg-hint" style="background: var(--tg-section-bg); border:1px solid var(--tg-separator)" @click="probe">探测全局</button>
      <button class="rounded-xl py-2.5 text-sm text-tg-hint" style="background: var(--tg-section-bg); border:1px solid var(--tg-separator)" @click="simulate">模拟发奖</button>
    </div>
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
import TgSection from '@/components/TgSection.vue'
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
const nativeAds = ref([])
const banner = ref(null)

function log(...args) {
  const t = new Date().toLocaleTimeString()
  logs.value.push(`[${t}] ` + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
}

async function grant(source) {
  const res = await earn('watch_ad', ECONOMY.reward.watchAd)
  log(res.ok ? `${source} 发币 +${res.amount},余额 ${res.balance}` : `${source} 发币被拒(每日上限?)`)
}

// ok=true 看完发奖;ok=false 手动关闭未看完,不发奖
async function settle(ok, source) {
  if (ok) await grant(source)
  else log(`${source}:未看完/已关闭,不发奖`)
}

// 示例1:激励 popup
async function showReward() {
  try {
    log('激励广告 show() ...')
    const ok = await Ads3Reward.show()
    await settle(ok, '激励')
  } catch (e) {
    log('❌ ' + (e?.message || e))
  }
}

// 示例2:原生广告任务
async function loadNative() {
  try {
    log('GetMultiTonAd(blockId, 5) 拉取原生广告 ...')
    const res = await Ads3Reward.getAds(5)
    nativeAds.value = res?.ads || []
    log(`拿到 ${nativeAds.value.length} 条原生广告`)
  } catch (e) {
    log('❌ ' + (e?.message || e))
  }
}
async function doTaskAd(ad) {
  try {
    log(`完成任务:TonAdPopupShow(tonAd=${ad.adId}) ...`)
    const ok = await Ads3Reward.showAd(ad)
    await settle(ok, '任务')
  } catch (e) {
    log('❌ ' + (e?.message || e))
  }
}

// 示例3:Banner
async function loadBanner() {
  try {
    log('GetMultiTonAd(blockId, 1) 拉取 Banner ...')
    const res = await Ads3Reward.getAds(1)
    banner.value = (res?.ads || [])[0] || null
    log(banner.value ? '拿到 Banner' : '无 Banner 数据')
  } catch (e) {
    log('❌ ' + (e?.message || e))
  }
}
async function doBanner(ad) {
  try {
    log(`点击 Banner:TonAdPopupShow(tonAd=${ad.adId}) ...`)
    const ok = await Ads3Reward.showAd(ad)
    await settle(ok, 'Banner')
  } catch (e) {
    log('❌ ' + (e?.message || e))
  }
}

function probe() {
  log('React=' + typeof window.React + ', ReactDOM=' + typeof window.ReactDOM + ', ClientJS=' + typeof window.ClientJS + ', TonAISdk=' + typeof window.TonAISdk)
  if (window.TonAISdk) log('  GetMultiTonAd=' + typeof window.TonAISdk.GetMultiTonAd + ', TonAdPopupShow=' + typeof window.TonAISdk.TonAdPopupShow)
}
async function simulate() {
  await grant('模拟')
}

onMounted(() => {
  log('页面就绪。环境:' + (inTelegram ? 'Telegram' : '浏览器'))
  if (!appId) log('⚠️ ADS3.appId 未填')
})
</script>
