import { useEffect, memo, useRef, useState } from "react";
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
import ThemeSwitcher from "./components/ThemeSwitcher/ThemeSwitcher";
import PreloaderPage from "./components/Preloaders/PreloaderPage";
import ModalNew, { IModalFunctions } from "./components/Modal/ModalNew";
import useScreenMeter from "./hooks/screenMeter";
import Preloader from "./components/Preloaders/Preloader";


const LazyHomePage = lazy(() => import("./pages/Home/Home"));
const LazyFibersPage = lazy(() => import("./pages/Fibers/Fibers"));
const LazyFiberPage = lazy(() => import("./pages/Fiber/Fiber"));
const LazyOrderPage = lazy(() => import("./pages/Order/Order"));
const LazyCustomOrderPage = lazy(() => import("./pages/CustomOrder/CustomOrder"));
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

const ModalMemo = memo(ModalNew)

interface IPropsState {
    lang: TLang
	isAdmin: boolean
	isAuth: boolean
	fibersLoad: IFetch 
	contentLoad: IFetch
	isLogining: boolean
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        user: typeof allActions.user
		base: typeof allActions.base
		content: typeof allActions.content
    }
}

interface IProps extends IPropsState, IPropsActions {}

const MemoFooter = memo(Footer)

const App:React.FC<IProps> = ({lang, isAdmin, isAuth, contentLoad, isLogining, setState}):JSX.Element => {
	const modalRef = useRef<IModalFunctions>(null)

	useEffect(() => {
		setState.user.loginWithToken()
		setState.base.setModal(modalRef)	
		if (contentLoad.status !== 'success' && contentLoad.status  !== 'fetching') {
			setState.fibers.loadFibers()
		}
	}, [])



    useEffect(() => {
		setState.fibers.loadFibers()
	},[isAdmin])


	const screenWidth = useScreenMeter() 

	return (
		<HashRouter>
			{!screenWidth.sm && <LangSwitcher />} {/*tested*/}
			{!screenWidth.sm && <ThemeSwitcher />} {/*tested*/}
			<Homer /> {/*tested*/}
			<Offliner lang={lang}/> {/*tested*/}
			<Header />
			{/*
			<Routes>
				<Route index path="/" element={<Suspense fallback={<PreloaderPage />}><LazyHomePage /></Suspense>} />
				
				<Route path="/fibers">
					<Route index element={<Suspense fallback={<PreloaderPage />}><LazyFibersPage /></Suspense>} />
					<Route path="compare" element={<Suspense fallback={<PreloaderPage />}><LazyFibersCompare /></Suspense>} />
					<Route path=":fiberId" element={<Suspense fallback={<PreloaderPage />}><LazyFiberPage /></Suspense>} />
				</Route>
				
				<Route path="/order" element={<Suspense fallback={<PreloaderPage />}>{isAuth ? <LazyOrderPage /> : <Unauthorized lang={lang} />}</Suspense>} />
				<Route path="/custom_order" element={<Suspense fallback={<PreloaderPage />}>{isAuth ? <LazyCustomOrderPage /> : <Unauthorized lang={lang} />}</Suspense>} />
				<Route path="/orders" element={<Suspense fallback={<PreloaderPage />}>{isAuth ? <LazyOrdersPage /> : <Unauthorized lang={lang} />}</Suspense>} />
				<Route path="/contact_us" element={<Suspense fallback={<PreloaderPage />}><LazyContactUs /></Suspense>} />

				<Route path="/catalog">
					<Route index element={<Suspense fallback={<PreloaderPage />}><LazyCatalogPage /></Suspense>} />
					<Route path=":productId" element={<Suspense fallback={<PreloaderPage />}><LazyProduct /></Suspense>} />
				</Route>

				<Route path="news/:newsId" element={<Suspense fallback={<PreloaderPage />}><LazyNewsDetails /></Suspense>} />

				<Route path="/admin">
					<Route path="news-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyNewsCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="news-create/:newsId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyNewsCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="fiber-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyFiberCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="fiber-create/:fiberId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyFiberCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="color-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyColorCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="color-create/:colorId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyColorCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="catalog-change" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyCatalogCahnger /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="product-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyProductCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="product-create/:productId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyProductCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="splider-change" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazySpliderChanger /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
				</Route>

				<Route path="/*" element={<Suspense fallback={<PreloaderPage />}><P404 lang={lang}/></Suspense>} />
			</Routes>*/}
			<MemoFooter lang={lang}/> {/*tested*/}
			<ModalMemo ref={modalRef}></ModalMemo> {/*testing... */}
		</HashRouter>

  );
} 


const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	isAdmin: state.user.isAdmin,
	isAuth: state.user.auth.status === 'success',
	fibersLoad: state.fibers.load,
	contentLoad: state.content.load,
	isLogining: state.user.auth.status === 'fetching'
	
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
		base: bindActionCreators(allActions.base, dispatch),
		content: bindActionCreators(allActions.content, dispatch),
	}
})
  
      
export default connect(mapStateToProps, mapDispatchToProps)(App)

/*
			{!screenWidth.sm && <LangSwitcher />}
			{!screenWidth.sm && <ThemeSwitcher />}
			<Homer />
			<Offliner lang={lang}/>
			<Header />
		
			<Routes>
				<Route index path="/" element={<Suspense fallback={<PreloaderPage />}><LazyHomePage /></Suspense>} />
				
				<Route path="/fibers">
					<Route index element={<Suspense fallback={<PreloaderPage />}><LazyFibersPage /></Suspense>} />
					<Route path="compare" element={<Suspense fallback={<PreloaderPage />}><LazyFibersCompare /></Suspense>} />
					<Route path=":fiberId" element={<Suspense fallback={<PreloaderPage />}><LazyFiberPage /></Suspense>} />
				</Route>
				
				<Route path="/order" element={<Suspense fallback={<PreloaderPage />}>{isAuth ? <LazyOrderPage /> : <Unauthorized lang={lang} />}</Suspense>} />
				<Route path="/custom_order" element={<Suspense fallback={<PreloaderPage />}>{isAuth ? <LazyCustomOrderPage /> : <Unauthorized lang={lang} />}</Suspense>} />
				<Route path="/orders" element={<Suspense fallback={<PreloaderPage />}>{isAuth ? <LazyOrdersPage /> : <Unauthorized lang={lang} />}</Suspense>} />
				<Route path="/contact_us" element={<Suspense fallback={<PreloaderPage />}><LazyContactUs /></Suspense>} />

				<Route path="/catalog">
					<Route index element={<Suspense fallback={<PreloaderPage />}><LazyCatalogPage /></Suspense>} />
					<Route path=":productId" element={<Suspense fallback={<PreloaderPage />}><LazyProduct /></Suspense>} />
				</Route>

				<Route path="news/:newsId" element={<Suspense fallback={<PreloaderPage />}><LazyNewsDetails /></Suspense>} />

				<Route path="/admin">
					<Route path="news-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyNewsCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="news-create/:newsId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyNewsCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="fiber-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyFiberCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="fiber-create/:fiberId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyFiberCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="color-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyColorCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="color-create/:colorId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyColorCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="catalog-change" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyCatalogCahnger /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="product-create" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyProductCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="product-create/:productId" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazyProductCreator /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
					<Route path="splider-change" element={<Suspense fallback={<PreloaderPage />}>{isAdmin ? <LazySpliderChanger /> : !isLogining ? <Unauthorized lang={lang} /> : <Preloader/>}</Suspense>} />
				</Route>

				<Route path="/*" element={<Suspense fallback={<PreloaderPage />}><P404 lang={lang}/></Suspense>} />
			</Routes>

			<MemoFooter lang={lang}/>
			
			<ModalMemo ref={modalRef}></ModalMemo>
			*/