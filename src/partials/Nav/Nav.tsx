import { useState, useRef, useMemo, useCallback, useEffect } from "react";
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
import { lockFocusInside, prevent } from "../../assets/js/processors";


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
    const _navMobile = useRef<HTMLDivElement | null>(null)
    const focuser = useRef<ReturnType<typeof lockFocusInside>>()


    const navToggle = () => {
        setDesktopOpened(prev => !prev)
    }

    const navToggleMobile = (e: React.KeyboardEvent | React.MouseEvent) => {       
        setMobOpened(prev => !prev)
    }


    useEffect(() => {
        if (_navMobile.current && mobOpened) {           
            focuser.current?.destroy()
            focuser.current = lockFocusInside({_element: _navMobile.current, returnFocus: false})
        } 
        return () => {
            focuser.current?.destroy()
        }
    }, [mobOpened, lang])


    useEffect(() => {
        if (_navMobile.current && mobOpened) {           
            focuser.current?.rebuild()
        } 
    }, [expandedNavItems])


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


    const NavItem = ({level, to, end=false, tab=true, children, k}: {level: string, to: string, end?: boolean, tab?: boolean, children:React.ReactNode, k?: string}) => {
        return (
            <li className={level === '1' ? "nav-item" : 'submenu__item__point'} key={k}>
                <NavLink className={({ isActive }) => `nav-text_level_${level} ${isActive ? "selected" : ""}`} to={to} onClick={e => (e.target as HTMLElement).blur()} end={end} tabIndex={tab ? 0 : -1}>
                    {children}
                </NavLink>
            </li>
        )
    }





    const desktopNav = useMemo(() => {
        return <nav className={desktopOpened ? "nav_desktop opened" : "nav_desktop"} data-testid='nav_desktop'>
        <div className="nav__container">
            <ul className="nav__list" data-testid='navListDesktop'>
                <NavItem level='1' to={navList.home.to}>{navList.home[lang]}</NavItem>

                <li className="nav-item extandable">
                    <span className="nav-item__text nav-item__level_1">{navList.fibers[lang]}</span>
                    <ul className="submenu">
                        <li className="submenu__item">
                            <ul className="submenu__content">
                                <NavItem level='2' to={navList.fibers.about.to} end={true}>{navList.fibers.about[lang]}</NavItem>
                                <NavItem level='2' to={navList.fibers.compare.to} end={true}>{navList.fibers.compare[lang]}</NavItem>
                                {fibersList.filter(fiber => fiber.active)?.map(fiber => <NavItem level='2' to={`fibers/${fiber._id}`} key={fiber._id}>{fiber.short.name[lang]}</NavItem>)}
                            </ul>
                        </li>
                    </ul>
                </li>
                    <NavItem level='1' to={navList.catalog.to}>{navList.catalog[lang]}</NavItem>
                {isAuth ? 
                    <NavItem level='1' to={navList.account.cart.to}>{navList.account.cart[lang]}<CartInformer /></NavItem>
                :
                    <NavItem level='1' to={navList.contacts.to}>{navList.contacts[lang]}</NavItem>
                }
                
                {isAuth ? 
                    <li className="nav-item extandable">
                        <span className="nav-item__text nav-item__level_1">{navList.account[lang]}</span>
                        <ul className="submenu">
                            <li className="submenu__item">
                                <ul className="submenu__content">
                                    <NavItem level='2' to={navList.account.order.to}>{navList.account.order[lang]}</NavItem>
                                    <NavItem level='2' to={navList.account.orders.to}>{navList.account.orders[lang]}</NavItem>
                                    <NavItem level='2' to={navList.contacts.to}>{navList.contacts[lang]}</NavItem>
                                    {isAdmin && 
                                        <>
                                            <NavItem level='2' to={navList.account.admin.news.to}>{navList.account.admin.news[lang]}</NavItem>
                                            <NavItem level='2' to={navList.account.admin.color.to}>{navList.account.admin.color[lang]}</NavItem>
                                            <NavItem level='2' to={navList.account.admin.fiber.to}>{navList.account.admin.fiber[lang]}</NavItem>
                                            <NavItem level='2' to={navList.account.admin.catalog.to}>{navList.account.admin.catalog[lang]}</NavItem>
                                            <NavItem level='2' to={navList.account.admin.product.to}>{navList.account.admin.product[lang]}</NavItem>
                                            <NavItem level='2' to={navList.account.admin.content.to}>{navList.account.admin.content[lang]}</NavItem>
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

    const NavItemMob = ({level, to, end=false, tab, children, k, addClass}: {level: string, to: string, end?: boolean, tab?: string, children:React.ReactNode, k?: string, addClass?: string}) => {
        return (
            <li className={`${level === '1' ? 'nav-item' : ''} ${level === '2' ? 'submenu__item' : ''} ${addClass}`} key={k}>
                <NavLink 
                    className={({ isActive }) => `nav-text_level_${level} ${isActive ? "selected" : ""}`} 
                    to={to} 
                    onClick={(e) => navToggleMobile(e)}
                    end={end} 
                    tabIndex={(expandedNavItems === tab || tab === 'always') ? 0 : -1}
                >
                    {children}
                </NavLink>
            </li>
        )
    }


    const mobileNav = useMemo(() => {
        return  <nav className={mobOpened ? "nav_mobile opened" : "nav_mobile"} data-testid='nav_mobile' ref={_navMobile}>
        <div className="nav__switcher">
            <button 
                className="nav_mobile__hider"
                onClick={(e) => navToggleMobile(e)}
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
                <NavItemMob level='1' to={navList.home.to} tab='always'>
                    {navList.home[lang]}
                </NavItemMob>
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
                            <NavItemMob level='2' to={navList.home.to} end={true} tab='fibers'>{navList.fibers.about[lang]}</NavItemMob>
                            <NavItemMob level='2' to={navList.fibers.compare.to} end={true} tab='fibers'>{navList.fibers.compare[lang]}</NavItemMob>

                            {fibersList.filter(fiber => fiber.active)?.map((fiber) => (
                                <NavItemMob level='2' to={`fibers/${fiber._id}`} end={true} tab='fibers' key={fiber._id}>
                                    {fiber.short.name[lang]}
                                </NavItemMob>)
                            )}
                        </ul>
                    </div>              
                </li>

                <NavItemMob level='1' to={navList.catalog.to} tab='always'>
                    {navList.catalog[lang]}
                </NavItemMob>
                {isAuth ?
                    <NavItemMob level='1' to={navList.cart.to} tab='always' addClass="narrow">
                        {navList.cart[lang]}
                        <CartInformer />        
                    </NavItemMob>
                :
                    <NavItemMob level='1' to={navList.contacts.to} tab='always'>
                        {navList.contacts[lang]}
                    </NavItemMob>
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
                            <NavItemMob level='2' to={navList.account.order.to} tab='cabinet'>
                                {navList.account.order[lang]}
                            </NavItemMob>
                            <NavItemMob level='2' to={navList.account.orders.to} tab='cabinet'>
                                {navList.account.orders[lang]}
                            </NavItemMob>
                            <NavItemMob level='2' to={navList.contacts.to} tab='cabinet'>
                                {navList.contacts[lang]}
                            </NavItemMob>
                            {isAdmin &&
                            <>
                                <NavItemMob level='2' to={navList.account.admin.news.to}  tab='cabinet'>
                                    {navList.account.admin.news[lang]}
                                </NavItemMob>
                                <NavItemMob level='2' to={navList.account.admin.color.to}  tab='cabinet'>
                                    {navList.account.admin.color[lang]}
                                </NavItemMob>
                                <NavItemMob level='2' to={navList.account.admin.fiber.to}  tab='cabinet'>
                                    {navList.account.admin.fiber[lang]}
                                </NavItemMob>
                                <NavItemMob level='2' to={navList.account.admin.catalog.to}  tab='cabinet'>
                                    {navList.account.admin.catalog[lang]}
                                </NavItemMob>
                                <NavItemMob level='2' to={navList.account.admin.product.to}  tab='cabinet'>
                                    {navList.account.admin.product[lang]}
                                </NavItemMob>
                                <NavItemMob level='2' to={navList.account.admin.content.to}  tab='cabinet'>
                                    {navList.account.admin.content[lang]}
                                </NavItemMob>
                            </>}
                            <li className="submenu__item">
                                <button  
                                    role="button" 
                                    tabIndex={0} 
                                    className="button_nostyle nav-text_level_1" 
                                    onClick={(e) => {onClickNotLink('logout'); navToggleMobile(e)}} 
                                    onKeyDown={e => {e.code === 'Enter' && onClickNotLink('logout'); navToggleMobile(e)}}
                                    data-testid='btn_logout_mobile'>
                                        {navList.account.logout[lang]}
                                </button>
                            </li>
                            </ul>
                        </div>
                    </li>
                :
                    <li className="nav-item">
                        <button 
                            role="button" 
                            className="button_nostyle nav-text_level_1" 
                            onClick={(e) => {onClickNotLink('login'); navToggleMobile(e)}} 
                            data-testid='btn_login_mobile'>
                                {navList.account.login[lang]}
                        </button>
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
