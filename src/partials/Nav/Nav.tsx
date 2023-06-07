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


    const onNavWithSubClicked = (pageId: IPageItem["id"]) => {
        if (expandedNavItems.includes(pageId)) {
            setExpandedNavItems(expandedNavItems.filter(id => id !== pageId))
        } else (
            setExpandedNavItems([...expandedNavItems, pageId])
        )
    }


       
    const closeModal = () => {
		setModal({visible: false})
	}


    const onClickNotLink = (id: IPageItem['id']) => {
        if (id === 'main_auth') {
		    setModal({visible: true})
        }
    }


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


    return (
        <>
            <nav className={desktopOpened ? "nav_desktop opened" : "nav_desktop"}>
                <div className="nav__container">
                    <ul>
                        {nav.map((page: IPageItem) => {
                            return (
                                <li key={page.path} className={page.subMenu? 'extandable' : ''}>
                                    {page.notLink ? 
                                        <a className="not-link" onClick={() => onClickNotLink(page.id)}>{page.name[lang]}</a>
                                    :
                                        <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                            to={page.path}
                                            data-nav-text={page.id}
                                        >
                                            {page.name[lang]}
                                            {page.name.en === 'order' ? <div className="cart-informer__container"><CartInformer /></div> : null}
                                        </NavLink>
                                    }
                                    {page.subMenu ? 
                                        <ul>
                                            <li className="sub_menu">
                                                <ul className="submenu__content">
                                                    {page.subMenu.map(subPage => {
                                                        return (
                                                            <li key={subPage.path}>
                                                                {page.notLink ? 
                                                                    <a className="not-link" onClick={() => onClickNotLink(page.id)}>{subPage.name[lang]}</a>
                                                                :
                                                                    <NavLink
                                                                        to={subPage.path}
                                                                        data-subnav-text={page.id}
                                                                    >
                                                                        {subPage.name[lang]}
                                                                    </NavLink>
                                                                }   
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </li>
                                        </ul>
                                    : null}
                                </li>
                            )
                        })}
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
                        {nav.map((page: IPageItem) => {
                            return (
                                <Fragment key={page.path}>
                                    {page.subMenu?.length ? 
                                        <li className={`${expandedNavItems.includes(page.id) ? 'expanded' : ''}`}>
                                            <span onClick={() => onNavWithSubClicked(page.id)}>{page.name[lang]}</span>
                                            <div>
                                                <ul className="nav__subNav">
                                                    {page.subMenu?.map((subPage) => {
                                                        return (
                                                            <li key={subPage.id}>
                                                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} 
                                                                    onClick={navToggleMobile}
                                                                    to={subPage.path} end>
                                                                    {subPage.name[lang]}
                                                                    
                                                                </NavLink>
                                                            </li>
                                                        )
                                                    })}

                                                </ul>
                                            </div>
                                            
                                        </li>
                                        :
                                        <li>
                                            <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} onClick={navToggleMobile}
                                                to={page.path}>
                                                {page.name[lang]}
                                            </NavLink>
                                        </li>
                                    }
                                </Fragment>
                            )
                        })
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
