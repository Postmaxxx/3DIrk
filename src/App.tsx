import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import Preloader from "./components/Preloader/Preloader"; 
import "./assets/css/_base.scss";

const LazyThemeSwitcher = lazy(() => import("./components/ThemeSwitcher/ThemeSwitcher"));
const LazyLangSwitcher = lazy(() => import("./components/LangSwitcher/LangSwitcher"));
const LazyHeader = lazy(() => import('./partials/Header/Header'));
const LazyHomePage = lazy(() => import("./pages/Home/Home"));
const LazyOrderPage = lazy(() => import("./pages/Order/Order"));
const LazyPortfolioPage = lazy(() => import("./pages/Portfolio/Portfolio"));

const LazyPortfoliosEditPage= lazy(() => import("./pages/Admin/Portfolios/PortfoliosEdit"));



const App= () => {
  return (
    <BrowserRouter>
		<LazyThemeSwitcher />
		<LazyLangSwitcher />
		<LazyHeader />
		<Routes>
			<Route index element={<Suspense fallback={<Preloader />}><LazyHomePage /></Suspense>} />
			<Route path="/order" element={<Suspense fallback={<Preloader />}><LazyOrderPage /></Suspense>} />
			<Route path="/portfolio" element={<Suspense fallback={<Preloader />}><LazyPortfolioPage /></Suspense>} />
			<Route path="/admin/portfolios_edit" element={<Suspense fallback={<Preloader />}><LazyPortfoliosEditPage /></Suspense>} />
		</Routes>
    </BrowserRouter>
  );
} 



export default App