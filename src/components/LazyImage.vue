<template>
  <div class="relative z-0" :class="containerClass">
    <img
      v-lazy="src"
      :alt="alt"
      :class="imageClass"
      @load="handleImageLoad"
    />
    <!-- 加载占位符 -->
   <div v-if="!imageLoaded" class="absolute inset-0 flex items-center justify-center bg-gray-200 z-0">
      <div class="animate-pulse rounded-full bg-gray-300 z-0" :class="spinnerSizeClass"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  },
  imageClass: {
    type: String,
    default: ''
  },
  spinnerSize: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const imageLoaded = ref(false)

const handleImageLoad = () => {
  imageLoaded.value = true
}

const spinnerSizeClass = computed(() => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  }
  return sizes[props.spinnerSize]
})
</script>