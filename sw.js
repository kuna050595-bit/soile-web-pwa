// Сервис-воркер "Сөйле": простое офлайн-кэширование оболочки приложения,
// чтобы карточки и озвучка (там, где голос уже есть локально) работали
// даже при слабом или отсутствующем интернете в кабинете/центре.
var CACHE_NAME = 'soile-aac-v4';
var SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './voice-data.js',
  './voice-data-ru.js'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return Promise.all(SHELL_URLS.map(function(url){
        return cache.add(url).catch(function(){ /* не критично, если один файл не закэшировался */ });
      }));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){ return n !== CACHE_NAME; }).map(function(n){ return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  if (event.request.method !== 'GET') return;

  // Для самой страницы (HTML) — сначала пробуем сеть, чтобы новая
  // версия всегда подхватывалась сразу же, как только есть интернет;
  // кэш используется только как запасной вариант при офлайне. Это
  // защищает от ситуации, когда старая закэшированная версия
  // "застревает" и не даёт увидеть обновление.
  var isNavigation = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isNavigation){
    event.respondWith(
      fetch(event.request).then(function(resp){
        if (resp && resp.status === 200){
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return resp;
      }).catch(function(){
        return caches.match(event.request);
      })
    );
    return;
  }

  // Остальные файлы (иконки, голосовые данные и т.д.) — кэш-первый,
  // как и раньше, для скорости и офлайн-работы.
  event.respondWith(
    caches.match(event.request).then(function(cached){
      if (cached) return cached;
      return fetch(event.request).then(function(resp){
        if (resp && resp.status === 200 && resp.type === 'basic'){
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return resp;
      }).catch(function(){
        return cached;
      });
    })
  );
});
