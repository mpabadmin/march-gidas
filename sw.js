const VERSION = 'march-gidas-v1';
const IMG = 'march-img-1';
const EXT = 'march-ext-1';
const FILES = ['./', './index.html', './core.js', './views.js', './tools.js', './fb.js', './vendor/html2canvas.min.js', './app.js', './sarasai.js', './vaistai.js', './igudziai.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './favicon-32.png', './favicon-64.png', './apple-touch-icon.png', './img/badge-balt.png', './img/badge-juod.png', './img/qr.svg'];

self.addEventListener('install', e => {
  // cache: 'reload' – apeiti naršyklės HTTP talpyklą (GitHub Pages max-age 600), kad nauja versija gautų naujus failus
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(u => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== IMG && k !== EXT).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const cacheFirst = (name, req) => caches.open(name).then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
  if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
  return res;
})));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // tccc.org.ua iliustracijos ir YouTube miniatiūros – talpinamos peržiūrėjus
  if ((url.hostname === 'tccc.org.ua' && /\.(jpe?g|png|webp)$/i.test(url.pathname)) || url.hostname === 'i.ytimg.com') {
    e.respondWith(cacheFirst(EXT, req));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // Vietinės iliustracijos (img/tccc) – atskira talpykla, išlieka atnaujinant versiją
  if (url.pathname.indexOf('/img/tccc/') >= 0) {
    e.respondWith(caches.open(IMG).then(c => c.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok) c.put(req, res.clone());
      return res;
    }))));
    return;
  }
  const net = (req.mode === 'navigate' ? fetch(req) : fetch(req, { cache: 'no-cache' })).then(res => {
    if (res && res.ok) {
      const copy = res.clone();
      return caches.open(VERSION).then(c => c.put(req, copy)).then(() => res);
    }
    return res;
  });
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(c => c || net.catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error())));
  e.waitUntil(net.then(() => {}, () => {}));
});
