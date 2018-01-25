// const CACHE_LIST = [
//                 '/offline',
//                 '/javascripts/offline.bundle.js'
// ]
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('erky').then(function (cache) {
            // return cache.addAll(CACHE_LIST);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});
self.addEventListener('activate', function(event) {
	return self.clients.claim();
});
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
    // event.waitUntil(
    //     caches.open('erky').then(function (cache) {
    //         return cache.addAll(CACHE_LIST);
    //     })
    // );
    event.waitUntil(update(event.request))
});

function update(request) {
  return caches.open('erky').then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      }).catch(e => e);
    });
  });
}