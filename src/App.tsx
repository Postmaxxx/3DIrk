import { Routes, Route, BrowserRouter, HashRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Preloader from "./components/Preloaders/Preloader"; 
import "./assets/css/_base.scss";
import { IDataLoading, IFullState, IOrderState, TLang } from "./interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { loadFibers } from "src/redux/actions/fibers"
import { loadColors } from "src/redux/actions/colors"
import { loadCart }  from "src/redux/actions/cart"
import { useState, useEffect, useRef, KeyboardEventHandler } from 'react'

const LazyThemeSwitcher = lazy(() => import("./components/ThemeSwitcher/ThemeSwitcher"));
const LazyLangSwitcher = lazy(() => import("./components/LangSwitcher/LangSwitcher"));
const LazyHeader = lazy(() => import('./partials/Header/Header'));
const LazyFooter = lazy(() => import('./partials/Footer/Footer'));
const LazyHomePage = lazy(() => import("./pages/Home/Home"));
const LazyFibersPage = lazy(() => import("./pages/Fibers/Fibers"));
const LazyOrderPage = lazy(() => import("./pages/Order/Order"));
const LazyCatalogPage = lazy(() => import("./pages/Catalog/Catalog"));
const LazyProduct = lazy(() => import("./pages/Product/Product"));
const LazyNewsDetails = lazy(() => import("./pages/NewsDetails/NewsDetails"));


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
        fibers: typeof actionsListFibers,
    }
}

interface IProps extends IPropsState, IPropsActions {}




const App:React.FC<IProps> = ({lang, cartLoad, colorsLoad, fibersLoad, setState}):JSX.Element => {
	
	cartLoad.status === 'idle' && setState.cart.loadCart()
	colorsLoad.status === 'idle' && setState.colors.loadColors()
	fibersLoad.status === 'idle' && setState.fibers.loadFibers()
	
	
	return (
		<HashRouter>
			<Suspense fallback={<Preloader />}><LazyThemeSwitcher /></Suspense>
			<Suspense fallback={<Preloader />}><LazyLangSwitcher /></Suspense>
			<Suspense fallback={<Preloader />}><LazyHeader /></Suspense>
			
			<Routes>
				<Route index path="/" element={<Suspense fallback={<Preloader />}><LazyHomePage /></Suspense>} />
				
				<Route path="/fibers">
					<Route index element={<Suspense fallback={<Preloader />}><LazyFibersPage /></Suspense>} />
					<Route path=":fiberId" element={<Suspense fallback={<Preloader />}><LazyFibersPage /></Suspense>} />
				</Route>
				
				<Route path="/order" element={<Suspense fallback={<Preloader />}><LazyOrderPage /></Suspense>} />
				<Route path="/catalog">
					<Route index element={<Suspense fallback={<Preloader />}><LazyCatalogPage /></Suspense>} />
					<Route path=":productId" element={<Suspense fallback={<Preloader />}><LazyProduct /></Suspense>} />
				</Route>
				<Route path="news/:newsId" element={<Suspense fallback={<Preloader />}><LazyNewsDetails /></Suspense>} />
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
        fibers: bindActionCreators(actionsListFibers, dispatch),
	}
})
  
  
    
export default connect(mapStateToProps, mapDispatchToProps)(App)

