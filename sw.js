// 冰箱日记离线缓存。改了代码就把版本号 +1，手机上会自动更新。
const VERSION = 'fridge-diary-v5';
const FILES = ['./', './index.html', './app.js', './data.js', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// 先用缓存，同时后台联网更新；没网也能打开
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(e.request, { ignoreSearch: true }).then(hit => {
        const net = fetch(e.request).then(res => { if (res && res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    )
  );
});
