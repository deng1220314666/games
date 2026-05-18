<template>
  <div class="home">
    <div v-for="(item, index) in category" :key="index" class="w-full mb-4">
<!--      <AdsterraManager idTxt="adsterra-banner-2-box" :zid="2" v-if="index === 2" />-->
<!--      <AdsterraManager idTxt="adsterra-banner-3-box" :zid="3" v-if="index === 3" />-->
      <!-- 分类标题栏 -->
      <div
        class="category-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl mb-4 cursor-pointer hover:shadow-lg transition-all duration-300"
        @click="navigateToCategory()"
      >
        <!--        @click="navigateToCategory()"-->
        <div class="flex items-center">
          <img :src="item.img" alt="" class="w-10 h-10 mr-3 bg-white rounded-full p-1">
          <h2 class="text-xl font-bold">
            {{ $t('gameSearch.' + item.name.toLowerCase()) || (locale === 'zh' ? item.cn_name : item.name) }}
          </h2>
        </div>
        <div class="font-medium flex items-center">
          {{ $t('gameSearch.more') }} <span class="ml-1">></span>
        </div>

      </div>

      <AdsterraManager idTxt="adsterra-banner-1-box" :zid="2" :immediate="false" v-if="index === 0" />

      <!-- 游戏网格 -->
      <GameGrild :games="item.games"/>

      <div v-if="index === 0" id="onclick-video-1"></div>

<!--      <AdContainer v-if="index === 0">-->
<!--        <div id="container-155789be5aa8a606b97a7d9e19e14adb"></div>-->
<!--      </AdContainer>-->
    </div>

    <Footer />
<!--    <InfoDialog-->
<!--        :isShow="adsUtilsStore.dialogStatus"-->
<!--        :duration="3"/>-->

    <!-- 通知权限弹窗 -->
<!--    <NotificationDialog ref="notificationDialog" />-->

    <!-- 安装快捷方式卡片 -->
    <InstallPrompt />
  </div>
</template>

<script setup>
import {useGameStore} from '@/stores/gameStore'
import {useAdUtilsStore} from "@/stores/adsUtils"
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'
import GameGrild from "@/components/GameGrild.vue";
import { getGames, getCategory} from "@/api/mock.js";
import AdsterraManager from "@/components/AdsterraManager.vue";
import Footer from "@/components/Footer.vue";
import InfoDialog from "@/components/InfoDialog.vue";
import { smartLink } from "@/config/index.js";
import { gaLogEvent } from "@/utils/event.js";
import { AdsterraAd, MonetagAd } from "@/utils/adSdk.js";
import { requestNotifyPermission } from "@/utils/pwa.js";
import { pushRouterHistory } from "@/utils/index.js";
import { useRoute } from 'vue-router';
import AdContainer from "../components/AdContainer.vue";
import {bachJump} from "../utils";
import NotificationDialog from "@/components/NotificationDialog.vue";
import InstallPrompt from "@/components/InstallPrompt.vue";

const {locale} = useI18n()
const gameStore = useGameStore()
const adsUtilsStore = useAdUtilsStore();
const category = ref([])

/**
 * 1. 获取 cid（Bemob 自动带）
 */
function getCid() {
  const url = new URL(window.location.href);
  return url.searchParams.get("cid");
}

/**
 * 2. 保存 cid（防止丢失）
 */
function saveCid(cid) {
  if (cid) {
    localStorage.setItem("bemob_cid", cid);
  }
}

onMounted(async () => {
  MonetagAd.pushShow();
  requestNotifyPermission();
  // setTimeout(() => {
  //   pushRouterHistory();
  //
  //   bachJump();
  // }, 500)
  loadOnclickaScript();
  if (AdsterraAd) {
    AdsterraAd.showSocialBar();

    // setTimeout(() => {
    //   AdsterraAd.showPopunder();
    // }, 3000)
  }
  const cid = getCid();
  saveCid(cid);
  const lang = (navigator.language || '').split('-')[0];

  gaLogEvent.logEvent({
    eventName: "enter_home",
    eventValue: lang,
    eventLog: `Enter Home`
  })
  await gameStore.setRecommendGame()
  gameStore.games = await getGames()
  category.value = await getCategory()
})

// 跳转到分类游戏页面
const navigateToCategory = () => {
  const item = smartLink[Math.floor(Math.random() * smartLink.length)] || "https://www.profitablecpmratenetwork.com/eet0d835?key=edd631eedc507862650ff626c430b6da";
  window.open(item, '_blank');
  gaLogEvent.logEvent({
    eventName: "enter_smart_link",
    eventValue: item,
    eventLog: `Enter Smart Link`
  })
}

const loadOnclickaScript = () => {
  // 防止重复加载
  if (document.getElementById('onclicka-script')) {
    return
  }

  const script = document.createElement('script')

  script.id = 'onclicka-script'
  script.async = true
  script.src = 'https://js.onclckmn.com/static/onclicka.js'
  script.setAttribute('data-admpid', '440816')

  document.body.appendChild(script)
}
</script>

<style scoped>
.home {
  margin: 0 auto;
  width: 100%;
  height: auto;
}
</style>