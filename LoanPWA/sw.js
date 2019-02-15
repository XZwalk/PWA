//当页面发生修改时, 要同时对 sw.js 文件进行一次修改。
//保证文件发生改变, 同时缓存的名称也变改变了
let PRECACHE = 'loan-pwa-1.1';
let RUNTIME = 'runtime';

// list the files you want cached by the service worker
PRECACHE_URLS = [
    // 'index.html',
    '/PWA/LoanPWA/dist/',
    // 'style.css',
    // 'main.js'
];


// the rest below handles the installing and caching
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        // Put a copy of the response in the runtime cache.
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});