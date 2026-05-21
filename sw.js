// Cache key includes today's date — changes automatically with each new day's deploy
const CACHE = 'plant-buddy-2026-05-20';
const SHELL = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  // Don't skipWaiting — wait for the user to tap "Update now" in the banner
});

self.addEventListener('activate', e => {
  // Delete every old cache except the current one
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// The page sends 'skipWaiting' when the user taps "Update now"
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // don't intercept Firebase / CDN

  if (e.request.mode === 'navigate') {
    // Network-first for HTML — always try to get the freshest version
    e.respondWith(
      fetch(e.request)
        .then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first for icons, manifest, and other static assets
  e.respondWith(
    caches.match(e.request).then(r => r ||
      fetch(e.request).then(nr => {
        if (nr.ok) caches.open(CACHE).then(c => c.put(e.request, nr.clone()));
        return nr;
      })
    )
  );
});
