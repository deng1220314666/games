// sw.js
/// <reference lib="webworker" />
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// self.options = {
//     "domain": "3nbf4.com",
//     "zoneId": 11021496
// }
// self.lary = ""
// importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')

self.options = {
    "domain": "5gvci.com",
    "zoneId": 11022417
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')

// 缓存配置
const CACHE_VERSION = 'v0.0.9';
const CACHE_PREFIX = 'TTGame';
const PRECACHE_NAME = `${CACHE_PREFIX}-precache-${CACHE_VERSION}`;

// 快速激活 Service Worker
self.skipWaiting();
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());

    // 清除旧版本缓存
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key.includes(CACHE_PREFIX) && !key.includes(CACHE_VERSION))
                    .map(key => caches.delete(key))
            )
        )
    );
});

/**
 * 注册缓存策略
 * @param {Object} options
 * @param {string[]} options.domains 白名单域名
 * @param {RegExp} options.filePattern 匹配文件类型
 * @param {string} options.cacheName 缓存名称
 * @param {number} options.maxEntries 最大条数
 * @param {number} options.maxAgeSeconds 最大缓存时间（秒）
 */
function registerAutoCache({ domains = [], filePattern = /\.(?:js|css|png|jpg|jpeg|gif|svg)$/, cacheName, maxEntries = 100, maxAgeSeconds = 30 * 24 * 60 * 60 }) {
    workbox.routing.registerRoute(
        ({ url }) => {
            if (!url.protocol.startsWith('http')) return false;
            if (!url.pathname.match(filePattern)) return false;
            if (domains.length && !domains.includes(url.hostname)) return false;
            return true;
        },
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: `${CACHE_PREFIX}-${cacheName}-${CACHE_VERSION}`,
            plugins: [
                new workbox.expiration.ExpirationPlugin({ maxEntries, maxAgeSeconds })
            ]
        })
    );
}

// JS/CSS 静态资源
registerAutoCache({ filePattern: /\.(?:js|css)$/, cacheName: 'assets', maxAgeSeconds: 30 * 24 * 60 * 60 });

// 通用图片
registerAutoCache({ filePattern: /\.(?:png|jpg|jpeg|gif|svg)$/, cacheName: 'static-images', maxAgeSeconds: 30 * 24 * 60 * 60 });

// CDN 白名单资源（可加本地调试 localhost）
registerAutoCache({
    domains: ['ttgame.fun', 'static.roibest.com', 'localhost'],
    filePattern: /\.(?:png|jpg|jpeg|gif|svg)$/,
    cacheName: 'cdn-images',
    maxAgeSeconds: 5 * 24 * 60 * 60
});

// OSS 上传图片
registerAutoCache({
    domains: ['ttgame.fun', 'localhost'],
    filePattern: /\/oss_upload\/.*\.(?:png|jpg|jpeg|gif|svg)$/,
    cacheName: 'oss-images',
    maxAgeSeconds: 5 * 24 * 60 * 60
});

// 动态缓存资源（通过 postMessage 发送）
self.addEventListener('message', (event) => {
    if (event.data?.type === 'CACHE_URLS' && Array.isArray(event.data.payload)) {
        caches.open(PRECACHE_NAME).then(cache => {
            const requests = event.data.payload.map(url => new Request(url, { mode: 'no-cors' }));
            cache.addAll(requests);
        });
    }
});
