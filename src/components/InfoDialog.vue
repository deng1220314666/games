<template>
  <div v-if="isShow" class="fixed top-0 left-0 w-full h-full z-[999999] flex justify-center items-center">
    <div class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)]"></div>

    <div class="transform w-[80%] min-h-[15rem] bg-white rounded-xl">
      <div @click="closeDialog" class="absolute right-[1rem] top-[.1rem]">X</div>

      <div class="w-[60%] pt-[1rem] pb-[.5rem] mx-auto bg-gradient-to-r text-center">Do you want to exit?</div>

      <div style="width: 300px; height: 250px; margin: 0 auto;">
        <AdsterraManager style="height: 100%;" idTxt="adsterra-banner-4-box" :zid="2" />
      </div>

      <div @click="jump" class="w-[60%] h-[3rem] mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white flex justify-center items-center my-[.5rem]">
        More exciting content</div>
    </div>
  </div>
</template>

<script setup>
import AdsterraManager from "./AdsterraManager.vue";
import { bachJump } from "@/utils/index.js";

const emit = defineEmits(['update:isShow']);

const { isShow } = defineProps({
  isShow: {
    default: false,
    type: Boolean
  }
});

const closeDialog = () => {
  emit('update:isShow', false);
}

const jump = () => {
  bachJump();
}
</script>

<style scoped>

</style>