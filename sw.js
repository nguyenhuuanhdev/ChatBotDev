const CACHE_NAME = 'alarm-v2'; // tăng version mỗi khi bạn update sw
const urlsToCache = [
    '/',
    '/alarm.html',
    '/alarm.css',
    '/files/alarm.mp3',
    '/files/clock.svg',
    '/icon-192.png',
    '/icon-512.png'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // áp dụng SW mới ngay
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(err => console.warn('Cache install failed:', err))
    );
});

self.addEventListener('activate', event => {
    // xóa cache cũ khi active
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(k => {
                    if (k !== CACHE_NAME) return caches.delete(k);
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    // Network-first cho file JS (đặc biệt alarm.js) để luôn lấy bản mới nhất
    if (url.pathname.endsWith('/alarm.js') || req.destination === 'script') {
        event.respondWith(
            fetch(req).then(networkResponse => {
                // cập nhật cache nếu fetch thành công
                caches.open(CACHE_NAME).then(cache => {
                    try { cache.put(req, networkResponse.clone()); } catch (e) { }
                });
                return networkResponse;
            }).catch(() => {
                return caches.match(req);
            })
        );
        return;
    }

    // Với các resource khác (css, mp3, images) dùng cache-first
    event.respondWith(
        caches.match(req).then(cached => {
            return cached || fetch(req).then(networkResponse => {
                // cache các response kiểu basic để offline tốt hơn
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    caches.open(CACHE_NAME).then(cache => {
                        try { cache.put(req, networkResponse.clone()); } catch (e) { }
                    });
                }
                return networkResponse;
            }).catch(() => {
                // (tùy chọn) trả về fallback nếu muốn
                return cached;
            });
        })
    );
});
