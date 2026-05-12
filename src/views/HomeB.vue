<template>
  <div class="home-b">
    <div id="container-d1debede50ec7d8df5940dc07088499f"></div>

    <a href="https://www.profitablecpmratenetwork.com/eet0d835?key=edd631eedc507862650ff626c430b6da"
       target="_blank"
       style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; opacity: 0; cursor: pointer;">
    </a>
  </div>
</template>

<script setup>
import {AdsterraAd} from "../utils/adSdk";
import {onMounted} from "vue";
import {pushRouterHistory} from "@/utils";

pushRouterHistory();

AdsterraAd.showNativeBanner("ad.ttgame");
</script>

<style scoped>
.home-b {
  margin: 0 auto;
  width: 100%;
  height: auto;
}
</style>