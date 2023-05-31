import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute, Route } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";

declare const self: any;
const ignored = self.__WB_MANIFEST;

const versionStyles: string = "1.03";
const versionScripts: string  = "1.03";
const versionImages: string  = "1.03";
const versionFonts: string  = "1.03";
const versionHtmls: string  = "1.03";
//const versionOffline = 1.03;

interface ICaches {
	styles: string
	scripts: string
	images: string
	fonts: string
	htmls: string
}

const cachesCurrent:ICaches = {
	styles: `styles-${versionStyles}`,
	scripts: `scripts-${versionScripts}`,
	images: `images-${versionImages}`,
	fonts: `fonts-${versionFonts}`,
	htmls: `htmls-${versionHtmls}`,
	//offline: `offline-fallbacks-${versionOffline}`
};


clientsClaim();
//navigationPreload.enable();

// Handle styles:
const stylesRoute: Route = new Route(({ request }) => {
	if (request.destination === "style") {
		console.log('style', request.url);
	} 
	return request.destination === "style";
}, new CacheFirst({
	cacheName: cachesCurrent.styles,
	plugins: [
		new ExpirationPlugin({
		  maxAgeSeconds: 60 * 60 * 24 * 30,
		  maxEntries: 20,
		})
	  ]
}));

const scriptsRoute: Route = new Route(({ request }) => {
	if (request.destination === "script") {
		console.log('script', request.url);
	} 
	return request.destination === "script";
}, new CacheFirst({
	cacheName: cachesCurrent.scripts,
	plugins: [
		new ExpirationPlugin({
		  maxAgeSeconds: 60 * 60 * 24 * 30,
		  maxEntries: 20,
		})
	  ]
}));

const imagesRoute: Route = new Route(({ request }) => {
	if (request.destination === "image") {
		console.log('image', request.url);
	} 
	return request.destination === "image";
}, new CacheFirst({
	cacheName: cachesCurrent.images,
	plugins: [
		new ExpirationPlugin({
		  maxAgeSeconds: 60 * 60 * 24 * 30,
		  maxEntries: 100,
		})
	  ]
}));


const fontsRoute: Route = new Route(({ request }) => {
	if (request.destination === "font") {
		console.log('font', request.url);
	} 

	return request.destination === "font";
}, new StaleWhileRevalidate({
	cacheName: cachesCurrent.fonts,
	plugins: [
		new ExpirationPlugin({
		  maxAgeSeconds: 60 * 60 * 24 * 30,
		  maxEntries: 10,
		})
	  ]
}));


const htmlsRoute: Route = new Route(({ request }) => {
	if (request.destination === "document") {
		console.log('document', request.url);
	} 

	return request.destination === "document";
}, new StaleWhileRevalidate({
	cacheName: cachesCurrent.htmls
}));


registerRoute(stylesRoute);
registerRoute(scriptsRoute);
registerRoute(imagesRoute);
registerRoute(fontsRoute);
registerRoute(htmlsRoute);



// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event: MessageEvent) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});



//auto set new sw
self.addEventListener("install", () => {
	console.log("ServiceWorker will be updated in a moment...");
	/*const files = ["./pages/page404/page404.tsx"]; // I can add more resources here
	event.waitUntil(
	  self.caches.open(cachesCurrent.offline)
		  .then(cache => cache.addAll(files))
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

//const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
//const imageType = new RegExp("/(jpe?g|png|gif|bmp)$/");
