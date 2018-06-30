let staticCacheName = 'currency-converter-static-v1';
let imagesCacheName = 'currency-converter-images';

let cacheNames = [
    staticCacheName,
    imagesCacheName
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll([
                './',
                './sw.js',
                './css/bootstrap.min.css',
                './css/style.css',
                './js/controller.js',
                './js/idb.js',
                'https://fonts.googleapis.com/css?family=Lato:100,300,400,500',
                'https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjx4wXg.woff2'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(staticCacheName).then(cache => {
            return cache.match(event.request.url).then(response => {
                if (response) {
                    console.log(response);
                    return response;
                }
                // If no item matched in cache, attempt fetching from network
                return fetch(event.request);
            });
        })
    );
});