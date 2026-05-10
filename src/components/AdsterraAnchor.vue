<template>
  <div id="adsterra-anchor-1-box"></div>
</template>

<script setup>
import {onMounted, watch} from "vue";
import { AdsterraAd } from "@/utils/adSdk.js";

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

watch(
  () => props.isShow,
  (newValue, oldValue) => {
    if (newValue) {
      AdsterraAd.showAnchor();
    }
  }
);
</script>

<style scoped>
#adsterra-anchor-1-box {
  width: 100%;
  height: 50px;
  margin: 0 auto;
}
</style>