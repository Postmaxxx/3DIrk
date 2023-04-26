import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Preloader from "./components/Preloader/Preloader"; 
import "./assets/css/_base.scss";
import * as actions from "./redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IState, TLang } from "./interfaces";


const LazyThemeSwitcher = lazy(() => import("./components/ThemeSwitcher/ThemeSwitcher"));
const LazyLangSwitcher = lazy(() => import("./components/LangSwitcher/LangSwitcher"));
const LazyHeader = lazy(() => import('./partials/Header/Header'));
const LazyFooter = lazy(() => import('./partials/Footer/Footer'));
const LazyHomePage = lazy(() => import("./pages/Home/Home"));
const LazyOrderPage = lazy(() => import("./pages/Order/Order"));
const LazyFiberPage = lazy(() => import("./pages/Fiber/Fiber"));
const LazyTechPage = lazy(() => import("./pages/Tech/Tech"));
const LazyPortfolioPage = lazy(() => import("./pages/Portfolio/Portfolio"));

const LazyPortfoliosEditPage= lazy(() => import("./pages/Admin/Portfolios/PortfoliosEdit"));


interface IProps {
    lang: TLang
    setState: typeof actions
}


const App:React.FC<IProps> = (props) => {

  return (
    <BrowserRouter>
		<LazyThemeSwitcher />
		<LazyLangSwitcher />
		<LazyHeader />
		<Routes>
			<Route index element={<Suspense fallback={<Preloader />}><LazyHomePage /></Suspense>} />
			<Route path="/order" element={<Suspense fallback={<Preloader />}><LazyOrderPage /></Suspense>} />
			<Route path="/portfolio" element={<Suspense fallback={<Preloader />}><LazyPortfolioPage /></Suspense>} />
			<Route path="/fiber" element={<Suspense fallback={<Preloader />}><LazyFiberPage /></Suspense>} />
			<Route path="/tech" element={<Suspense fallback={<Preloader />}><LazyTechPage /></Suspense>} />
			<Route path="/admin/portfolios_edit" element={<Suspense fallback={<Preloader />}><LazyPortfoliosEditPage /></Suspense>} />
		</Routes>
		<LazyFooter />
    </BrowserRouter>
  );
} 


const mapStateToProps = (state: IState) => ({
    lang: state.lang,
  })
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
    
export default connect(mapStateToProps, mapDispatchToProps)(App)