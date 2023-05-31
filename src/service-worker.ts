import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute, Route } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";



//import {warmStrategyCache} from 'workbox-recipes';
import {setDefaultHandler, setCatchHandler} from 'workbox-routing';
//import {generateSW} from 'workbox-build';
import {precacheAndRoute} from 'workbox-precaching';

declare const self: any;
precacheAndRoute(self.__WB_MANIFEST);


//const ignored = self.__WB_MANIFEST;

const versionStyles: string = "1.03";
const versionScripts: string  = "1.03";
const versionImages: string  = "1.03";
const versionFonts: string  = "1.03";
const versionHtmls: string  = "1.03";
const versionOffline: string = '1.03';

interface ICaches {
	styles: string
	scripts: string
	images: string
	fonts: string
	htmls: string
	offline: string
}

const cachesCurrent:ICaches = {
	styles: `styles-${versionStyles}`,
	scripts: `scripts-${versionScripts}`,
	images: `images-${versionImages}`,
	fonts: `fonts-${versionFonts}`,
	htmls: `htmls-${versionHtmls}`,
	offline: `offline-fallbacks-${versionOffline}`
};


clientsClaim();
//navigationPreload.enable();

// Handle styles:
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

const imagesRoute: Route = new Route(({ request }) => {
	return request.destination === "image";
}, new CacheFirst({
	cacheName: cachesCurrent.images,
	plugins: [
		new ExpirationPlugin({
		  maxAgeSeconds: 60 * 60 * 24 * 90,
		  maxEntries: 200,
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


const htmlsRoute: Route = new Route(({ request }) => {
	return request.destination === "document";
}, new CacheFirst({ //StaleWhileRevalidate
	cacheName: cachesCurrent.htmls
}));


registerRoute(stylesRoute);
registerRoute(scriptsRoute);
registerRoute(imagesRoute);
registerRoute(fontsRoute);
registerRoute(htmlsRoute);



setCatchHandler(async (options) => {
	const destination = options.request.destination;
	const cache = await self.caches.open(cachesCurrent.offline);

	/*if (destination === 'script') {
		//alert('You are offline, unable to proceed')
		//console.log(options.request.url);
		const t = await cache.match('./order')
		console.log(t);
		return new Response('');
	}*/
/*
	if (destination === 'style') {
		return new Response('');
	}
*/

	if (destination === 'image') {
		return (await cache.match('offline.jpg')) || Response.error();
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

	const files = ['offline.jpg']; 
	event.waitUntil(
	  self.caches.open(cachesCurrent.offline)
		  .then((cache: any) => cache.addAll(files))
	);

/*
	event.waitUntil(
		self.caches.open(cachesCurrent.scripts)
			.then((cache: any) => cache.addAll(files))
	  );*/
	self.skipWaiting();
}); 




self.addEventListener("activate", async () => {
	/*if (self.registration.navigationPreload) {
		await self.registration.navigationPreload.enable();
	}*/
	const siteCahceKeys: string[] = await caches.keys();
	const cacheKeys: string[] = Object.values(cachesCurrent);

	await siteCahceKeys
		.filter(cache => {
			return !cacheKeys.includes(cache);
		})
		.forEach(async cache => await caches.delete(cache));
}); 

