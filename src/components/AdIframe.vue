<template>
  <div ref="wrapper" class="ad-wrapper">
    <iframe
        v-if="loaded"
        :src="src"
        :width="width"
        :height="height"
        frameborder="0"
        scrolling="no"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  src: String,
  width: { type: Number, default: 300 },
  height: { type: Number, default: 250 }
})

const wrapper = ref(null)
const loaded = ref(false)

onMounted(() => {
  // 懒加载：进入视口才加载 iframe
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loaded.value = true
      observer.disconnect()
    }
  })

  if (wrapper.value) {
    observer.observe(wrapper.value)
  }
})
</script>

<style scoped>
.ad-wrapper {
  width: 300px;
  height: 250px;
}
iframe {
  border: none;
}
</style>