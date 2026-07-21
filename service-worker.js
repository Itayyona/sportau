const CACHE = 'sportau-v3';
const ASSETS = ['index.html', 'manifest.json', 'service-worker.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(caches.match(e.request).then(function(r) {
      return r || fetch(e.request);
    }).catch(function() {
      return caches.match('index.html');
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r) {
    return r || fetch(e.request);
  }));
});

self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SCHEDULE_NOTIF') {
    // Intent registered; actual scheduling handled client-side via setTimeout.
    e.waitUntil(Promise.resolve());
  }
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/sportau/'));
});
