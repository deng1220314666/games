<template>
  <div id="adsterra-anchor-1-box"></div>
</template>

<script setup>
import {onMounted, watch} from "vue";
import { AdsterraAd } from "@/utils/adSdk.js";
import {gaLogEvent} from "../utils/event.js";

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

      gaLogEvent.logEvent({
        eventName: "show_ttsdk_game_danchor_banner",
        eventLog: `show_ttsdk_game_danchor_banner`
      })
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