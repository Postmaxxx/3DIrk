import { useEffect, memo } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Preloader from "./components/Preloaders/Preloader"; 
import "./assets/css/_base.scss";
import { IFullState, TId, TLang } from "./interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import P404 from "./pages/P404/P404";
import { allActions } from "./redux/actions/all";
import Footer from "./partials/Footer/Footer";
import Header from "./partials/Header/Header";
import Homer from "./components/Homer/Homer";
import LangSwitcher from "./components/LangSwitcher/LangSwitcher";
import Offliner from "./components/Offliner/Offliner";

const LazyThemeSwitcher = lazy(() => import("./components/ThemeSwitcher/ThemeSwitcher"));
const LazyLangSwitcher = lazy(() => import("./components/LangSwitcher/LangSwitcher"));
const LazyHomer = lazy(() => import("./components/Homer/Homer"));
const LazyHeader = lazy(() => import('./partials/Header/Header'));
const LazyFooter = lazy(() => import('./partials/Footer/Footer'));
const LazyHomePage = lazy(() => import("./pages/Home/Home"));
const LazyFibersPage = lazy(() => import("./pages/Fibers/Fibers"));
const LazyFiberPage = lazy(() => import("./pages/Fiber/Fiber"));
const LazyOrderPage = lazy(() => import("./pages/Order/Order"));
const LazyOrdersPage = lazy(() => import("./pages/Orders/Orders"));
const LazyCatalogPage = lazy(() => import("./pages/Catalog/Catalog"));
const LazyProduct = lazy(() => import("./pages/Product/Product"));
const LazyNewsDetails = lazy(() => import("./pages/NewsDetails/NewsDetails"));
const LazyFibersCompare= lazy(() => import("./pages/FibersCompare/FibersCompare"));
//const LazyOffliner= lazy(() => import("./components/Offliner/Offliner"));
const LazyNewsCreator = lazy(() => import("./pages/Admin/NewsCreator/NewsCreator"));
const LazyColorCreator = lazy(() => import("./pages/Admin/ColorCreator/ColorCreator"));
const LazyFiberCreator = lazy(() => import("./pages/Admin/FiberCreator/FiberCreator"));
const LazyContactUs = lazy(() => import("./pages/ContactUs/ContactUs"));
const LazyCatalogCahnger = lazy(() => import("./pages/Admin/CatalogChanger/CatalogChanger"));
const LazyProductCreator = lazy(() => import("./pages/Admin/ProductCreator/ProductCreator"));
const LazySpliderChanger = lazy(() => import("./pages/Admin/SpliderChanger/SpliderChanger"));


interface IPropsState {
    lang: TLang
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        user: typeof allActions.user
        colors: typeof allActions.colors
		order: typeof allActions.order
    }
}

interface IProps extends IPropsState, IPropsActions {}

const MemoFooter = memo(Footer)

const App:React.FC<IProps> = ({lang, setState}):JSX.Element => {
	
	useEffect(() => {
		setState.user.loginWithToken()
		//setState.colors.loadColors()
		setState.fibers.loadFibers()
		//cart!!!	
	}, [])


	return (
		<HashRouter>
			<LangSwitcher />
			<Homer />
			<Offliner lang={lang}/>
			<Suspense fallback={<Preloader />}><LazyThemeSwitcher /></Suspense>
			<Suspense fallback={<Preloader />}><LazyHeader /></Suspense>

			
			<Routes>
				<Route index path="/" element={<Suspense fallback={<Preloader />}><LazyHomePage /></Suspense>} />
				
				<Route path="/fibers">
					<Route index element={<Suspense fallback={<Preloader />}><LazyFibersPage /></Suspense>} />
					<Route path="compare" element={<Suspense fallback={<Preloader />}><LazyFibersCompare /></Suspense>} />
					<Route path=":fiberId" element={<Suspense fallback={<Preloader />}><LazyFiberPage /></Suspense>} />
				</Route>
				
				<Route path="/order" element={<Suspense fallback={<Preloader />}><LazyOrderPage /></Suspense>} />
				<Route path="/orders" element={<Suspense fallback={<Preloader />}><LazyOrdersPage /></Suspense>} />
				<Route path="/contact_us" element={<Suspense fallback={<Preloader />}><LazyContactUs /></Suspense>} />

				<Route path="/catalog">
					<Route index element={<Suspense fallback={<Preloader />}><LazyCatalogPage /></Suspense>} />
					<Route path=":productId" element={<Suspense fallback={<Preloader />}><LazyProduct /></Suspense>} />
				</Route>

				<Route path="news/:newsId" element={<Suspense fallback={<Preloader />}><LazyNewsDetails /></Suspense>} />

				<Route path="/admin">
					<Route path="news-create" element={<Suspense fallback={<Preloader />}><LazyNewsCreator /></Suspense>} />
					<Route path="news-create/:newsId" element={<Suspense fallback={<Preloader />}><LazyNewsCreator /></Suspense>} />
					<Route path="fiber-create" element={<Suspense fallback={<Preloader />}><LazyFiberCreator /></Suspense>} />
					<Route path="fiber-create/:fiberId" element={<Suspense fallback={<Preloader />}><LazyFiberCreator /></Suspense>} />
					<Route path="color-create" element={<Suspense fallback={<Preloader />}><LazyColorCreator /></Suspense>} />
					<Route path="color-create/:colorId" element={<Suspense fallback={<Preloader />}><LazyColorCreator /></Suspense>} />
					<Route path="catalog-change" element={<Suspense fallback={<Preloader />}><LazyCatalogCahnger /></Suspense>} />

					<Route path="product-create" element={<Suspense fallback={<Preloader />}><LazyProductCreator /></Suspense>} />
					<Route path="product-create/:productId" element={<Suspense fallback={<Preloader />}><LazyProductCreator /></Suspense>} />

					<Route path="splider-change" element={<Suspense fallback={<Preloader />}><LazySpliderChanger /></Suspense>} />
				</Route>


				<Route path="/*" element={<Suspense fallback={<Preloader />}><P404 lang={lang}/></Suspense>} />
			</Routes>

			<MemoFooter lang={lang}/>
		</HashRouter>

  );
} 


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
		order: bindActionCreators(allActions.order, dispatch),
	}
})
  
  
    
export default connect(mapStateToProps, mapDispatchToProps)(App)

