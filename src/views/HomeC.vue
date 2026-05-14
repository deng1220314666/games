<template>
  <div class="home-c">
    <AdultSurvey />
  </div>
</template>

<script setup>
import AdultSurvey from "@/components/AdultSurvey.vue";
import {onMounted} from "vue";
import {loadScript} from "../utils";
import {gaLogEvent} from "../utils/event";

onMounted(() => {
  injectBeMobTracking();
  loadScript("https://pl29434855.profitablecpmratenetwork.com/32/8f/4b/328f4b449c3a62bd7e29fb0553d04b03.js", "Adsterra");

  gaLogEvent.logEvent({
    eventName: "enter_home_c",
    eventLog: `enter_home_c`
  })
  // AdsterraAd.showSocialBar();
})

// 封装 BeMob 追踪代码的注入方法
const injectBeMobTracking = () => {
  // 检查是否已经注入，防止组件反复挂载时重复加载
  if (document.getElementById('bemob-tracking-pixel')) return;

  const script = document.createElement("script");
  script.id = 'bemob-tracking-pixel'; // 加上 id 方便管理
  script.type = "text/javascript";
  script.async = true;

  // 原封不动使用 BeMob 提供的 Src（注意保留最后的动态搜索参数抓取）
  script.src = "https://6njvi.bemobtrcks.com/landing/e57df48d-a41d-46ad-9f06-c3529174b396?callback=REPLACE&rule=REPLACE&path=REPLACE&landing=REPLACE&" + window.location.search.substring(1);

  // 将脚本插入到文档的 <head> 中，确保第一时间执行
  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}
</script>

<style scoped>
.home-c {
  margin: 0 auto;
  width: 100%;
  height: auto;
}
</style>