import { useState, useRef, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { IFetch, IFiber, IFullState, TId, TLang } from "../../interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.png"
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import CartInformer from "../../components/CartInformer/CartInformerUpdater";
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import Auth from "../../components/Auth/Auth";
import { allActions } from "../../redux/actions/all";
import initialUserState from "../../../src/redux/initialStates/user";
import { navList } from "../../../src/assets/js/consts";


interface IPropsState {
    lang: TLang
    mobOpened: boolean
    desktopOpened: boolean
    fibersList: IFiber[]
    isAdmin: boolean
    isAuth: boolean
}


interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        user: typeof allActions.user
        base: typeof allActions.base
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Nav:React.FC<IProps> = ({lang, setState, mobOpened, desktopOpened, fibersList, isAdmin, isAuth}): JSX.Element => {
    const _blur = useRef<HTMLDivElement>(null)
    const [expandedNavItems, setExpandedNavItems] = useState<TId[]>([])
    const modalRef = useRef<IModalFunctions>(null)


    const navToggle = () => {
        setState.base.setNavToggleDt()
    }

    const navToggleMobile = () => {
        setState.base.setNavToggleMob()
    }


    const onNavWithSubClicked = (navId: string) => {       
        if (expandedNavItems.includes(navId)) {
            setExpandedNavItems(expandedNavItems.filter(id => id !== navId))
        } else (
            setExpandedNavItems([...expandedNavItems, navId])
        )
    }


    const closeModal = () => {
        modalRef.current?.closeModal()
	}


    const onClickNotLink = (action: string) => {
        if (action === 'login' && !isAuth) {
            modalRef.current?.openModal()
        }
        if (action === 'logout') {
            setState.user.setUser({...initialUserState})
            localStorage.removeItem('user')
            window.location.reload()
        }
        navToggleMobile()
    }

    const desktopNav = useMemo(() => {
        return <nav className={desktopOpened ? "nav_desktop opened" : "nav_desktop"}>
        <div className="nav__container">
            <ul>
                <li>
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={navList.home.to}>
                        {navList.home[lang]}
                    </NavLink>
                </li>

                <li className="extandable">
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={navList.fibers.to}>
                        {navList.fibers[lang]}
                    </NavLink>
                    <ul className="sub_menu">
                        <li>
                            <ul className="submenu__content">
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={navList.fibers.about.to} end>
                                        {navList.fibers.about[lang]}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={navList.fibers.compare.to}>
                                        {navList.fibers.compare[lang]}
                                    </NavLink>
                                </li>
                                {fibersList.map(fiber => {
                                    return (
                                        <li key={fiber._id}>
                                           <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={`fibers/${fiber._id}`}>
                                               {fiber.short.name[lang]}
                                           </NavLink>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    </ul>
                </li>

                <li>
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={navList.catalog.to}>
                        {navList.catalog[lang]}
                    </NavLink>
                </li>

                <li>
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={navList.contacts.to}>
                        {navList.contacts[lang]}
                    </NavLink>
                </li>
                
                {isAuth ? 
                    <li className="extandable">
                        <a className="not-link" onClick={() => onClickNotLink('login')}>{navList.account[lang]}</a>
                        <ul className="sub_menu">
                            <li>
                                <ul className="submenu__content">
                                    <li>
                                        <NavLink to={navList.account.orders.to}>
                                            {navList.account.orders[lang]}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={navList.account.cart.to}>
                                            {navList.account.cart[lang]}
                                            <div className="cart-informer__container"><CartInformer /></div>          
                                        </NavLink>

                                    </li> 
                                    {isAdmin && 
                                        <>
                                            <li>
                                                <NavLink to={navList.account.admin.news.to} >
                                                    {navList.account.admin.news[lang]}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to={navList.account.admin.color.to} >
                                                    {navList.account.admin.color[lang]}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to={navList.account.admin.fiber.to} >
                                                    {navList.account.admin.fiber[lang]}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to={navList.account.admin.catalog.to} >
                                                    {navList.account.admin.catalog[lang]}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to={navList.account.admin.product.to} >
                                                    {navList.account.admin.product[lang]}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to={navList.account.admin.content.to} >
                                                    {navList.account.admin.content[lang]}
                                                </NavLink>
                                            </li>
                                        </>}
                                    <li>
                                        <a className="not-link" onClick={() => onClickNotLink('logout')}>{navList.account.logout[lang]}</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    :
                    <li>
                        <a className="not-link" onClick={() => onClickNotLink('login')}>{navList.account.login[lang]}</a>
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
                
            </div>
            <ul>
                <li>
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={navList.home.to} onClick={navToggleMobile}>
                        {navList.home[lang]}
                    </NavLink>
                </li>

                <li className={`${expandedNavItems.includes('fibers') ? 'expanded' : ''}`}>
                    <span onClick={() => onNavWithSubClicked('fibers')}>{navList.fibers[lang]}</span>
                    <div>
                        <ul className="nav__subnav">
                            <li>
                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} 
                                    onClick={navToggleMobile}
                                    to={navList.fibers.about.to}
                                    end>
                                        {navList.fibers.about[lang]}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} 
                                    onClick={navToggleMobile}
                                    to={navList.fibers.compare.to}
                                    end>
                                        {navList.fibers.compare[lang]}
                                </NavLink>
                            </li>
                            {fibersList.map((fiber) => {
                                return (
                                    <li key={fiber._id}>
                                        <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} 
                                            onClick={navToggleMobile}
                                            to={`fibers/${fiber.short.name.en}`}
                                            end>
                                                {fiber.short.name[lang]}
                                        </NavLink>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>              
                </li>

                <li>
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={navList.catalog.to} onClick={navToggleMobile}>
                        {navList.catalog[lang]}
                    </NavLink>
                </li>
                <li>
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={navList.contacts.to} onClick={navToggleMobile}>
                        {navList.contacts[lang]}
                    </NavLink>
                </li>
                {isAuth &&
                <li className="narrow">
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to='/order' onClick={navToggleMobile}>
                        {lang === 'en' ? 'CART' : 'КОРЗИНА'}
                    </NavLink>
                    <div className="cart-informer__container"><CartInformer /></div>          
                </li>}

                
                {isAuth ? 
                    <li className={`${expandedNavItems.includes('cabinet') ? 'expanded' : ''}`}>
                        <span onClick={() => onNavWithSubClicked('cabinet')}>{lang === 'en' ? 'ACCOUNT' : 'КАБИНЕТ '}</span>
                        <div>
                            <ul className="nav__subnav noscroll">
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}  
                                        to={navList.account.orders.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.orders[lang]}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}  
                                        to={navList.account.admin.news.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.news[lang]}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}  
                                        to={navList.account.admin.color.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.color[lang]}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}  
                                        to={navList.account.admin.fiber.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.fiber[lang]}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}  
                                        to={navList.account.admin.catalog.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.catalog[lang]}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}  
                                        to={navList.account.admin.product.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.product[lang]}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}  
                                        to={navList.account.admin.content.to} 
                                        onClick={navToggleMobile}>
                                            {navList.account.admin.content[lang]}
                                    </NavLink>
                                </li>
                                <li>
                                    <a className="not-link" onClick={() => onClickNotLink('logout')}>{navList.account.logout[lang]}</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                :
                    <li>
                        <a className="not-link" onClick={() => onClickNotLink('login')}>{navList.account.login[lang]}</a>
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
            <Modal escExit={true} ref={modalRef}>
                <Auth onCancel={closeModal}/>
            </Modal> 
        </>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
	lang: state.base.lang,
    mobOpened: state.base.mobOpened,
    desktopOpened: state.base.desktopOpened,
    fibersList: state.fibers.fibersList,
    isAdmin: state.user.isAdmin,
    isAuth: state.user.auth.status === 'success'
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		base: bindActionCreators(allActions.base, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
