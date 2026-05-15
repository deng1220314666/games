<template>
  <div class="ad-banner-list">
    <div
      v-for="(ad, index) in adsData"
      :key="ad.id"
    >
      <a :href="ad.href" :target="ad.target || '_blank'" class="ad-item">
        <img
            :src="ad.img.src"
            :width="ad.img.width"
            :height="ad.img.height"
            :alt="`Ad ${ad.id}`"
            loading="lazy"
        />
      </a>

      <AdsterraManager v-if="index === 2" idTxt="adsterra-banner-1-box" :zid="1" style="margin-top: 1rem; margin-bottom: 0;" :immediate="false" :showTitle="true"/>

      <div v-if="index === 4" id="container-d1debede50ec7d8df5940dc07088499f"></div>
    </div>
  </div>
</template>

<script setup>
import { adsData } from "@/config/adsData.js";
import AdsterraManager from "./AdsterraManager.vue";
import {loadScript} from "../utils/index.js";

loadScript("https://freshmanhow.com/d1debede50ec7d8df5940dc07088499f/invoke.js", "Adsterra");
</script>

<style scoped>
.ad-banner-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.ad-item {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.ad-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.ad-item img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>