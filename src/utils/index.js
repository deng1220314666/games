// ===== 通用工具 =====

// 防抖
export function debounce(func, wait) {
  if (typeof func !== 'function') throw new TypeError('Expected a function')
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// 拖动元素(悬浮按钮用)
export function makeDraggable(target) {
  if (!target) return
  let isDragging = false
  let offsetX = 0
  let offsetY = 0

  const startDrag = (x, y) => {
    const rect = target.getBoundingClientRect()
    target.style.position = 'fixed'
    target.style.left = `${rect.left}px`
    target.style.top = `${rect.top}px`
    target.style.right = 'auto'
    target.style.bottom = 'auto'
    offsetX = x - rect.left
    offsetY = y - rect.top
    isDragging = true
    document.body.style.userSelect = 'none'
  }
  const doDrag = (x, y) => {
    if (!isDragging) return
    let newLeft = x - offsetX
    let newTop = y - offsetY
    const maxLeft = window.innerWidth - target.offsetWidth
    const maxTop = window.innerHeight - target.offsetHeight
    newLeft = Math.max(0, Math.min(newLeft, maxLeft))
    newTop = Math.max(0, Math.min(newTop, maxTop))
    target.style.left = `${newLeft}px`
    target.style.top = `${newTop}px`
  }
  const endDrag = () => {
    isDragging = false
    document.body.style.userSelect = ''
  }

  target.addEventListener('mousedown', (e) => {
    e.preventDefault()
    startDrag(e.clientX, e.clientY)
  })
  document.addEventListener('mousemove', (e) => doDrag(e.clientX, e.clientY))
  document.addEventListener('mouseup', endDrag)
  target.addEventListener(
    'touchstart',
    (e) => {
      const touch = e.touches[0]
      startDrag(touch.clientX, touch.clientY)
    },
    { passive: false }
  )
  document.addEventListener(
    'touchmove',
    (e) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      doDrag(touch.clientX, touch.clientY)
    },
    { passive: false }
  )
  document.addEventListener('touchend', endDrag)
}

// 取 URL 参数
export function getQueryParam(name, url = window.location.href) {
  try {
    return new URL(url).searchParams.get(name)
  } catch (e) {
    return null
  }
}

// 动态加载脚本(去重)
export async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const normalize = (u) => u.split('?')[0].replace(/\/+$/, '')
    const exists = Array.from(document.scripts).some((s) => {
      try {
        return normalize(s.src) === normalize(url)
      } catch {
        return false
      }
    })
    if (exists) return resolve()
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = () => resolve()
    script.onerror = (e) => reject(e)
    document.head.appendChild(script)
  })
}

// 本地「今天」日期 key(YYYY-MM-DD),用于每日重置
export function getTodayKey() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// 生成随机 ID(匿名用户 / 幂等 token)
export function randomId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

// 数字千分位
export function formatNumber(n) {
  return Number(n || 0).toLocaleString('en-US')
}
