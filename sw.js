const CACHE = "dinoplay-core-v175";
const FILES = [
  "./",
  "./index.html",
  "./style.css?v=15",
  "./platform.css?v=17",
  "./game-runtime.css?v=2",
  "./platform.js?v=31",
  "./language.css?v=1",
  "./i18n.js?v=10",
  "./parental.js?v=1",
  "./multiplayer-core.js?v=3",
  "./multiplayer.js?v=9",
  "./shell.js?v=2",
  "./games/catalog.json?v=10",
  "./version.json",
  "./dinoplay-v23.webmanifest",
  "./dinoplay-v23-192.png",
  "./dinoplay-v23-512.png",
  "./assets/dinoplay-mascot.png",
  "./assets/flags/pt.svg",
  "./assets/flags/br.svg",
  "./assets/flags/gb.svg",
  "./assets/flags/fr.svg",
  "./assets/flags/de.svg",
  "./assets/flags/es.svg",
  "./assets/flags/pl.svg",
];
FILES.push("./privacy.html", "./about.html");
self.addEventListener("install", (e) =>
  e.waitUntil(
    caches
      .open(CACHE)
      .then(async (c) => {
        await c.addAll(FILES);
        const response = await fetch("./games/catalog.json", { cache: "no-store" });
        if (!response.ok) throw new Error("catalog-cover-cache");
        const data = await response.json();
        const covers = (data.games || []).map((game) => `./${game.catalogCover}`);
        if (covers.length) await c.addAll(covers);
      })
      .then(() => self.skipWaiting()),
  ),
);
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE && !k.startsWith("dinoplay-games-"))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.pathname.includes("/__dinoplay_games/")) {
    e.respondWith(
      caches.match(e.request).then(
        (response) =>
          response ||
          new Response("Jogo não instalado.", {
            status: 404,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          }),
      ),
    );
    return;
  }
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request, { cache: "no-store" })
        .then((r) => {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return r;
        })
        .catch(
          async () =>
            (await caches.match(e.request)) ||
            (!url.pathname.includes("/games/community/")
              ? await caches.match("./index.html")
              : new Response(
                  "Jogo indisponível offline. Instala-o na biblioteca.",
                  { status: 503 },
                )),
        ),
    );
    return;
  }
  if (
    url.pathname.endsWith("/version.json") ||
    url.pathname.endsWith("/games/catalog.json")
  ) {
    e.respondWith(
      fetch(e.request, { cache: "no-store" })
        .then((r) => {
          if (r.ok) {
            const copy = r.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return r;
        })
        .catch(() =>
          caches
            .match(e.request)
            .then((r) => r || caches.match("./games/catalog.json?v=10")),
        ),
    );
    return;
  }
  const core = /\.(?:js|css|html)$/.test(url.pathname);
  if (core) {
    e.respondWith(
      fetch(e.request, { cache: "no-store" })
        .then((r) => {
          if (r.ok) {
            const copy = r.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return r;
        })
        .catch(() => caches.match(e.request)),
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(
      (r) =>
        r ||
        fetch(e.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return response;
        }),
    ),
  );
});
