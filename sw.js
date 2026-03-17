const CACHE_NAME = 'achero-trazabilidad-v1.3.4';
const ASSETS = [
  './menu-soldadura.html',
  './app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Bypass cache for Google Apps Script API
  if (url.includes('script.google.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If fetch fails (offline), try to return a synthetic response or just let it fail
        return new Response(JSON.stringify({ error: 'network_error' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
