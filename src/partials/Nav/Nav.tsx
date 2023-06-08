import { Fragment, useEffect, useState,  useRef } from "react";
import { NavLink } from "react-router-dom";
import { IFibersState, IFullState, IModal, IPageItem, IUserState, TLang } from "src/interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.png"
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { setNavCloseDt, setNavCloseMob, setNavOpenDt, setNavOpenMob }  from "../../redux/actions/base"
import CartInformer from "../../components/CartInformer/CartInformer";
import { loadFibers } from "../../redux/actions/fibers"
import { setUser } from "../../redux/actions/user"
import Modal from "src/components/Modal/Modal";
import Auth from "src/components/Auth/Auth";
import { pagesList } from "./initialNav";

const actionsListBase = {setNavCloseDt, setNavCloseMob, setNavOpenDt, setNavOpenMob }
const actionsListFibers = { loadFibers }
const actionsListUser = { setUser }

interface IPropsState {
    lang: TLang
    mobOpened: boolean
    desktopOpened: boolean
    fibersState: IFibersState
    userState: IUserState
}

interface IPropsActions {
    setState: {
        base: typeof actionsListBase
        fibers: typeof actionsListFibers
        user: typeof actionsListUser
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Nav:React.FC<IProps> = ({lang, setState, mobOpened, desktopOpened, fibersState, userState}): JSX.Element => {
    const _blur = useRef<HTMLDivElement>(null)
    const [nav, setNav] = useState<IPageItem[]>(pagesList)
    const [expandedNavItems, setExpandedNavItems] = useState<IPageItem["id"][]>([])
	const [modal, setModal] = useState<IModal>({visible: false})
    

    const navToggle = () => {
        desktopOpened ? setState.base.setNavCloseDt() : setState.base.setNavOpenDt()
    }

    const navToggleMobile = () => {
        mobOpened ? setState.base.setNavCloseMob() : setState.base.setNavOpenMob()
    }


	useEffect(() => {
        if (fibersState.dataLoading.status !== 'success' || fibersState.fibersList.length === 0) return
        const newNav = pagesList.map((page) => {
            if (page.id === "main_fibers") {
                const newSub: IPageItem[] = fibersState.fibersList.map((fiber) => ({
                        name: fiber.short.name,
                        path: `/fibers/${fiber.id}`,
                        id: fiber.id,
                    }))
                return {
                    ...page, 
                    subMenu: [...page.subMenu as [], ...newSub]
                }
            }
            return page
        })
        setNav(newNav)
	}, [fibersState.dataLoading.status, lang])


    const onNavWithSubClicked = (navId: string) => {
        if (expandedNavItems.includes(navId)) {
            setExpandedNavItems(expandedNavItems.filter(id => id !== navId))
        } else (
            setExpandedNavItems([...expandedNavItems, navId])
        )
    }


       
    const closeModal = () => {
		setModal({visible: false})
	}


    const onClickNotLink = (action: string) => {
        if (action === 'login' && !userState.token) {
		    setModal({visible: true})
        }
        if (action === 'logout') {
            setState.user.setUser({
                name: '', 
                email: '', 
                phone: '', 
                token: '', 
                orders: [], 
                auth: {status: 'idle', message: {en: '', ru: ''}, errors: []}
            })
            localStorage.removeItem('user')        
        }

        navToggleMobile()
    }

/*
    const onLogoutClick = () => {
        setState.user.setUser({
            name: '', 
            email: '', 
            phone: '', 
            token: '', 
            orders: [], 
            auth: {status: 'idle', message: {en: '', ru: ''}, errors: []}
        })
        localStorage.removeItem('token')
    }
*/

    return (
        <>
            <nav className={desktopOpened ? "nav_desktop opened" : "nav_desktop"}>
                <div className="nav__container">
                    <ul>
                        <li>
                            <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                to='/'
                            >
                                {lang === 'en' ? 'HOME' : 'ГЛАВНАЯ'}
                            </NavLink>
                        </li>

                        <li className="extandable">
                            <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                to='/fibers'
                            >
                                {lang === 'en' ? 'FIBERS' : 'МАТЕРИАЛЫ '}
                            </NavLink>
                            <ul className="sub_menu">
                                <li>
                                    <ul className="submenu__content">
                                        <li>
                                            <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                                to={`fibers`}
                                                end
                                            >
                                                {lang === 'en' ? 'ABOUT' : 'О ФИЛАМЕНТАХ'}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                                to={`/fibers/compare`}
                                            >
                                                {lang === 'en' ? 'COMPARASING' : 'СРАВНЕНИЕ'}
                                            </NavLink>
                                        </li>
                                        {fibersState.fibersList.map(fiber => {
                                            return (
                                                <li key={fiber.id}>
                                                   <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                                       to={`fibers/${fiber.id}`}
                                                   >
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
                            <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                to='/catalog'
                            >
                                {lang === 'en' ? 'CATALOG' : 'КАТАЛОГ'}
                            </NavLink>
                        </li>
                        {userState.token ? 
                            <li>
                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                    to='/order'
                                >
                                    {lang === 'en' ? 'CART' : 'КОРЗИНА'}
                                </NavLink>
                                <div className="cart-informer__container"><CartInformer /></div>

                            </li>
                        :
                            <li>
                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                    to='/contact_us'
                                >
                                    {lang === 'en' ? 'CONTACT' : 'СООБЩЕНИЕ'}
                                </NavLink>
                            </li>
                        }
                        {userState.token ? 
                            <li className="extandable">
                                <a className="not-link" onClick={() => onClickNotLink('login')}>{lang === 'en' ? 'CABINET' : 'Кабинет'}</a>
                                <ul className="sub_menu">
                                    <li>
                                        <ul className="submenu__content">
                                            <li>
                                                <NavLink
                                                    to='/order'
                                                >
                                                    {lang === 'en' ? 'CART' : 'КОРЗИНА'}
                                                </NavLink>
                                            </li> 
                                            <li>
                                                <NavLink
                                                    to='/order'
                                                >
                                                    {lang === 'en' ? 'ORDERS HISTORY' : 'ЗАКАЗЫ'}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to='/contact_us'
                                                >
                                                    {lang === 'en' ? 'WRITE US' : 'СООБЩЕНИЕ'}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <a className="not-link" onClick={() => onClickNotLink('logout')}>{lang === 'en' ? 'LOGOUT' : 'ВЫХОД'}</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            :
                            <li>
                                <a className="not-link" onClick={() => onClickNotLink('login')}>{lang === 'en' ? 'LOGIN' : 'ВХОД'}</a>
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
            </nav>








            <nav className={mobOpened ? "nav_mobile opened" : "nav_mobile"}>
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
                    <ul>
                        <li>
                            <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                to='/'
                                onClick={navToggleMobile}
                            >
                                {lang === 'en' ? 'HOME' : 'ГЛАВНАЯ'}
                            </NavLink>
                        </li>


                        <li className={`${expandedNavItems.includes('fibers') ? 'expanded' : ''}`}>
                            <span onClick={() => onNavWithSubClicked('fibers')}>{lang === 'en' ? 'FIBERS' : 'МАТЕРИАЛЫ '}</span>
                            <div>
                                <ul className="nav__subnav">
                                    {fibersState.fibersList.map((fiber) => {
                                        return (
                                            <li key={fiber.id}>
                                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} 
                                                    onClick={navToggleMobile}
                                                    to={`fibers/${fiber.id}`}
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
                            <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                to='/catalog'
                                onClick={navToggleMobile}
                            >
                                {lang === 'en' ? 'CATALOG' : 'КАТАЛОГ'}
                            </NavLink>
                        </li>
                        {userState.token ? 
                            <li className="narrow">
                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                    to='/order'
                                    onClick={navToggleMobile}
                                >
                                    {lang === 'en' ? 'CART' : 'КОРЗИНА'}
                                </NavLink>
                                <div className="cart-informer__container"><CartInformer /></div>          
                            </li>
                        :
                            <li>
                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                    to='/contacts'
                                    onClick={navToggleMobile}
                                >
                                    {lang === 'en' ? 'CONTACTS' : 'КОНТАКТЫ'}
                                </NavLink>
                            </li>
                        }

                        
                        {userState.token ? 
                            <li className={`${expandedNavItems.includes('cabinet') ? 'expanded' : ''}`}>
                                <span onClick={() => onNavWithSubClicked('cabinet')}>{lang === 'en' ? 'CABINET' : 'КАБИНЕТ '}</span>
                                <div>
                                    <ul className="nav__subnav noscroll">
                                        <li>
                                            <NavLink
                                                to='/order'
                                                onClick={navToggleMobile}
                                            >
                                                {lang === 'en' ? 'CART' : 'КОРЗИНА'}
                                            </NavLink>
                                            <div className="cart-informer__container"><CartInformer /></div>          
                                        </li> 
                                        <li>
                                            <NavLink
                                                to='/order'
                                                onClick={navToggleMobile}
                                            >
                                                {lang === 'en' ? 'ORDERS HISTORY' : 'ЗАКАЗЫ'}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to='/order'
                                                onClick={navToggleMobile}
                                            >
                                                {lang === 'en' ? 'WRITE US' : 'СООБЩЕНИЕ'}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <a className="not-link" onClick={() => onClickNotLink('logout')}>{lang === 'en' ? 'LOGOUT' : 'ВЫХОД'}</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        :
                            <li>
                                <a className="not-link" onClick={() => onClickNotLink('login')}>{lang === 'en' ? 'LOGIN' : 'ВХОД'}</a>
                            </li>
                        }
                    </ul>
                </div>
                <div className="nav__container_right"></div>
                <Modal {...{visible: modal.visible, close: closeModal, escExit: true}}>
                    <Auth onCancel={closeModal}/>
			    </Modal> 
            </nav>
        </>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
	lang: state.base.lang,
    mobOpened: state.base.mobOpened,
    desktopOpened: state.base.desktopOpened,
    fibersState: state.fibers,
    userState: state.user
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		base: bindActionCreators(actionsListBase, dispatch),
		fibers: bindActionCreators(actionsListFibers, dispatch),
		user: bindActionCreators(actionsListUser, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
