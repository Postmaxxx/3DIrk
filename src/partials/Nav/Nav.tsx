import { Fragment, useEffect, useState,  useRef } from "react";
import { NavLink } from "react-router-dom";
import { IFibersState, IFullState, IPage, TLang } from "src/interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.png"
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { setNavCloseDt, setNavCloseMob, setNavOpenDt, setNavOpenMob }  from "../../redux/actions/base"
import CartInformer from "src/components/CartInformer/CartInformer";
import { loadFibers, setSelectedFiber } from "src/redux/actions/fibers"


const actionsListBase = {setNavCloseDt, setNavCloseMob, setNavOpenDt, setNavOpenMob }
const actionsListFibers = { loadFibers, setSelectedFiber }

interface IPropsState {
    lang: TLang
    mobOpened: boolean
    desktopOpened: boolean
    fibersState: IFibersState
}

interface IPropsActions {
    setState: {
        base: typeof actionsListBase
        fibers: typeof actionsListFibers
    }
}

interface IProps extends IPropsState, IPropsActions {}

const pagesList = [
    {
        name: {
            ru: "главная",
            en: 'home'
        },
        path: "/",
        id: 'main_home'
    },
    {
        name: {
            ru: "Филаменты",
            en: 'Filaments'
        },
        path: "/fibers",
        id: 'main_fibers',

        subMenu : [
            {
                name: {
                    ru: "О ФИЛАМЕНТАХ",
                    en: 'ABOUT'
                },
                path: "/fibers",
                id: 'about',

            },
            {
                name: {
                    ru: "СРАВНЕНИЕ",
                    en: 'COMPARASING'
                },
                path: "/fibers/compare",
                id: 'compare',

            },
        ]
    },
    {
        name: {
            ru: "каталог",
            en: 'catalog'
        },
        path: "/catalog",
        id: 'catalog',
    },
    {
        name: {
            ru: "заказать",
            en: 'order',
        },
        path: "/order",
        id: 'order',
    },
] satisfies IPage[]




const Nav:React.FC<IProps> = ({lang, setState, mobOpened, desktopOpened, fibersState}): JSX.Element => {
    //const scrollTimeout = useRef<any>()
    const _blur = useRef<HTMLDivElement>(null)
	const [fibersList, setFibersList] = useState<any>()
    

    const navToggle = () => {
        desktopOpened ? setState.base.setNavCloseDt() : setState.base.setNavOpenDt()
    }

    const navToggleMobile = () => {
        mobOpened ? setState.base.setNavCloseMob() : setState.base.setNavOpenMob()
    }


    /*const handleScroll =() => {
        scrollTimeout.current && clearTimeout(scrollTimeout.current)
        scrollTimeout.current = setTimeout(()=> {
            setOpened(window.scrollY < 400)
        }, 250)
    }*/

    useEffect(() => {
        /*window.addEventListener("scroll", handleScroll);
        return(() => {
            window.removeEventListener("scroll", handleScroll);
        })*/
    },[])


    const setFibers = () => {
        const _filamentsNav = document.querySelector('[data-nav-text="main_fibers"]')
		if (!_filamentsNav) return          
		const fibersToAdd = fibersState.fibersList.map((fiber) => {                
			return (
				<li key={fiber.id}>
					<NavLink
						to={`/fibers/${fiber.id}`}
						data-subnav-text={fiber.id}
						onClick={() => setState.fibers.setSelectedFiber(fiber.id)}
						>
						{fiber.short.name[lang]}
					</NavLink>
				</li>
            )
		})
        if (fibersToAdd) {
            setFibersList(fibersToAdd)
        }
    }


	useEffect(() => {
        if (fibersState.dataLoading.status !== 'success') return
		if (fibersList) return
        setFibers()	
	}, [fibersState.dataLoading.status])


	useEffect(() => {
        if (fibersState.dataLoading.status !== 'success') return
        setFibers()	
	}, [lang])
   

    return (
        <>
            <nav className={desktopOpened ? "nav_desktop opened" : "nav_desktop"}>
                <div className="nav__container">
                    <ul>
                        {pagesList.map((page: IPage) => {
                            return (
                                <li key={page.path} className={page.subMenu? 'extandable' : ''}>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                        to={page.path}
                                        data-nav-text={page.id}
                                    >
                                        {page.name[lang]}
                                        {page.name.en === 'order' ? <div className="cart-informer__container"><CartInformer /></div> : null}
                                    </NavLink>
                                    {page.subMenu ? 
                                        <ul className="sub_menu">
                                            <div className="submenu__content">
                                                {page.subMenu.map(subPage => {
                                                    return (
                                                        <li key={subPage.path}>
                                                            <NavLink
                                                                to={subPage.path}
                                                                data-subnav-text={page.id}
                                                            >
                                                                {subPage.name[lang]}
                                                            </NavLink>
                                                        </li>
                                                    )
                                                })}
                                                {fibersList ? fibersList : null}
                                            </div>
                                        </ul>
                                    : null}
                                </li>
                            )
                        })
                        }
                    </ul>
                </div>
                <div className="nav__switcher">
                    <div className="text-hider"></div>
                    <label aria-label="open/hide navigation">
                        <input type="checkbox" onClick={navToggle}/>
                        <img src={navLogo} alt="Menu" />
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
                        <img src={navLogo} alt="Menu" />
                        <div className="nav__sign">
                            <span></span>
                        </div>
                    </label>
                </div>
                <div className="blur" ref={_blur}></div>
                <div className="nav__container">
                    <ul>
                        {pagesList.map((page: IPage) => {
                            return (
                                <Fragment key={page.path}>
                                    <li>
                                        <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}} onClick={navToggleMobile}
                                            to={page.path}>
                                            {page.name[lang]}
                                        </NavLink>
                                    </li>
                                    <div className="line"></div>
                                </Fragment>
                            )
                        })
                        }
                    </ul>
                </div>
                <div className="nav__container_right"></div>
            </nav>
        </>
    )
}


const mapStateToProps = (state: IFullState): IPropsState => ({
	lang: state.base.lang,
    mobOpened: state.base.mobOpened,
    desktopOpened: state.base.desktopOpened,
    fibersState: state.fibers
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		base: bindActionCreators(actionsListBase, dispatch),
		fibers: bindActionCreators(actionsListFibers, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
