import { useEffect, memo, useRef } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./assets/css/_base.scss";
import { IFetch, IFullState, TLang } from "./interfaces";
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
import Unauthorized from "./components/Unauthorized/Unauthorized";
import { checkAndLoad } from "./assets/js/processors";
import ThemeSwitcher from "./components/ThemeSwitcher/ThemeSwitcher";
import PreloaderPage from "./components/Preloaders/PreloaderPage";
import ModalNew, { IModalFunctions } from "./components/Modal/ModalNew";


const LazyHomePage = lazy(() => import("./pages/Home/Home"));
const LazyFibersPage = lazy(() => import("./pages/Fibers/Fibers"));
const LazyFiberPage = lazy(() => import("./pages/Fiber/Fiber"));
const LazyOrderPage = lazy(() => import("./pages/Order/Order"));
const LazyOrdersPage = lazy(() => import("./pages/Orders/Orders"));
const LazyCatalogPage = lazy(() => import("./pages/Catalog/Catalog"));
const LazyProduct = lazy(() => import("./pages/Product/Product"));
const LazyNewsDetails = lazy(() => import("./pages/NewsDetails/NewsDetails"));
const LazyFibersCompare= lazy(() => import("./pages/FibersCompare/FibersCompare"));
const LazyNewsCreator = lazy(() => import("./pages/Admin/NewsCreator/NewsCreator"));
const LazyColorCreator = lazy(() => import("./pages/Admin/ColorCreator/ColorCreator"));
const LazyFiberCreator = lazy(() => import("./pages/Admin/FiberCreator/FiberCreator"));
const LazyContactUs = lazy(() => import("./pages/ContactUs/ContactUs"));
const LazyCatalogCahnger = lazy(() => import("./pages/Admin/CatalogCreator/CatalogCreator"));
const LazyProductCreator = lazy(() => import("./pages/Admin/ProductCreator/ProductCreator"));
const LazySpliderChanger = lazy(() => import("./pages/Admin/ContentCreator/contentCreator"));



interface IPropsState {
    lang: TLang
	isAdmin: boolean
	isAuth: boolean
	fibersLoad: IFetch
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        user: typeof allActions.user
		base: typeof allActions.base
    }
}

interface IProps extends IPropsState, IPropsActions {}

const MemoFooter = memo(Footer)

const App:React.FC<IProps> = ({lang, isAdmin, isAuth, fibersLoad, setState}):JSX.Element => {
	const modalRef = useRef<IModalFunctions>(null)

	useEffect(() => {
		setState.user.loginWithToken()
		setState.base.setModal(modalRef)
	}, [])


	useEffect(() => {
		checkAndLoad({
			fetchData: fibersLoad,
			loadFunc: setState.fibers.loadFibers,
            force: true
		})
	}, [isAdmin])


	return (
		<HashRouter>
			<LangSwitcher />
			<Homer />
			<Offliner lang={lang}/>
			<ThemeSwitcher />
			<Header />
		
			<Routes>
				<Route index path="/" element={<Suspense fallback={<PreloaderPage />}><LazyHomePage /></Suspense>} />
				
				<Route path="/fibers">
					<Route index element={<Suspense fallback={<PreloaderPage />}><LazyFibersPage /></Suspense>} />
					<Route path="compare" element={<Suspense fallback={<PreloaderPage />}><LazyFibersCompare /></Suspense>} />
					<Route path=":fiberId" element={<Suspense fallback={<PreloaderPage />}><LazyFiberPage /></Suspense>} />
				</Route>
				
				<Route path="/order" element={<Suspense fallback={<PreloaderPage />}>{isAuth ? <LazyOrderPage /> : <Unauthorized lang={lang} />}</Suspense>} />
				<Route path="/orders" element={<Suspense fallback={<PreloaderPage />}>{isAuth ? <LazyOrdersPage /> : <Unauthorized lang={lang} />}</Suspense>} />
				<Route path="/contact_us" element={<Suspense fallback={<PreloaderPage />}><LazyContactUs /></Suspense>} />

				<Route path="/catalog">
					<Route index element={<Suspense fallback={<PreloaderPage />}><LazyCatalogPage /></Suspense>} />
					<Route path=":productId" element={<Suspense fallback={<PreloaderPage />}><LazyProduct /></Suspense>} />
				</Route>

				<Route path="news/:newsId" element={<Suspense fallback={<PreloaderPage />}><LazyNewsDetails /></Suspense>} />

				<Route path="/admin">
					<Route path="news-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyNewsCreator /> : <Unauthorized lang={lang} />}</Suspense>} />
					<Route path="news-create/:newsId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyNewsCreator /> : <Unauthorized lang={lang} />}</Suspense>} />
					<Route path="fiber-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyFiberCreator /> : <Unauthorized lang={lang} />}</Suspense>} />
					<Route path="fiber-create/:fiberId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyFiberCreator /> : <Unauthorized lang={lang} />}</Suspense>} />
					<Route path="color-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyColorCreator /> : <Unauthorized lang={lang} />}</Suspense>} />
					<Route path="color-create/:colorId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyColorCreator /> : <Unauthorized lang={lang} />}</Suspense>} />
					<Route path="catalog-change" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyCatalogCahnger /> : <Unauthorized lang={lang} />}</Suspense>} />
					<Route path="product-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyProductCreator /> : <Unauthorized lang={lang} />}</Suspense>} />
					<Route path="product-create/:productId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyProductCreator /> : <Unauthorized lang={lang} />}</Suspense>} />
					<Route path="splider-change" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazySpliderChanger /> : <Unauthorized lang={lang} />}</Suspense>} />
				</Route>

				<Route path="/*" element={<Suspense fallback={<PreloaderPage />}><P404 lang={lang}/></Suspense>} />
			</Routes>

			<MemoFooter lang={lang}/>
			
			<ModalNew ref={modalRef}></ModalNew>
		</HashRouter>

  );
} 


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	isAdmin: state.user.isAdmin,
	isAuth: state.user.auth.status === 'success',
	fibersLoad: state.fibers.load
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
		base: bindActionCreators(allActions.base, dispatch),
	}
})
  
      
export default connect(mapStateToProps, mapDispatchToProps)(App)

