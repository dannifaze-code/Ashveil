let CACHE_NAME = 'stein-cache';
let urlsToCache = [
    '/assets/maintenance.html',
    '/assets/stylesheets/maintenance.css',
    '/assets/images/login-background.png',
    '/assets/images/login-logo.png',
    '/assets/images/icons/icon_twitter.png',
    '/assets/images/icons/icon_facebook.png',
    '/assets/images/icons/icon_reddit.png',
    '/assets/images/icons/icon_discord.png',
    '/assets/images/icons/icon_pg5.png',
    '/assets/images/mm_pc.png',
    '/assets/images/mm_fire.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

function fromCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        let url = new URL(request.url);
        if (url.pathname === "/" ||
            url.pathname === "/index" ||
            url.pathname === "/game" ||
            url.pathname === "/watch") {
            console.log('failed to fetch ' + request.url + ' - redirect to maintenance screen');
            return cache.match('/assets/maintenance.html');
        }
        return cache.match(request);
    });
}

self.addEventListener('fetch', function(event) {
    event.respondWith(fetchFromServerOrCache(event.request));
});

function fetchFromServerOrCache(request) {
    let cacheRequest = request.clone();
    return fetch(request).then(function (response) {
        return response || fromCache(cacheRequest);
    }).catch(function(reason) {
        console.log('Service Worker fetch failed: ', reason)
        return fromCache(cacheRequest);
    });
}