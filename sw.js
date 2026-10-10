'use strict';
// Keep this app's cache separate from other repositories on the same GitHub account.
const PREFIX='workshop-builder:'+self.registration.scope+':';
const CACHE=PREFIX+'v7-touch-curriculum';
const ASSETS=['./','./index.html','./manifest.webmanifest','./pwa.js','./icons.js','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const BASE=new URL(self.registration.scope);
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS).then(()=>self.skipWaiting())));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(async response=>{
      if(response.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone());}
      return response;
    }).catch(async()=>{
      const cache=await caches.open(CACHE);
      return await cache.match('./index.html')||Response.error();
    }));
    return;
  }
  event.respondWith(caches.open(CACHE).then(async cache=>{
    const cached=await cache.match(request);
    if(cached)return cached;
    return fetch(request);
  }));
});
