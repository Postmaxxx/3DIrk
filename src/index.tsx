import { createRoot } from 'react-dom/client';
import { Suspense, lazy } from "react";
import { Provider } from 'react-redux';
import store from './redux/store';
import Preloader from './components/Preloaders/Preloader';
//import * as sw from './serviceWorkerRegistration';
import React from "react";


const LazyApp = lazy(() => import('./App'));

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Suspense fallback={<Preloader />}>
				<LazyApp />
			</Suspense>
		</Provider>
	</React.StrictMode>
);



//sw.register('')

