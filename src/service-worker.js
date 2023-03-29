
// src/service-worker.js
self.__WB_DISABLE_DEV_LOGS = true
self.addEventListener('install', (event) => {
  console.log('👷', 'install', event);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('👷', 'activate', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Return cached content or fetch from the network
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }),
  );
});
