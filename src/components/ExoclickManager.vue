<template>
  <div id="exclick-banner-1-box" class="mb-4">
    <div class="ad-title">
      <span style="font-size: 13px;">ad</span>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2157_481)"><path fill="#E5E7EB" d="M15 0v15H0V0z"></path><path fill="#E5E7EB" d="M15 0v15H0V0z"></path><circle cx="7.5" cy="11.5" r="1.5" transform="rotate(-180 7.5 11.5)" fill="#00aecd"></circle><circle cx="7.5" cy="7.5" r="1.5" transform="rotate(-180 7.5 7.5)" fill="#00aecd"></circle><circle cx="7.5" cy="3.5" r="1.5" transform="rotate(-180 7.5 3.5)" fill="#00aecd"></circle></g><defs><clipPath id="clip0_2157_481"><path fill="#fff" transform="rotate(90 7.5 7.5)" d="M0 0h15v15H0z"></path></clipPath></defs></svg>
    </div>

    <ins class="eas6a97888e37" data-zoneid="5804176"></ins>
  </div>
</template>
<script setup>
import { ExoClickAd } from "@/utils/adSdk.js";
import {onMounted} from "vue";

onMounted(async () => {
  ExoClickAd.init();
})
</script>
<style scoped>
#exclick-banner-1-box {
  width: 100%;
  height: auto !important;
  min-height: 16rem;
  background-color: rgb(229, 231, 235);
  position: relative;
}
#exclick-banner-1-box .ad-title {
  color: #00aecd;
  position: absolute;
  top: 1px;
  right: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 99999;
}
</style>