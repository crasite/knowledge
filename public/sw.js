self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('erky').then(function (cache) {
            console.log('adding caches')
            return cache.addAll([
                '/offline',
                '/offline.bundle.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});