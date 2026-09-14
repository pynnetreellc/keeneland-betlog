// Bump VERSION whenever you want to guarantee a clean cache sweep.
// You don't have to for normal edits — index.html and app.js are fetched
// network-first, so a deploy lands on the next open.
const VERSION = 'v1';
const CACHE = 'keeneland-betlog-' + VERSION;
const SHELL = ['./', './index.html', './app.js', './manifest.webmanifest',
               './react.production.min.js', './react-dom.production.min.js',
               './icon-192.png', './icon-512.png',
               './icon-192-maskable.png', './icon-512-maskable.png',
               './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  // The page and the app bundle are the two things that actually change.
  const isApp = e.request.mode === 'navigate'
             || url.endsWith('/index.html')
             || url.endsWith('/app.js');

  if (isApp) {
    // network first: whatever you pushed last is what opens.
    // no-store skips the host's HTTP cache so a fresh deploy lands immediately.
    e.respondWith(
      fetch(new Request(url, { cache: 'no-store' }))
        .then(res => {
          const copy = res.clone();
          const key = e.request.mode === 'navigate' ? './index.html' : e.request;
          caches.open(CACHE).then(c => c.put(key, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // React, icons and the manifest never change: cache first, refresh quietly.
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => {
      if (res.ok && new URL(url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
