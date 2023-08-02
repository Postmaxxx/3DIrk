import { useState, useRef, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { IFiber, IFullState, TId, TLang } from "../../interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.png"
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


interface IPropsState {
    lang: TLang
    mobOpened: boolean
    desktopOpened: boolean
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


const Nav:React.FC<IProps> = ({lang, setState, mobOpened, desktopOpened, fibersList, isAdmin, modal, isAuth}): JSX.Element => {
    const _blur = useRef<HTMLDivElement>(null)
    const [expandedNavItems, setExpandedNavItems] = useState<TId | null>(null)


    const navToggle = () => {
        setState.base.setNavToggleDt()
    }

    const navToggleMobile = () => {
        setState.base.setNavToggleMob()
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


    const onClickNotLink = (action: string) => {
        if (action === 'login' && !isAuth) {
            modal?.openModal({
				name: 'auth',
                onClose: closeModal,
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
        return <nav className={desktopOpened ? "nav_desktop opened" : "nav_desktop"}>
        <div className="nav__container">
            <ul className="nav__list">
                <li className="nav-item">
                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.home.to}>
                        {navList.home[lang]}
                    </NavLink>
                </li>

                <li className="nav-item extandable">
                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.fibers.to}>
                        {navList.fibers[lang]}
                    </NavLink>
                    <ul className="submenu">
                        <li className="submenu__item">
                            <ul className="submenu__content">
                                <li className="submenu__item__point">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.fibers.about.to} end>
                                        {navList.fibers.about[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item__point">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.fibers.compare.to}>
                                        {navList.fibers.compare[lang]}
                                    </NavLink>
                                </li>
                                {fibersList.filter(fiber => fiber.active)?.map(fiber => {
                                    return (
                                        <li key={fiber._id} className="submenu__item__point">
                                           <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={`fibers/${fiber._id}`}>
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
                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.catalog.to}>
                        {navList.catalog[lang]}
                    </NavLink>
                </li>
                {isAuth ? 
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.account.cart.to}>
                            {navList.account.cart[lang]}
                        </NavLink>
                        <CartInformer />        
                    </li>
                :
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.contacts.to}>
                            {navList.contacts[lang]}
                        </NavLink>
                    </li>
                }
                
                {isAuth ? 
                    <li className="nav-item extandable">
                        <span className="nav-item__text">{navList.account[lang]}</span>
                        <ul className="submenu">
                            <li className="submenu__item">
                                <ul className="submenu__content">
                                    <li className="submenu__item__point">
                                        <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.account.orders.to}>
                                            {navList.account.orders[lang]}
                                        </NavLink>
                                    </li>
                                    <li className="submenu__item__point">
                                        <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.contacts.to}>
                                            {navList.contacts[lang]}
                                        </NavLink>
                                    </li>
                                    {isAdmin && 
                                        <>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.account.admin.news.to} >
                                                    {navList.account.admin.news[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.account.admin.color.to} >
                                                    {navList.account.admin.color[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.account.admin.fiber.to} >
                                                    {navList.account.admin.fiber[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.account.admin.catalog.to} >
                                                    {navList.account.admin.catalog[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.account.admin.product.to} >
                                                    {navList.account.admin.product[lang]}
                                                </NavLink>
                                            </li>
                                            <li className="submenu__item__point">
                                                <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.account.admin.content.to} >
                                                    {navList.account.admin.content[lang]}
                                                </NavLink>
                                            </li>
                                        </>}
                                    <li className="submenu__item__point">
                                        <a onClick={() => onClickNotLink('logout')}>{navList.account.logout[lang]}</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    :
                    <li className="nav-item">
                        <a className="nav-item__text" onClick={() => onClickNotLink('login')}>{navList.account.login[lang]}</a>
                    </li>
                }
            </ul>
        </div>
        <div className="nav__switcher">
            <div className="text-hider"></div>
            <label aria-label="open/hide navigation">
                <input type="checkbox" onClick={navToggle}/>
                <img src={navLogo} alt="Menu"/>
                <div className="nav__sign">
                    <span></span>
                </div>
            </label>
        </div>
    </nav>}, [isAdmin, isAuth, desktopOpened, lang, fibersList])






















    const mobileNav = useMemo(() => {
        return  <nav className={mobOpened ? "nav_mobile opened" : "nav_mobile"}>
        <div className="nav__switcher">
            <label aria-label="open/hide navigation">
                <input type="checkbox" onClick={navToggleMobile}/>
                <img src={navLogo} alt="Menu"/>
                <div className="nav__sign">
                    <span></span>
                </div>
            </label>
        </div>
        <div className="blur" ref={_blur}></div>
        <div className="nav__container">
            <div className="switchers__container">
                {screenWidth.sm && <LangSwitcher />}
                {screenWidth.sm && <ThemeSwitcher />}
            </div>
            <ul className="nav__list">
                <li className="nav-item">
                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.home.to} onClick={navToggleMobile}>
                        {navList.home[lang]}
                    </NavLink>
                </li>

                <li className={`nav-item ${expandedNavItems === 'fibers' ? 'expanded' : ''}`}>
                    <span className="nav-item__text" onClick={() => onNavWithSubClicked('fibers')}>{navList.fibers[lang]}</span>
                    <div className="submenu__container">
                        <ul className="submenu">
                            <li className="submenu__item">
                                <NavLink className={({ isActive }) => isActive ? "selected" : ""} 
                                    onClick={navToggleMobile}
                                    to={navList.fibers.about.to}
                                    end>
                                        {navList.fibers.about[lang]}
                                </NavLink>
                            </li>
                            <li className="submenu__item">
                                <NavLink className={({ isActive }) => isActive ? "selected" : ""} 
                                    onClick={navToggleMobile}
                                    to={navList.fibers.compare.to}
                                    end>
                                        {navList.fibers.compare[lang]}
                                </NavLink>
                            </li>
                            {fibersList.filter(fiber => fiber.active)?.map((fiber) => {
                                return (
                                    <li key={fiber._id} className="submenu__item">
                                        <NavLink className={({ isActive }) => isActive ? "selected" : ""} 
                                            onClick={navToggleMobile}
                                            to={`fibers/${fiber._id}`}
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
                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.catalog.to} onClick={navToggleMobile}>
                        {navList.catalog[lang]}
                    </NavLink>
                </li>
                {isAuth ?
                    <li className="narrow nav-item">
                        <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.cart.to} onClick={navToggleMobile}>
                            {navList.cart[lang]}
                        </NavLink>
                        <CartInformer />        
                    </li>
                :
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.contacts.to} onClick={navToggleMobile}>
                            {navList.contacts[lang]}
                        </NavLink>
                    </li>
                }

                
                {isAuth ? 
                    <li className={`nav-item ${expandedNavItems === 'cabinet' ? 'expanded' : ''}`}>
                        <span className="nav-item__text" onClick={() => onNavWithSubClicked('cabinet')}>{navList.account[lang]}</span>
                        <div className="submenu__container">
                            <ul className="submenu noscroll">
                                <li className="submenu__item">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""}  
                                        to={navList.account.orders.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.orders[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} to={navList.contacts.to} onClick={navToggleMobile}>
                                        {navList.contacts[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""}  
                                        to={navList.account.admin.news.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.news[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""}  
                                        to={navList.account.admin.color.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.color[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""}  
                                        to={navList.account.admin.fiber.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.fiber[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} 
                                        to={navList.account.admin.catalog.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.catalog[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""} 
                                        to={navList.account.admin.product.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.product[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <NavLink className={({ isActive }) => isActive ? "selected" : ""}  
                                        to={navList.account.admin.content.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.content[lang]}
                                    </NavLink>
                                </li>
                                <li className="submenu__item">
                                    <button className="button_link" onClick={() => {onClickNotLink('logout'); navToggleMobile()}}>{navList.account.logout[lang]}</button>
                                </li>
                            </ul>
                        </div>
                    </li>
                :
                    <li className="nav-item">
                        <button className="button_link" onClick={() => {onClickNotLink('login'); navToggleMobile()}}>{navList.account.login[lang]}</button>
                    </li>
                }
            </ul>
        </div>
        <div className="nav__container_right"></div>
    </nav>}, [isAdmin, isAuth, mobOpened, lang, fibersList, expandedNavItems])


    return (
        <>
            {desktopNav}
            {mobileNav}
        </>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
	lang: state.base.lang,
    mobOpened: state.base.mobOpened,
    desktopOpened: state.base.desktopOpened,
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
