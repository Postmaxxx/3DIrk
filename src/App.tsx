import { Routes, Route, BrowserRouter, HashRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Preloader from "./components/Preloader/Preloader"; 
import "./assets/css/_base.scss";

const LazyThemeSwitcher = lazy(() => import("./components/ThemeSwitcher/ThemeSwitcher"));
/*const LazyLangSwitcher = lazy(() => import("./components/LangSwitcher/LangSwitcher"));
const LazyHeader = lazy(() => import('./partials/Header/Header'));
const LazyFooter = lazy(() => import('./partials/Footer/Footer'));
const LazyHomePage = lazy(() => import("./pages/Home/Home"));
const LazyOrderPage = lazy(() => import("./pages/Order/Order"));
const LazyFiberPage = lazy(() => import("./pages/Fiber/Fiber"));
const LazyTechPage = lazy(() => import("./pages/Tech/Tech"));
const LazyPortfolioPage = lazy(() => import("./pages/Portfolio/Portfolio"));*/


const App:React.FC = () => {

	return (
		<>
			<Suspense fallback={<Preloader />}><LazyThemeSwitcher /></Suspense>

		</>
  );
} 



    
export default App
/*
			<Suspense fallback={<Preloader />}><LazyLangSwitcher /></Suspense>
			<Suspense fallback={<Preloader />}><LazyHeader /></Suspense>
			<Routes>
				<Route index element={<Suspense fallback={<Preloader />}><LazyHomePage /></Suspense>} />
				<Route path="/order" element={<Suspense fallback={<Preloader />}><LazyOrderPage /></Suspense>} />
				<Route path="/portfolio" element={<Suspense fallback={<Preloader />}><LazyPortfolioPage /></Suspense>} />
				<Route path="/fiber" element={<Suspense fallback={<Preloader />}><LazyFiberPage /></Suspense>} />
				<Route path="/tech" element={<Suspense fallback={<Preloader />}><LazyTechPage /></Suspense>} />
			</Routes>
			<LazyFooter />
*/


/*
			<Route path="/admin/portfolios_edit" element={<Suspense fallback={<Preloader />}><LazyPortfoliosEditPage /></Suspense>} />
*/