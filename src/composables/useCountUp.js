import { ref, watch, onUnmounted } from 'vue'

// 数字滚动动画(requestAnimationFrame,缓动 easeOutCubic);reduced-motion 时直接跳到目标
export function useCountUp(getTarget, { duration = 900 } = {}) {
  const display = ref(Number(getTarget()) || 0)
  let raf = null
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function animate(to) {
    to = Number(to) || 0
    if (reduce) {
      display.value = to
      return
    }
    cancelAnimationFrame(raf)
    const from = display.value
    const start = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      display.value = Math.round(from + (to - from) * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  watch(getTarget, (v) => animate(v))
  onUnmounted(() => cancelAnimationFrame(raf))
  return display
}
