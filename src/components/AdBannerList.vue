<template>
  <div class="ad-banner-list">
    <a
      v-for="ad in adsData"
      :key="ad.id"
      :href="ad.href"
      :target="ad.target || '_blank'"
      class="ad-item"
    >
      <img
        :src="ad.img.src"
        :width="ad.img.width"
        :height="ad.img.height"
        :alt="`Ad ${ad.id}`"
        loading="lazy"
      />
    </a>
  </div>
</template>

<script setup>
import { adsData } from "@/config/adsData.js";
</script>

<style scoped>
.ad-banner-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
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