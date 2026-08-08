// Service worker de Inverza — Fase 1 de soporte offline.
//
// Qué SÍ hace: cachea el "shell" de la app (HTML de páginas visitadas +
// assets estáticos) a medida que se navega online, para que abrir la app
// sin señal siga mostrando la última versión vista en vez de un error de
// red. También sirve /offline cuando una navegación nueva falla y no hay
// nada en caché para esa ruta.
//
// Qué NO hace: no cachea ni intercepta llamadas a Server Actions ni a
// rutas /api — esas siempre van a la red. Si fallan por falta de conexión,
// el código de la app (ver lib/offline/) las encola en IndexedDB y las
// reintenta cuando vuelve la señal.

const CACHE_VERSION = "inverza-v1";
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = [OFFLINE_URL, "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // Server Actions van siempre a la red

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // ej. /api/avatar — siempre en vivo

  // Navegación (HTML de página): red primero, caché como respaldo.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Assets estáticos: caché primero (no cambian de contenido por hash),
  // se completa el caché la primera vez que se piden online.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
  }
});
