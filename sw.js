const CACHE_NAME = 'alarm-v1';
const urlsToCache = [
    '/',
    '/alarm.html',
    '/alarm.css',
    '/alarm.js',
    '/files/alarm.mp3',
    '/files/clock.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
