// BusTrack Service Worker — App ko offline bhi kuch kaam karne deta hai
const CACHE = 'bustrack-v1';
const ASSETS = [
  '/Bustrack/',
  '/Bustrack/index.html',
  '/Bustrack/driver.html',
  '/Bustrack/admin.html'
];

// Install — files cache karo
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — purana cache saaf karo
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — pehle network try karo, fail hone pe cache
self.addEventListener('fetch', e => {
  // Firebase requests ko bypass karo — woh hamesha live chahiye
  if(e.request.url.includes('firebase') ||
     e.request.url.includes('googleapis') ||
     e.request.url.includes('gstatic') ||
     e.request.url.includes('openstreetmap')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
