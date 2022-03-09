const FILES_TO_CACHE = [
    './index.html',
    './events.html', 
    './schedule.html',
    './tickets.html',
    './assets/css/style.css',
    './assets/css/bootstrap.css',
    './assets/css/tickets.css',
    './dist/app.bundle.js',
    './dist/tickets.bundle.js',
    './dist/schedule.bundle.js',
    './dist/events.bundle.js',
    './dist/assets/img/food-table.jpg',
    './dist/assets/img/grill.jpg',
];
const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;


self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function( keylist) {
            let cacheKeeplist = keylist.filer(function(key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeeplist.push(CACHE_NAME)

            return Promise.all(keylist.map(function (key, i) {
                if(cacheKeeplist.indexOf(key)=== -1){
                    console.log('deleting chache :' + keylist[i]);
                    return caches.delete(keylist[i]);
                }
                
            }))
        })
    )
});

self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
      caches.match(e.request).then(function (request) {
        if (request) { // if cache is available, respond with cache
          console.log('responding with cache : ' + e.request.url)
          return request
        } else {       // if there are no cache, try fetching request
          console.log('file is not cached, fetching : ' + e.request.url)
          return fetch(e.request)
        }
  
        // You can omit if/else for console.log & put one line below like this too.
        // return request || fetch(e.request)
      })
    )
  })