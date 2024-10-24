'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "c9165cdbd98c157c78277c58ebf0b42d",
"assets/AssetManifest.bin.json": "895ab76569496cd62cb6573f8d982453",
"assets/AssetManifest.json": "2dcf01d43e49d9d430c804d7a07ce134",
"assets/assets/images/bag.png": "9b83b18cb2f7120aee4bea7288908087",
"assets/assets/images/bg_new.png": "8827dec70ffb06e5bdac8d24d673f91a",
"assets/assets/images/bottle_1.png": "83d23ec5163db802a8ed4cb141fbbc93",
"assets/assets/images/bottle_2.png": "1752313eb8ee9d1dac176a7c0ea6b9d7",
"assets/assets/images/bottle_3.png": "e5de8b4d384a35730dc54fc12106bd13",
"assets/assets/images/catch_btn.png": "6c8e68396c80a9829f28c4a241f060c2",
"assets/assets/images/claw.png": "85db1fe50b611bfcf72399dd62fa928e",
"assets/assets/images/hoodie.png": "aad976c2024a7c469f50af203b8d60e5",
"assets/assets/images/Logo.png": "a91fb5b365364a846f6aff166f6b5882",
"assets/assets/images/logo_yeos.png": "a3463cc356a8606d7e1ebe318d4a2a98",
"assets/assets/images/mask.png": "09ccfe859fe45829a961f09dbb94d26c",
"assets/assets/images/pack.png": "fa28849338e396b82ef0a64dd11fdf12",
"assets/assets/images/play.png": "972896b8b6689da005b86d4f0d9d2eb3",
"assets/assets/images/raincoat.png": "d93363fdac1aa2bd0a5ce6f9a1aab47b",
"assets/assets/images/shirt.png": "073d1a2604a51e65936cba434c70cdd8",
"assets/assets/images/top.png": "7f027ef9fb05d6aec5a56efc34f54b4a",
"assets/assets/images/tumbler.png": "b9fb6d54f7fe7e3f4754cae89f24feeb",
"assets/assets/sounds/bg_sound.mp3": "34c1e5a6783778ad6d79158fb2f4a33c",
"assets/assets/sounds/drop.wav": "ba1c9aef330664ebd1545f16e692fbf9",
"assets/assets/sounds/drop_sound.wav": "17b02a6b4e7dcb7d1f23e48823742a04",
"assets/assets/sounds/win_sound.wav": "5d4649fafb87ea0128617c14817a3d6f",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "6f193a798158924a9852e64fcdceaedb",
"assets/NOTICES": "3db99c048499447d4b9f95bcd66db28b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "3c79d7794802e91d47e575c10e9a06ac",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "07d3b05d0207a5a239371aca7ff58aac",
"icons/Icon-192.png": "3c79d7794802e91d47e575c10e9a06ac",
"icons/Icon-512.png": "3e2a0728ab57fe1c840ca6557e46fba9",
"icons/Icon-maskable-192.png": "3c79d7794802e91d47e575c10e9a06ac",
"icons/Icon-maskable-512.png": "3e2a0728ab57fe1c840ca6557e46fba9",
"index.html": "fac10e911672ca7a823da047b017f522",
"/": "fac10e911672ca7a823da047b017f522",
"main.dart.js": "04de0fd4c21d33d3e673aa0da97b488e",
"manifest.json": "bd74a90e30fb2c5a28eb4197e23d6d8d",
"version.json": "bef156e120dc47f513043476bfd73f2b"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
