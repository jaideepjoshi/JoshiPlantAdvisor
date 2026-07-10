// Bump date on each deploy to refresh cached assets
const CACHE = 'plant-buddy-2026-07-11r';
const SHELL = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  // No skipWaiting — avoids reload loop on iOS Safari
});

self.addEventListener('activate', e => {
  // No clients.claim() — avoids flicker/re-render on iOS when SW first activates
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // let Firebase/CDN through

  // Network-first for everything: always fetch fresh when online, cache as fallback
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
