<template>
  <nav class="bottom-nav flex justify-around items-center bg-white border-t border-gray-200 py-2 fixed bottom-0 left-0 right-0 z-50 max-w-xl mx-auto">
    <div
      v-for="item in navItems"
      :key="item.path"
      class="nav-item flex flex-col items-center flex-1 py-1 cursor-pointer transition-colors"
      :class="isActive(item.path) ? 'text-blue-500' : 'text-black'"
      @click="navigateTo(item.path)"
    >
      <component :is="item.icon" class="w-6 h-6" />
      <span class="text-xs mt-1 font-medium">{{ item.label }}</span>
    </div>
  </nav>
</template>

<script setup>
import { h } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const HomeIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      })
    ])
  }
}

const TaskIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
      })
    ])
  }
}

const MineIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      })
    ])
  }
}

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/task', label: 'Task', icon: TaskIcon },
  { path: '/mine', label: 'Mine', icon: MineIcon }
]

const isActive = (path) => {
  return route.path === path
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>