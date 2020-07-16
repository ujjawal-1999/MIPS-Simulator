const CACHE_NAME = "version-1";
const urlToCache = ['index.html','offline.html'];

const self = this;

//Install a Service Worker
self.addEventListener('install',(event)=>{
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache)=>{
				console.log('Opened cache');
				return cache.addAll(urlToCache);
			})
	)
});

//Listen for Events
self.addEventListener('fetch',(event)=>{
	event.respondWith(
		caches.match(event.request)
			.then(()=>{
				return fetch(event.request)
					.catch(()=> caches.match('offline.html'))
			})
	)
});
//Activate the service worker
self.addEventListener('activate',(event)=>{
	const cacheWhitelist = [];
	cacheWhitelist.push(CACHE_NAME);
	event.waitUntil(
		caches.keys()
			.then((cacheNames)=> Promise.all(
				cacheNames.map((cacheName)=>{
					if(!cacheWhitelist.includes(cacheName)){
						return caches.delete(cacheName);
					}
				})
			))
	)
});