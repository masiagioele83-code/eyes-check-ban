const CACHE_NAME = 'ban-checker-v2';
const ASSETS = ['/bg.jpeg', '/bg-audio.mp3', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Mai cache-are le chiamate API
  if (url.includes('/api/')) return;

  // HTML sempre dalla rete (mai dalla cache), per evitare pagine vecchie
  if (event.request.mode === 'navigate' || url.endsWith('/') || url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Il resto (immagini, audio, ecc.) può venire dalla cache
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});