// ===== 广告位配置（仅保留 Adsterra + OnClick） =====
// 只在这里维护广告 key / zone，业务代码不要写死。

export const ADSTERRA = {
  // 320x50 底部锚点 banner
  anchorKey: '5459cbf4cf22d7a2a5cdeb4108417b4d',
  anchorInvoke:
    'https://www.highperformanceformat.com/5459cbf4cf22d7a2a5cdeb4108417b4d/invoke.js',
  // 300x250 内容 banner（TTGame SDK 兼容）
  bannerKey: 'd485bca4ce91450e3b58525457ee556a',
  // Social Bar
  socialBar:
    'https://pl27893768.profitablecpmratenetwork.com/2e/b8/74/2eb87400c5dffb7412e3616deb63408a.js',
  // Popunder（激励广告回退用）
  popunder:
    'https://pl27363267.profitablecpmratenetwork.com/2d/b4/da/2db4da1a24ded0c8e42efadab90e35d6.js',
  // Native banner
  nativeInvoke:
    'https://pl27894898.profitablecpmratenetwork.com/155789be5aa8a606b97a7d9e19e14adb/invoke.js',
}

export const ONCLICK = {
  loader: 'https://js.onclckmn.com/static/onclicka.js',
  // 各广告位 zone（data-admpid）
  bannerZone: '441212',
  videoZone: '444023',
  // AdManager（Popunder/Interstitial）
  adManager: 'https://js.wpadmngr.com/static/adManager.js',
  adManagerZone: '440816',
}

// ===== GigaPub 激励广告(TMA)=====
// head 引入 script?id=<id>,点击时 window.showGiga(placement) → Promise(看完 resolve)
export const GIGAPUB = {
  id: 3554,
  script: 'https://ad.gigapub.tech/script?id=3554',
  placement: 'main',
}
