
const CACHE = "field-inspection-v2";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(async cache => {
      await cache.add(
        new Request("./index.html", { cache: "reload" })
      );
      await cache.add(
        new Request("./", { cache: "reload" })
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k =>
          k.startsWith("field-inspection-") && k !== CACHE
        ).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then(cached =>
        cached || fetch(event.request)
      )
    );
  }
});
