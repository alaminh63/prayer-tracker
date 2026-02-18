const CACHE_NAME = "salat-time-v1"
const urlsToCache = ["/", "/prayers", "/settings", "/notifications"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  // Only cache http/https requests
  if (!event.request.url.startsWith("http")) return

  // Network first, then cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request)
      })
  )
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || "Salat Time"
  const options = {
    body: data.body || "Time for prayer",
    icon: "/icon.svg",
    badge: "/icon.svg",
    vibrate: [200, 100, 200],
    tag: data.tag || "prayer-notification",
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow("/"))
})
