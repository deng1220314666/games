<template>
  <section class="mb-5">
    <div v-if="header" class="tg-section-header">{{ header }}</div>
    <div class="tg-section">
      <slot />
    </div>
    <div v-if="footer" class="tg-section-header mt-1.5 normal-case tracking-normal">
      {{ footer }}
    </div>
  </section>
</template>

<script setup>
defineProps({
  header: { type: String, default: '' },
  footer: { type: String, default: '' },
})
</script>
