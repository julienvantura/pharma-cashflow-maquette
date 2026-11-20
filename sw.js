/* Pharma Cashflow : fonctionne hors connexion après la première visite */
const V='pc-web-2';
const SHELL=['index.html','accueil.html','connexion.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','logo/pharma-cashflow-symbole.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const page=e.request.mode==='navigate';
  e.respondWith(caches.open(V).then(async c=>{
    const save=r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r;};
    if(page){try{return save(await fetch(e.request));}catch(_){return (await c.match(e.request,{ignoreSearch:true}))||c.match('index.html');}}
    const hit=await c.match(e.request);const net=fetch(e.request).then(save).catch(()=>hit);
    return hit||net;
  }));
});
