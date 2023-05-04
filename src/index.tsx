import ReactDOM from 'react-dom/client';
import { Suspense, lazy } from "react";
import { Provider } from 'react-redux';
import store from './redux/store';
import Preloader from './components/Preloader/Preloader';
import { HashRouter } from 'react-router-dom';




const LazyApp = lazy(() => import('./App'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);




root.render(
	<HashRouter>
		<Provider store={store}>
			<Suspense fallback={<Preloader />}>
				<LazyApp />
			</Suspense>
		</Provider>
	</HashRouter>
);


