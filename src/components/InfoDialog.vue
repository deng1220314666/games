<template>
  <div v-if="isShow" class="fixed top-0 left-0 w-full h-full z-[999999] flex justify-center items-center">
    <div class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)]"></div>

    <div class="flex flex-col transform w-[90%] min-h-[15rem] max-h-[80vh] bg-white rounded-xl">
      <div @click="closeDialog" class="absolute right-[1rem] top-[.1rem]">X</div>

      <div class="w-[80%] pt-[1rem] pb-[.5rem] mx-auto bg-gradient-to-r text-center">Do you want to exit?</div>

      <div class="flex-1 mx-auto w-full max-w-[90%] max-h-[80vh] overflow-auto">
        <AdsterraManager style="min-height: 250px;" idTxt="adsterra-banner-4-box" :zid="1" />
      </div>

      <div @click="jump" class="w-[60%] h-[3rem] mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white flex justify-center items-center my-[.5rem]">
        More exciting content</div>
    </div>
  </div>
</template>

<script setup>
import AdsterraManager from "./AdsterraManager.vue";
import {jumpUrl} from "../utils";
import {onMounted} from "vue";
import { AdsterraAd } from "@/utils/adSdk.js";
import {gaLogEvent} from "@/utils/event";

const emit = defineEmits(['update:isShow']);

const { isShow } = defineProps({
  isShow: {
    default: false,
    type: Boolean
  }
});

onMounted(() => {
  if (isShow.value) {
    gaLogEvent.logEvent({
      eventName: "back_dialog",
      eventValue: "dialog",
      eventLog: `back_dialog`
    })
  }
})

const closeDialog = () => {
  emit('update:isShow', false);
}

const jump = () => {
  jumpUrl("https://www.profitablecpmratenetwork.com/y5p95qwz?key=60cd56236d8caddc568fdc4744ec1f18")
}
</script>

<style scoped>

</style>