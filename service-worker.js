const CACHE_NAME = 'school-invincible-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/welcome.html',
  '/app.js',
  '/style.css',
  '/manifest.json',
  '/icons/icon.svg',
  '/pwa.js',
  '/scripts.js'
];

// Cache busting
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker installing');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Error during cache:', error);
        throw error;
      })
  );
});

// Network first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone response to store in cache
        const responseClone = response.clone();
        
        // Open cache and add the response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          })
          .catch(error => console.error('Error caching response:', error));
          
        return response;
      })
      .catch(() => {
        // If network request fails, try to get from cache
        return caches.match(event.request)
          .then(response => {
            if (!response) {
              console.log('No cached response for:', event.request.url);
              return new Response('Offline', {
                headers: { 'Content-Type': 'text/plain' }
              });
            }
            console.log('Serving cached response for:', event.request.url);
            return response;
          })
          .catch(error => console.error('Error serving cached response:', error));
      })
  );
});

// Cleanup old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('school-invincible-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon.svg',
      badge: '/icons/icon.svg'
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Log messages to console
self.addEventListener('message', (event) => {
  if (event.data === 'log-cache') {
    caches.keys().then(keys => {
      console.log('Cached keys:', keys);
      Promise.all(keys.map(key => {
        return caches.open(key).then(cache => {
          return cache.keys().then(keys => {
            console.log(`Cache ${key} contains ${keys.length} items`);
          });
        });
      }));
    });
  }
});

// Install event with improved error handling
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Error during cache:', error);
        throw error;
      })
  );
});

// Fetch event with network-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone response to store in cache
        const responseClone = response.clone();
        
        // Open cache and add the response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          })
          .catch(error => console.error('Error caching response:', error));
          
        return response;
      })
      .catch(() => {
        // If network request fails, try to get from cache
        return caches.match(event.request)
          .then(response => {
            if (!response) {
              console.log('No cached response for:', event.request.url);
              return new Response('Offline', {
                headers: { 'Content-Type': 'text/plain' }
              });
            }
            console.log('Serving cached response for:', event.request.url);
            return response;
          })
          .catch(error => console.error('Error serving cached response:', error));
      })
  );
});

// Activate event with cleanup
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('school-invincible-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching app files');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('Clearing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});
