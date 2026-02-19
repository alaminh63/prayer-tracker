const CACHE_NAME = 'prayer-tracker-v1';
const URLS_TO_CACHE = [
  '/',
  '/quran',
  '/quran/history',
  '/quran/bookmarks',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                if (event.request.url.includes('api.alquran.cloud')) {
                   cache.put(event.request, responseToCache);
                }
              });
            return response;
          }
        );
      })
  );
});

// Notification handling
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Salat Time', body: 'নামাজের সময় হয়েছে।' };
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: 'prayer-alert',
      renotify: true,
      data: { url: data.url || '/', playAdhan: true },
      actions: [
        { action: 'play', title: 'Play Adhan (আজান দিন)' },
        { action: 'close', title: 'Dismiss' }
      ]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Handle stop action
      if (event.action === 'stop') {
        for (const client of clientList) {
          if ('postMessage' in client) {
            client.postMessage({ type: 'STOP_ADHAN' });
          }
        }
        return;
      }

      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then(c => {
            if (event.action === 'play') {
              c.postMessage({ type: 'PLAY_ADHAN' });
            }
          });
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/').then(windowClient => {
          if (windowClient && event.action === 'play') {
            // Give it a moment to load then post message
            setTimeout(() => {
              windowClient.postMessage({ type: 'PLAY_ADHAN' });
            }, 2000);
          }
        });
      }
    })
  );
});
