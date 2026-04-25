<template>
  <div id="adsterra-anchor-1-box"></div>
</template>

<script setup>
import {onMounted} from "vue";
import { AdsterraAd } from "@/utils/adSdk.js";

onMounted(() => {
  if (AdsterraAd) {
    AdsterraAd.showAnchor();
  }
})
</script>

<style scoped>
#adsterra-anchor-1-box {
  width: 100%;
  height: 50px;
  margin: 0 auto;
}
</style>