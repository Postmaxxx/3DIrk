import ReactDOM from 'react-dom/client';
import { Suspense, lazy } from "react";
import { Provider } from 'react-redux';
import store from './redux/store';




const LazyApp = lazy(() => import('./App'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);




root.render(
	<Provider store={store}>
		<Suspense fallback={<div>OLNOAD</div>}>
			<LazyApp />
		</Suspense>
	</Provider>
);


