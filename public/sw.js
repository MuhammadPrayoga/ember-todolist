const CACHE_NAME = 'ember-v4'

// Only cache static assets, NOT html (always fetch fresh)
const PRECACHE_ASSETS = [
  '/manifest.json',
  '/favicon.svg'
]

// Install: precache static assets only, skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate: delete old caches, claim all clients immediately
self.addEventListener('activate', (event) => {
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

// Fetch strategy:
// - HTML/navigation: Network first, fallback to cache (always get latest)
// - Assets (JS/CSS/images): Stale-while-revalidate (fast load + background update)
self.addEventListener('fetch', (event) => {
  const { request } = event

  // For HTML navigation: NETWORK FIRST
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the fresh version
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })
          return response
        })
        .catch(() => {
          // Offline: serve from cache
          return caches.match(request).then((cached) => cached || caches.match('/index.html'))
        })
    )
    return
  }

  // For all other assets: STALE-WHILE-REVALIDATE
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cache immediately, but fetch in background to update
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
        .catch(() => cachedResponse)

      // Return cached version now, update in background
      return cachedResponse || fetchPromise
    })
  )
})
