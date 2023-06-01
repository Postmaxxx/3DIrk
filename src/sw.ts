import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute, Route } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

//import {warmStrategyCache} from 'workbox-recipes';
import { setCatchHandler} from 'workbox-routing';
import {precacheAndRoute} from 'workbox-precaching';

//for ts
declare const self: any;
//declare precache, will be changed during building
precacheAndRoute(self.__WB_MANIFEST);

//trying to change cachename for precaching, does not work ???
//setCacheNameDetails({prefix: 'we'});

//do not need due to precache all js+svg+css+fonts
/*const versionStyles: string = "1.03";
const versionScripts: string  = "1.03";
const versionFonts: string  = "1.03";
const versionHtmls: string  = "1.03";*/

const versionImages: string  = "1.03";
const versionOffline: string = '1.04';

interface ICaches {
	/*styles: string
	scripts: string
	fonts: string
	htmls: string*/
	images: string
	offline: string
}

//versioning caches, except precaching resources
const cachesCurrent: ICaches = {
	/*styles: `styles-${versionStyles}`,
	scripts: `scripts-${versionScripts}`,
	fonts: `fonts-${versionFonts}`,
	htmls: `htmls-${versionHtmls}`,*/
	images: `images-${versionImages}`,
	offline: `offline-fallbacks-${versionOffline}`
};


clientsClaim(); //for updating sw immediately without waiting for reload app
//navigationPreload.enable();

// Handle type of requests during work and caching them
/*
const stylesRoute: Route = new Route(( event ) => {
	return event.request.destination === "style";
}, new CacheFirst({
	cacheName: cachesCurrent.styles,
	plugins: [
		new ExpirationPlugin({
		  maxAgeSeconds: 60 * 60 * 24 * 90,
		  maxEntries: 80,
		})
	  ]
}));



const scriptsRoute: Route = new Route(({ request }) => {
	return request.destination === "script";
}, new CacheFirst({
	cacheName: cachesCurrent.scripts,
	plugins: [
		new ExpirationPlugin({
		  maxAgeSeconds: 60 * 60 * 24 * 90,
		  maxEntries: 40,
		})
	  ]
}));





const fontsRoute: Route = new Route(({ request }) => {
	return request.destination === "font";
}, new CacheFirst({
	cacheName: cachesCurrent.fonts,
	plugins: [
		new ExpirationPlugin({
		  maxAgeSeconds: 60 * 60 * 24 * 90,
		  maxEntries: 15,
		})
	  ]
}));


const htmlsRoute: Route  = new Route(({ request }) => {
	return request.destination === "document";
}, new CacheFirst({ //StaleWhileRevalidate
	cacheName: cachesCurrent.htmls
}));


//registerRoute(stylesRoute);
//registerRoute(scriptsRoute);
//registerRoute(fontsRoute);
//registerRoute(htmlsRoute);
*/



//cache all fetched images
const imagesRoute: Route = new Route(({ request }) => {
	return request.destination === "image";
}, new StaleWhileRevalidate({
	cacheName: cachesCurrent.images,
	plugins: [
		new ExpirationPlugin({
		  maxAgeSeconds: 60 * 60 * 24 * 60,
		  maxEntries: 300,
		})
	  ]
}));
registerRoute(imagesRoute);


//catch errors during fetching resources
setCatchHandler(async (options) => {
	const destination = options.request.destination;
	//in case of fetching images are unabled to reach response with cached mock image
	if (destination === 'image') {
		const cache = await self.caches.open(cachesCurrent.offline);
		return (await cache.match('offline.webp')) || Response.error();
	}
	return Response.error();
  });



// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event: MessageEvent) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});



//auto set new sw
self.addEventListener("install", (event: any) => {
	console.log("ServiceWorker will be updated in a moment...");
	//caching img as a mock in case of unable download actual images
	const files = ['offline.jpg']; 
	event.waitUntil(
	  self.caches.open(cachesCurrent.offline) 
		  .then((cache: Cache) => cache.addAll(files))
	);
	//for updating sw immediately without waiting for reload app
	self.skipWaiting();
}); 




self.addEventListener("activate", async (event: MessageEvent) => {
	//clean all non-actual caches
	/*const siteCacheKeys = await caches.keys();
	const cacheKeys = Object.values(cachesCurrent);
	await siteCacheKeys
		.filter(cache => {
			return !cacheKeys.includes(cache);
		})
		.forEach(async cache => await caches.delete(cache)); */
}); 
