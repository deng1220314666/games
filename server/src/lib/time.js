// 服务端统一按 UTC 计算「日」,避免客户端改本地时间刷签到。
function key(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`
}

export function todayKey() {
  return key(new Date())
}

export function yesterdayKey() {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 1)
  return key(d)
}
