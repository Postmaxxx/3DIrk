import { useEffect } from "react";
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
//const LazyUserBlock= lazy(() => import("./components/UserBlock/UserBlock"));
const LazyNewsCreator = lazy(() => import("./pages/Admin/NewsCreator/NewsCreator"));
const LazyColorCreator = lazy(() => import("./pages/Admin/ColorCreator/ColorCreator"));
const LazyFiberCreator = lazy(() => import("./pages/Admin/FiberCreator/FiberCreator"));
const LazyContactUs = lazy(() => import("./pages/ContactUs/ContactUs"));



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




const App:React.FC<IProps> = ({lang, setState}):JSX.Element => {
	

	useEffect(() => {
		setState.colors.loadColors()
		setState.fibers.loadFibers()
		setState.user.loginWithToken()
		//cart!!!
	}, [])


	return (
		<HashRouter>
			<Suspense fallback={<Preloader />}><LazyThemeSwitcher /></Suspense>
			<Suspense fallback={<Preloader />}><LazyLangSwitcher /></Suspense>
			<Suspense fallback={<Preloader />}><LazyHeader /></Suspense>
			<Suspense fallback={<Preloader />}><LazyHomer /></Suspense>
			<Suspense fallback={<Preloader />}><LazyOffliner lang={lang}/></Suspense>
			{/*<Suspense fallback={<Preloader />}><LazyUserBlock /></Suspense>*/}

			
			<Routes>
				<Route index path="/" element={<Suspense fallback={<Preloader />}><LazyHomePage /></Suspense>} />
				
				<Route path="/fibers">
					<Route index element={<Suspense fallback={<Preloader />}><LazyFibersPage /></Suspense>} />
					<Route path="compare" element={<Suspense fallback={<Preloader />}><LazyFibersCompare /></Suspense>} />
					<Route path=":fiberId" element={<Suspense fallback={<Preloader />}><LazyFiberPage /></Suspense>} />
				</Route>
				
				<Route path="/order" element={<Suspense fallback={<Preloader />}><LazyOrderPage /></Suspense>} />
				<Route path="/contact_us" element={<Suspense fallback={<Preloader />}><LazyContactUs /></Suspense>} />

				<Route path="/catalog">
					<Route index element={<Suspense fallback={<Preloader />}><LazyCatalogPage /></Suspense>} />
					<Route path=":productId" element={<Suspense fallback={<Preloader />}><LazyProduct /></Suspense>} />
				</Route>

				<Route path="news/:newsId" element={<Suspense fallback={<Preloader />}><LazyNewsDetails /></Suspense>} />
				<Route path="/*" element={<Suspense fallback={<Preloader />}><P404 lang={lang}/></Suspense>} />


				<Route path="/admin">
					<Route path="news-create" element={<Suspense fallback={<Preloader />}><LazyNewsCreator /></Suspense>} />
					<Route path="color-create" element={<Suspense fallback={<Preloader />}><LazyColorCreator /></Suspense>} />
					<Route path="fiber-create" element={<Suspense fallback={<Preloader />}><LazyFiberCreator /></Suspense>} />
				</Route>
			</Routes>

			<LazyFooter />
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

