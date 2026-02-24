// Service Worker для Letovo Math PWA
// Обеспечивает кеширование ресурсов и работу в офлайн-режиме

const CACHE_VERSION = 'letovo-v1';
const STATIC_CACHE = 'letovo-static-v1';
const DYNAMIC_CACHE = 'letovo-dynamic-v1';

// Файлы для кеширования при установке Service Worker
const STATIC_FILES = [
    '/',
    '/css/app.css',
    '/js/app.js',
    '/manifest.json',
    '/images/icon-192.png',
    '/images/icon-512.png'
];

// Установка Service Worker
// Происходит при первой загрузке страницы или обновлении SW
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker...', event);
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Precaching static files');
                return cache.addAll(STATIC_FILES);
            })
            .catch(err => {
                console.log('[SW] Precaching failed:', err);
            })
    );
    // Пропускаем фазу ожидания и сразу активируем новый SW
    self.skipWaiting();
});

// Активация Service Worker
// Удаляем старые кеши при обновлении версии
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...', event);
    event.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
                        console.log('[SW] Removing old cache:', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    // Берём управление всеми открытыми вкладками
    return self.clients.claim();
});

// Обработка запросов - стратегия Network First, fallback to Cache
// Сначала пытаемся загрузить из сети, если не получается - берём из кеша
self.addEventListener('fetch', event => {
    const { request } = event;
    
    // Пропускаем не-GET запросы (POST, PUT, DELETE)
    if (request.method !== 'GET') {
        return;
    }
    
    // Пропускаем chrome-extension и другие нестандартные схемы
    if (!request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then(response => {
                // Клонируем ответ, чтобы сохранить его в кеш
                // (response можно прочитать только один раз)
                const responseClone = response.clone();
                
                // Сохраняем только успешные ответы в динамический кеш
                if (response.status === 200) {
                    caches.open(DYNAMIC_CACHE)
                        .then(cache => {
                            cache.put(request, responseClone);
                        });
                }
                
                return response;
            })
            .catch(() => {
                // Если сеть недоступна, пытаемся взять из кеша
                return caches.match(request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        // Если ничего нет в кеше и это HTML-страница,
                        // показываем главную страницу (офлайн fallback)
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/');
                        }
                    });
            })
    );
});

// Обработка Push-уведомлений (готово к расширению)
// Позволит отправлять уведомления о новых уроках, результатах и т.д.
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Новое уведомление';
    const options = {
        body: data.body || 'У вас есть новое уведомление',
        icon: '/images/icon-192.png',
        badge: '/images/icon-192.png',
        data: {
            url: data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Обработка клика по уведомлению
// Открывает соответствующую страницу в приложении
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
