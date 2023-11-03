import { useState, useRef, useMemo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { IFiber, IFullState, TId, TLang } from "../../interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.webp"
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import CartInformer from "../../components/CartInformer/CartInformerUpdater";
import Auth from "../../components/Auth/Auth";
import { allActions } from "../../redux/actions/all";
import initialUserState from "../../../src/redux/initialStates/user";
import { navList } from "../../../src/assets/js/consts";
import { IModalFunctions } from "../../../src/components/Modal/ModalNew";
import useScreenMeter from "../../../src/hooks/screenMeter";
import LangSwitcher from "../../../src/components/LangSwitcher/LangSwitcher";
import ThemeSwitcher from "../../../src/components/ThemeSwitcher/ThemeSwitcher";
import React from 'react'


interface IPropsState {
    lang: TLang
    fibersList: IFiber[]
    isAdmin: boolean
    isAuth: boolean
    modal: IModalFunctions | null
}


interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        user: typeof allActions.user
        base: typeof allActions.base
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Nav:React.FC<IProps> = ({lang, setState, fibersList, isAdmin, modal, isAuth}): JSX.Element => {
    const _blur = useRef<HTMLDivElement>(null)
    const [expandedNavItems, setExpandedNavItems] = useState<TId | null>(null)
    const [desktopOpened, setDesktopOpened] = useState<boolean>(true)
    const [mobOpened, setMobOpened] = useState<boolean>(false)

    const navToggle = () => {
        setDesktopOpened(prev => !prev)
    }

    const navToggleMobile = () => {
        setMobOpened(prev => !prev)
    }

    const screenWidth = useScreenMeter()

    const onNavWithSubClicked = (navId: string) => {  
        setExpandedNavItems(prev => {
            return prev === navId ? null : navId
        })
    }


    const closeModal = () => {
        modal?.closeCurrent()
	}


    const onClickNotLink = (action: "login" | "logout") => {
        if (action === 'login') {
            modal?.openModal({
				name: 'auth',
                onClose: closeModal,
                closeOnEsc:true,
				children: <Auth onCancel={closeModal}/>
			})
        }
        if (action === 'logout') {
            setState.user.setUser({...initialUserState})
            localStorage.removeItem('user')
            window.location.reload()
        }
    }


    const desktopNav = useMemo(() => {
        return <nav className={desktopOpened ? "nav_desktop opened" : "nav_desktop"} data-testid='nav_desktop'>
        <div className="nav__container">
            <ul className="nav__list" data-testid='navListDesktop'>
                <li className="nav-item">
                    <NavLink className={({ isActive }) => `nav-text_level_1 ${isActive ? "selected" : ""}`} to={navList.home.to}>
                        {navList.home[lang]}
                    </NavLink>
                </li>

                <li className="nav-item extandable">
                    <NavLink className={({ isActive }) => `nav-text_level_1 ${isActive ? "selected" : ""}`} to={navList.fibers.to} tabIndex={-1}>
                        {navList.fibers[lang]}
                    </NavLink>
                    <ul className="submenu">
                        <li className="submenu__item">
                            <ul className="submenu__content">
                                <li className="submenu__item__point">
                                    <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.fibers.about.to} end>
                                        {navList.fibers.about[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item__point">
                                    <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.fibers.compare.to} end>
                                        {navList.fibers.compare[lang]}
                                    </NavLink>
                                </li>
                                {fibersList.filter(fiber => fiber.active)?.map(fiber => {
                                    return (
                                        <li key={fiber._id} className="submenu__item__point">
                                           <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={`fibers/${fiber._id}`}>
                                               {fiber.short.name[lang]}
                                           </NavLink>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <NavLink className={({ isActive }) => `nav-text_level_1 ${isActive ? "selected" : ""}`} to={navList.catalog.to}>
                        {navList.catalog[lang]}
                    </NavLink>
                </li>
                {isAuth ? 
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-text_level_1 ${isActive ? "selected" : ""}`} to={navList.account.cart.to} data-testid='navCart'>
                            {navList.account.cart[lang]}
                        </NavLink>
                        <CartInformer />        
                    </li>
                :
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-text_level_1 ${isActive ? "selected" : ""}`} to={navList.contacts.to}>
                            {navList.contacts[lang]}
                        </NavLink>
                    </li>
                }
                
                {isAuth ? 
                    <li className="nav-item extandable">
                        <span className="nav-item__text nav-item__level_1">{navList.account[lang]}</span>
                        <ul className="submenu">
                            <li className="submenu__item">
                                <ul className="submenu__content">
                                    <li className="submenu__item__point">
                                        <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.account.order.to}>
                                            {navList.account.order[lang]}
                                        </NavLink>
                                    </li>
                                    <li className="submenu__item__point">
                                        <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.account.orders.to}>
                                            {navList.account.orders[lang]}
                                        </NavLink>
                                    </li>
                                    <li className="submenu__item__point">
                                        <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.contacts.to}>
                                            {navList.contacts[lang]}
                                        </NavLink>
                                    </li>
                                    {isAdmin && 
                                        <>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.account.admin.news.to} >
                                                    {navList.account.admin.news[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.account.admin.color.to} >
                                                    {navList.account.admin.color[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.account.admin.fiber.to} >
                                                    {navList.account.admin.fiber[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.account.admin.catalog.to} >
                                                    {navList.account.admin.catalog[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.account.admin.product.to} >
                                                    {navList.account.admin.product[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} to={navList.account.admin.content.to} >
                                                    {navList.account.admin.content[lang]}
                                                </NavLink>
                                            </li>
                                        </>}
                                    <li className="submenu__item__point">
                                        <a role="button" tabIndex={0} onClick={() => onClickNotLink('logout')} onKeyDown={e => {e.code === 'Enter' && onClickNotLink('logout')}} data-testid='btn_logout_desktop'>{navList.account.logout[lang]}</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    :
                    <li className="nav-item" tabIndex={-1}>
                        <a 
                            tabIndex={0} 
                            role="button" 
                            className="nav-item__text nav-text_level_1" 
                            data-testid='btn_login_desktop' 
                            onClick={() => onClickNotLink('login')} 
                            onKeyDown={(e) => e.code === 'Enter' && onClickNotLink('login')}>
                                {navList.account.login[lang]}
                        </a>
                    </li>
                }
            </ul>
        </div>
        <div className="nav__switcher">
            <div className="text-hider"></div>
            <button 
                className="nav_desktop__hider"
                onClick={navToggle}
                data-testid='nav_desktop__hider'
                aria-label={lang === 'en' ? `${desktopOpened ? 'Hide' : 'Show'} navigation` : `${desktopOpened ? 'Скрыть' : 'Показать'} меню`}
            >
                <img src={navLogo} alt="Menu" width={52} height={52}/>
                <div className="nav__sign">
                    <span></span>
                </div>
            </button>
        </div>
    </nav>}, [isAdmin, isAuth, desktopOpened, lang, fibersList, modal])



                //------------------------------------------------------------------ MOBILE


    const mobileNav = useMemo(() => {
        return  <nav className={mobOpened ? "nav_mobile opened" : "nav_mobile"} data-testid='nav_mobile'>
        <div className="nav__switcher">
            <button 
                className="nav_mobile__hider"
                onClick={navToggleMobile}
                data-testid='nav_mobile__hider'
                aria-label={lang === 'en' ? `${desktopOpened ? 'Hide' : 'Show'} navigation` : `${desktopOpened ? 'Скрыть' : 'Показать'} меню`}
            >
                <img src={navLogo} alt="Menu" width={52} height={52}/>
                <div className="nav__sign">
                    <span></span>
                </div>
            </button>
        </div>
        <div className="blur" ref={_blur}></div>
        <div className="nav__container">
            <div className="switchers__container">
                {screenWidth.sm && <LangSwitcher />}
                {screenWidth.sm && <ThemeSwitcher />}
            </div>
            <ul className="nav__list" data-testid='navListMobile'>
                <li className="nav-item">
                    <NavLink 
                        className={({ isActive }) => `nav-text_level_1 ${isActive ? "selected" : ""}`} 
                        to={navList.home.to} 
                        onClick={navToggleMobile}>
                            {navList.home[lang]}
                    </NavLink>
                </li>

                <li className={`nav-item ${expandedNavItems === 'fibers' ? 'expanded' : ''}`} data-testid='navItemExpandable'>
                    <span 
                        className="nav-item__text nav-text_level_1" 
                        onClick={() => onNavWithSubClicked('fibers')}
                        tabIndex={0}
                        onKeyDown={e => {e.code === 'Enter' && onNavWithSubClicked('fibers')}}
                    >
                        {navList.fibers[lang]}
                    </span>
                    <div className="submenu__container">
                        <ul className="submenu">
                            <li className="submenu__item">
                                <NavLink 
                                    className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} 
                                    onClick={navToggleMobile}
                                    to={navList.fibers.about.to}
                                    tabIndex={expandedNavItems === 'fibers' ? 0 : -1}
                                    end
                                >
                                        {navList.fibers.about[lang]}
                                </NavLink>
                            </li>
                            <li className="submenu__item">
                                <NavLink 
                                    className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} 
                                    onClick={navToggleMobile}
                                    to={navList.fibers.compare.to}
                                    tabIndex={expandedNavItems === 'fibers' ? 0 : -1}
                                    end
                                >
                                        {navList.fibers.compare[lang]}
                                </NavLink>
                            </li>
                            {fibersList.filter(fiber => fiber.active)?.map((fiber) => {
                                return (
                                    <li key={fiber._id} className="submenu__item">
                                        <NavLink 
                                            className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} 
                                            onClick={navToggleMobile}
                                            to={`fibers/${fiber._id}`}
                                            tabIndex={expandedNavItems === 'fibers' ? 0 : -1}
                                        end>
                                                {fiber.short.name[lang]}
                                        </NavLink>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>              
                </li>

                <li className="nav-item">
                    <NavLink 
                        className={({ isActive }) => `nav-text_level_1 ${isActive ? "selected" : ""}`} 
                        to={navList.catalog.to} 
                        onClick={navToggleMobile}>
                            {navList.catalog[lang]}
                    </NavLink>
                </li>
                {isAuth ?
                    <li className="narrow nav-item">
                        <NavLink 
                            className={({ isActive }) => `nav-text_level_1 ${isActive ? "selected" : ""}`} 
                            to={navList.cart.to} 
                            onClick={navToggleMobile}>
                                {navList.cart[lang]}
                        </NavLink>
                        <CartInformer />        
                    </li>
                :
                    <li className="nav-item">
                        <NavLink className={({ isActive }) =>`nav-text_level_1 ${isActive ? "selected" : ""}`} to={navList.contacts.to} onClick={navToggleMobile}>
                            {navList.contacts[lang]}
                        </NavLink>
                    </li>
                }

                
                {isAuth ? 
                    <li className={`nav-item ${expandedNavItems === 'cabinet' ? 'expanded' : ''}`}>
                        <span 
                            className="nav-item__text nav-text_level_1" 
                            onClick={() => onNavWithSubClicked('cabinet')}
                            tabIndex={0}
                            onKeyDown={e => {e.code === 'Enter' && onNavWithSubClicked('cabinet')}}
                        >
                            {navList.account[lang]}
                        </span>
                        <div className="submenu__container">
                            <ul className="submenu noscroll">
                                <li className="submenu__item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`}  
                                        to={navList.account.order.to} 
                                        onClick={navToggleMobile}
                                        tabIndex={expandedNavItems === 'cabinet' ? 0 : -1}
                                    >
                                            {navList.account.order[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`}  
                                        to={navList.account.orders.to} 
                                        onClick={navToggleMobile}
                                        tabIndex={expandedNavItems === 'cabinet' ? 0 : -1}
                                    >
                                            {navList.account.orders[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} 
                                        to={navList.contacts.to} 
                                        onClick={navToggleMobile}
                                        tabIndex={expandedNavItems === 'cabinet' ? 0 : -1}
                                    >
                                            {navList.contacts[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`}  
                                        to={navList.account.admin.news.to} 
                                        onClick={navToggleMobile}
                                        tabIndex={expandedNavItems === 'cabinet' ? 0 : -1}
                                    >
                                            {navList.account.admin.news[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`}  
                                        to={navList.account.admin.color.to} 
                                        onClick={navToggleMobile}
                                        tabIndex={expandedNavItems === 'cabinet' ? 0 : -1}
                                    >
                                            {navList.account.admin.color[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`}  
                                        to={navList.account.admin.fiber.to} 
                                        onClick={navToggleMobile}
                                        tabIndex={expandedNavItems === 'cabinet' ? 0 : -1}
                                    >
                                            {navList.account.admin.fiber[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} 
                                        to={navList.account.admin.catalog.to} 
                                        onClick={navToggleMobile}
                                        tabIndex={expandedNavItems === 'cabinet' ? 0 : -1}
                                    >
                                            {navList.account.admin.catalog[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`} 
                                        to={navList.account.admin.product.to} 
                                        onClick={navToggleMobile}
                                        tabIndex={expandedNavItems === 'cabinet' ? 0 : -1}
                                    >
                                            {navList.account.admin.product[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink 
                                        className={({ isActive }) => `nav-text_level_2 ${isActive ? "selected" : ""}`}  
                                        to={navList.account.admin.content.to} 
                                        onClick={navToggleMobile}
                                        tabIndex={expandedNavItems === 'cabinet' ? 0 : -1}
                                    >
                                            {navList.account.admin.content[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <a role="button" className="button_link nav-text_level_1" onClick={() => {onClickNotLink('logout'); navToggleMobile()}} data-testid='btn_logout_mobile'>{navList.account.logout[lang]}</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                :
                    <li className="nav-item">
                        <a role="button" className="button_link nav-text_level_1" onClick={() => {onClickNotLink('login'); navToggleMobile()}} data-testid='btn_login_mobile'>{navList.account.login[lang]}</a>
                    </li>
                }
            </ul>
        </div>
        <div className="nav__container_right"></div>
    </nav>}, [isAdmin, isAuth, mobOpened, lang, fibersList, expandedNavItems, screenWidth.sm, modal])


    return (
        <>
            {!screenWidth.sm && desktopNav}
            {screenWidth.sm && mobileNav}
        </>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
	lang: state.base.lang,
    fibersList: state.fibers.fibersList,
    isAdmin: state.user.isAdmin,
    isAuth: state.user.auth.status === 'success',
    modal: state.base.modal.current
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		base: bindActionCreators(allActions.base, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
