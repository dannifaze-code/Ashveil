/* Ashveil Service Worker — Offline support */
const CACHE_NAME = 'ashveil-cache-v2';
const urlsToCache = [
  '/index.html',
  '/sprites/config.js',
  '/sprites/player.js',
  '/sprites/npcs.js',
  '/sprites/enemies.js',
  '/sprites/weapons.js',
  '/sprites/equipment.js',
  '/sprites/creator.js',
  '/sprites/init.js',
  '/sprites/assets.js',
  '/sprites/effects.js',
  '/sprites/tutorial.js',
  '/manifest.json'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).then(function (response) {
      if (response && response.status === 200 && response.type === 'basic') {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });
      }
      return response;
    }).catch(function () {
      return caches.match(event.request);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (name) {
          return name !== CACHE_NAME;
        }).map(function (name) {
          return caches.delete(name);
        })
      );
    })
  );
});
