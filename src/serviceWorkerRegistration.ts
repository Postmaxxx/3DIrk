export function register() {
	if ("serviceWorker" in navigator) {
		//const publicUrl: URL = new URL(process.env.PUBLIC_URL, window.location.href);
		//if (publicUrl.origin !== window.location.origin) return

		window.addEventListener("load", async () => {
			let swUrl: string = process.env.NODE_ENV === "development" ? "sw.js" : "sw.js";
			registerValidSW(swUrl); 
		});
	}
}



async function registerValidSW(swUrl: string) {
	try {
		const regSW: ServiceWorkerRegistration = await navigator.serviceWorker.register(swUrl, {
			scope: process.env.NODE_ENV === "development" ? '/' : '/', //change if sw path changed
			updateViaCache: 'none' 
		}); 
		regSW.update(); //update if changed
		console.log("ServiceWorker registered successfully", regSW);
		navigator.serviceWorker.oncontrollerchange = (ev) => { //New ServiceWorker activated
			window.location.reload();
		};
	} catch (error) {
		console.log("ServiceWorker register fail:", error);
	}
}



export function unregister() {
	if ("serviceWorker" in navigator) {
		try{
			navigator.serviceWorker.getRegistrations()
				.then(registrations => Promise.all(registrations.map(reg => reg.unregister())))
		} catch(error: any) {
			console.error('Unable to unregister service-worker: ', error?.message);
		}
	}
}
