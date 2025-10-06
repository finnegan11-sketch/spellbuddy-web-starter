const CACHE = 'sb-cache-v1';
const OFFLINE_URLS = [
  '/',
  '/study',
  '/dashboard',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('/')));
    return;
  }
  event.respondWith(
    caches.match(req).then(res => res || fetch(req).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(req, copy));
      return response;
    }))
  );
});