export function register(config: string) {
	if ("serviceWorker" in navigator) {
		const publicUrl: URL = new URL(process.env.PUBLIC_URL, window.location.href);
		if (publicUrl.origin !== window.location.origin) { return; }

		window.addEventListener("load", () => {
			let swUrl: string = `${process.env.PUBLIC_URL}/service-worker.js`;
			if (process.env.NODE_ENV === "development") {
				swUrl = "localhost/static/js/service-worker.js";
			}
			registerValidSW(swUrl, config);
		});
	}
}

async function registerValidSW(swUrl: string, config: string) {
	//console.log(swUrl);
	try {
		const regSW: ServiceWorkerRegistration = await navigator.serviceWorker.register(swUrl, {
			scope: "./",
			//updateViaCache: 'none' 
		});
		regSW.update();
		//console.log("ServiceWorker registered successfully", regSW);
		navigator.serviceWorker.oncontrollerchange = (ev) => {
			//console.log("New ServiceWorker activated");
			window.location.reload();
		};
	} catch (error) {
		console.log("ServiceWorker register fail");
	}
}


export function unregister() {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.ready
			.then((registration) => {
				registration.unregister();
			})
			.catch((error) => {
				console.error(error.message);
			});
	}
}
