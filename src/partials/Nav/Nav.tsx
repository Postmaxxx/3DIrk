import { useState, useRef, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { IFiber, IFullState, IPageItem, TLang } from "../../interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.png"
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import CartInformer from "../../components/CartInformer/CartInformerUpdater";
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import Auth from "../../components/Auth/Auth";
import { allActions } from "../../redux/actions/all";
import { resetFetch } from "../../assets/js/consts";


interface IPropsState {
    lang: TLang
    mobOpened: boolean
    desktopOpened: boolean
    fibersList: IFiber[]
    isAdmin: boolean
    token: string
}


interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        user: typeof allActions.user
        base: typeof allActions.base
    }
}

interface IProps extends IPropsState, IPropsActions {}


const Nav:React.FC<IProps> = ({lang, setState, mobOpened, desktopOpened, fibersList, isAdmin, token}): JSX.Element => {
    const _blur = useRef<HTMLDivElement>(null)
    const [expandedNavItems, setExpandedNavItems] = useState<IPageItem["_id"][]>([])
    const modal = useRef<IModalFunctions>(null)


    const navToggle = () => {
        desktopOpened ? setState.base.setNavCloseDt() : setState.base.setNavOpenDt()
    }

    const navToggleMobile = () => {
        mobOpened ? setState.base.setNavCloseMob() : setState.base.setNavOpenMob()
    }


    const onNavWithSubClicked = (navId: string) => {       
        if (expandedNavItems.includes(navId)) {
            setExpandedNavItems(expandedNavItems.filter(id => id !== navId))
        } else (
            setExpandedNavItems([...expandedNavItems, navId])
        )
    }


    const closeModal = () => {
        modal.current?.closeModal()
	}


    const onClickNotLink = (action: string) => {
        if (action === 'login' && !token) {
            modal.current?.openModal()
        }
        if (action === 'logout') {
            setState.user.setUser({
                name: '', 
                email: '', 
                phone: '', 
                token: '', 
                orders: [], 
                isAdmin: false,
                auth: {...resetFetch}
            })
            localStorage.removeItem('user')        
        }
        navToggleMobile()
    }

    const desktop = useMemo(() => {
        return <nav className={desktopOpened ? "nav_desktop opened" : "nav_desktop"}>
        <div className="nav__container">
            <ul>
                <li>
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to='/'>
                        {lang === 'en' ? 'HOME' : 'ГЛАВНАЯ'}
                    </NavLink>
                </li>

                <li className="extandable">
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to='/fibers'>
                        {lang === 'en' ? 'FIBERS' : 'МАТЕРИАЛЫ '}
                    </NavLink>
                    <ul className="sub_menu">
                        <li>
                            <ul className="submenu__content">
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={`fibers`} end>
                                        {lang === 'en' ? 'ABOUT' : 'О ФИЛАМЕНТАХ'}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to={`/fibers/compare`}>
                                        {lang === 'en' ? 'COMPARASING' : 'СРАВНЕНИЕ'}
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
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to='/catalog'>
                        {lang === 'en' ? 'CATALOG' : 'КАТАЛОГ'}
                    </NavLink>
                </li>

                <li>
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to='/contact_us'>
                        {lang === 'en' ? 'CONTACT' : 'КОНТАКТЫ'}
                    </NavLink>
                </li>
                
                {token ? 
                    <li className="extandable">
                        <a className="not-link" onClick={() => onClickNotLink('login')}>{lang === 'en' ? 'ACCOUNT' : 'Кабинет'}</a>
                        <ul className="sub_menu">
                            <li>
                                <ul className="submenu__content">
                                    <li>
                                        <NavLink to='/orders'>
                                            {lang === 'en' ? 'ORDERS' : 'ЗАКАЗЫ'}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/order'>
                                            {lang === 'en' ? 'CART' : 'КОРЗИНА'}
                                            <div className="cart-informer__container"><CartInformer /></div>          
                                        </NavLink>

                                    </li> 
                                    {isAdmin ? 
                                        <>
                                            <li>
                                                <NavLink to='/admin/news-create' >
                                                    {lang === 'en' ? '+ NEWS' : '+ НОВОСТЬ'}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/admin/color-create' >
                                                    {lang === 'en' ? '+ COLOR' : '+ ЦВЕТ'}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/admin/fiber-create' >
                                                    {lang === 'en' ? '+ FIBER' : '+ МАТЕРИАЛ'}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/admin/catalog-change' >
                                                    {lang === 'en' ? '~ CATALOG' : '~ КАТАЛОГ'}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/admin/product-create' >
                                                    {lang === 'en' ? '+ PRODUCT' : '+ ТОВАР'}
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/admin/splider-change' >
                                                    {lang === 'en' ? '~ SPLIDER' : '~ ГАЛЕРЕЯ'}
                                                </NavLink>
                                            </li>
                                        </>
                                    : 
                                        null
                                    }
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
    </nav>}, [isAdmin, token, desktopOpened, lang, fibersList])





    const mobile = useMemo(() => {
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
            <ul>
                <li>
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to='/' onClick={navToggleMobile}>
                        {lang === 'en' ? 'HOME' : 'ГЛАВНАЯ'}
                    </NavLink>
                </li>

                <li className={`${expandedNavItems.includes('fibers') ? 'expanded' : ''}`}>
                    <span onClick={() => onNavWithSubClicked('fibers')}>{lang === 'en' ? 'FIBERS' : 'МАТЕРИАЛЫ '}</span>
                    <div>
                        <ul className="nav__subnav">
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
                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to='/catalog' onClick={navToggleMobile}>
                        {lang === 'en' ? 'CATALOG' : 'КАТАЛОГ'}
                    </NavLink>
                </li>
                {token ? 
                    <li className="narrow">
                        <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to='/order' onClick={navToggleMobile}>
                            {lang === 'en' ? 'CART' : 'КОРЗИНА'}
                        </NavLink>
                        <div className="cart-informer__container"><CartInformer /></div>          
                    </li>
                :
                    <li>
                        <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} to='/contacts' onClick={navToggleMobile}>
                            {lang === 'en' ? 'CONTACTS' : 'КОНТАКТЫ'}
                        </NavLink>
                    </li>
                }

                
                {token ? 
                    <li className={`${expandedNavItems.includes('cabinet') ? 'expanded' : ''}`}>
                        <span onClick={() => onNavWithSubClicked('cabinet')}>{lang === 'en' ? 'ACCOUNT' : 'КАБИНЕТ '}</span>
                        <div>
                            <ul className="nav__subnav noscroll">
                                <li>
                                    <NavLink to='/order' onClick={navToggleMobile}>
                                        {lang === 'en' ? 'CART' : 'КОРЗИНА'}
                                    </NavLink>
                                    <div className="cart-informer__container"><CartInformer /></div>          
                                </li> 
                                <li>
                                    <NavLink to='/order' onClick={navToggleMobile}>
                                        {lang === 'en' ? 'ORDERS HISTORY' : 'ЗАКАЗЫ'}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/order' onClick={navToggleMobile}>
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
    </nav>}, [isAdmin, token, mobOpened, lang, fibersList, expandedNavItems])


    return (
        <>
            {desktop}
            {mobile}
            <Modal escExit={true} ref={modal}>
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
    token: state.user.token
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		base: bindActionCreators(allActions.base, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
