/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(`/precache-manifest_vCACHE_VERSION.js`);

self.addEventListener("message", (event, var1) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    console.log("CLEARING CACHE");
    event.waitUntil(
      caches.keys().then(function (cacheNames) {
        if (!cacheNames) return;

        var cacheArray = cacheNames.filter(function (cacheName) {
          return cacheName.includes("gpx-route-gen-precache") && !cacheName.endsWith(event.data.version);
        });

        console.log(cacheArray);

        if (!cacheArray.length) return;

        return Promise.all(
          cacheArray.map(function (cacheName) {
            console.log(`REMOVING CACHE - ${cacheName}`);
            return caches.delete(cacheName);
          })
        ).then(() => {
          clients.matchAll({ includeUncontrolled: true }).then((clients) => {
            var client = clients.find((c) => c.id === event.source.id);
            if (!client) return;
            client.postMessage({
              msg: "CACHE_CLEARED",
            });
          });
        });
      })
    );
  }
});

self.addEventListener("install", function () {
  self.skipWaiting();
});

workbox.core.setCacheNameDetails({
  prefix: "gpx-route-gen",
  suffix: `vCACHE_VERSION`,
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST.concat(self.__precacheManifest || []), {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"), {
  blacklist: [/^\/api/, /^\/_/, /\/[^/?]+\.[^/]+$/],
});
