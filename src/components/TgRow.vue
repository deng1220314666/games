<template>
  <component
    :is="interactive ? 'button' : 'div'"
    class="tg-row w-full text-left"
    :class="[{ inset: hasIcon }, interactive ? 'active:bg-black/5 dark:active:bg-white/5' : '']"
    @click="interactive && $emit('click')"
  >
    <span
      v-if="hasIcon"
      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
      :style="iconBg ? { background: iconBg } : {}"
    >
      <slot name="icon" />
    </span>

    <div class="min-w-0 flex-1">
      <div class="truncate text-[15px] text-tg-text">
        <slot>{{ title }}</slot>
      </div>
      <div v-if="subtitle" class="mt-0.5 truncate text-xs text-tg-hint">{{ subtitle }}</div>
    </div>

    <slot name="value">
      <span v-if="value" class="tabular shrink-0 text-[15px] text-tg-hint">{{ value }}</span>
    </slot>

    <svg
      v-if="chevron"
      class="ml-1 h-4 w-4 shrink-0 text-tg-hint opacity-60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  </component>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  chevron: { type: Boolean, default: false },
  interactive: { type: Boolean, default: true },
  iconBg: { type: String, default: '' },
})
defineEmits(['click'])

const slots = useSlots()
const hasIcon = computed(() => !!slots.icon)
</script>
