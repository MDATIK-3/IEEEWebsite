const VERSION = 'v1';                       // bump this when you change the SW
const RUNTIME = `runtime-${VERSION}`;
const OFFLINE_URL = '/offline.html';

const PRECACHE = [
  OFFLINE_URL,
  '/favicon/icon-192.png',
  '/images/IEEELogo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(RUNTIME).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;        // skip Supabase/CDN/etc.
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return; // never cache

  // Pages: always fresh when online, offline page as fallback (your data is dynamic)
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Static assets & images: serve cached fast, refresh in background
  const isAsset =
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/images') ||
    /\.(?:png|jpe?g|svg|gif|webp|avif|ico|woff2?)$/.test(url.pathname);

  if (isAsset) {
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => { if (res.ok) cache.put(request, res.clone()); return res; })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
