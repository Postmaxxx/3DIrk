import { Routes, Route, HashRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Preloader from "./components/Preloaders/Preloader"; 
import "./assets/css/_base.scss";
import { IDataLoading, IFullState, TLang } from "./interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { loadFibers } from "./redux/actions/fibers"
import { loadColors } from "./redux/actions/colors"
import { loadCart }  from "./redux/actions/cart"
import P404 from "./pages/P404/P404";



const LazyThemeSwitcher = lazy(() => import("./components/ThemeSwitcher/ThemeSwitcher"));
const LazyLangSwitcher = lazy(() => import("./components/LangSwitcher/LangSwitcher"));
const LazyHomer = lazy(() => import("./components/Homer/Homer"));
const LazyHeader = lazy(() => import('./partials/Header/Header'));
const LazyFooter = lazy(() => import('./partials/Footer/Footer'));
const LazyHomePage = lazy(() => import("./pages/Home/Home"));
const LazyFibersPage = lazy(() => import("./pages/Fibers/Fibers"));
const LazyFiberPage = lazy(() => import("./pages/Fiber/Fiber"));
const LazyOrderPage = lazy(() => import("./pages/Order/Order"));
const LazyCatalogPage = lazy(() => import("./pages/Catalog/Catalog"));
const LazyProduct = lazy(() => import("./pages/Product/Product"));
const LazyNewsDetails = lazy(() => import("./pages/NewsDetails/NewsDetails"));
const LazyFibersCompare= lazy(() => import("./pages/FibersCompare/FibersCompare"));
const LazyOffliner= lazy(() => import("./components/Offliner/Offliner"));


const actionsCartList = { loadCart }
const actionsListColors = { loadColors }
const actionsListFibers = { loadFibers }


interface IPropsState {
    lang: TLang
	cartLoad: IDataLoading
	colorsLoad: IDataLoading
	fibersLoad: IDataLoading
}

interface IPropsActions {
    setState: {
        cart: typeof actionsCartList,
        colors: typeof actionsListColors,
        fiber: typeof actionsListFibers,
    }
}

interface IProps extends IPropsState, IPropsActions {}




const App:React.FC<IProps> = ({lang, cartLoad, colorsLoad, setState, fibersLoad}):JSX.Element => {
	

	cartLoad.status === 'idle' && setState.cart.loadCart()
	colorsLoad.status === 'idle' && setState.colors.loadColors()
	fibersLoad.status === 'idle' && setState.fiber.loadFibers()

	
	return (
		<HashRouter>
			<Suspense fallback={<Preloader />}><LazyThemeSwitcher /></Suspense>
			<Suspense fallback={<Preloader />}><LazyLangSwitcher /></Suspense>
			<Suspense fallback={<Preloader />}><LazyHeader /></Suspense>
			<Suspense fallback={<Preloader />}><LazyHomer /></Suspense>
			<Suspense fallback={<Preloader />}><LazyOffliner lang={lang}/></Suspense>
			
			<Routes>
				<Route index path="/" element={<Suspense fallback={<Preloader />}><LazyHomePage /></Suspense>} />
				
				<Route path="/fibers">
					<Route index element={<Suspense fallback={<Preloader />}><LazyFibersPage /></Suspense>} />
					<Route path="compare" element={<Suspense fallback={<Preloader />}><LazyFibersCompare /></Suspense>} />
					<Route path=":fiberId" element={<Suspense fallback={<Preloader />}><LazyFiberPage /></Suspense>} />
				</Route>
				
				<Route path="/order" element={<Suspense fallback={<Preloader />}><LazyOrderPage /></Suspense>} />
				<Route path="/catalog">
					<Route index element={<Suspense fallback={<Preloader />}><LazyCatalogPage /></Suspense>} />
					<Route path=":productId" element={<Suspense fallback={<Preloader />}><LazyProduct /></Suspense>} />
				</Route>
				<Route path="news/:newsId" element={<Suspense fallback={<Preloader />}><LazyNewsDetails /></Suspense>} />
				<Route path="/*" element={<Suspense fallback={<Preloader />}><P404 lang={lang}/></Suspense>} />
			</Routes>

			<LazyFooter />
		</HashRouter>

  );
} 



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	cartLoad: state.cart.dataLoading,
	colorsLoad: state.colors.dataLoading,
	fibersLoad: state.fibers.dataLoading,
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		cart: bindActionCreators(actionsCartList, dispatch),
        colors: bindActionCreators(actionsListColors, dispatch),
        fiber: bindActionCreators(actionsListFibers, dispatch),
	}
})
  
  
    
export default connect(mapStateToProps, mapDispatchToProps)(App)

