import { Fragment, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { IFullState, IPage, TLang } from "src/interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.png"
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { setNavCloseDt, setNavCloseMob, setNavOpenDt, setNavOpenMob }  from "../../redux/actions/base"
import CartInformer from "src/components/CartInformer/CartInformer";


const actionsList = {setNavCloseDt, setNavCloseMob, setNavOpenDt, setNavOpenMob }

interface IPropsState {
    lang: TLang
    mobOpened: boolean
    desktopOpened: boolean
}

interface IPropsActions {
    setState: {
        base: typeof actionsList
    }
}

interface IProps extends IPropsState, IPropsActions {}

const pagesList = [
    {
        name: {
            ru: "главная",
            en: 'home'
        },
        path: "/"
    },
    {
        name: {
            ru: "Филаменты",
            en: 'Fialaments'
        },
        path: "/fibers",
        subMenu : [
            {
                name: {
                    ru: "О филаментах",
                    en: 'About'
                },
                path: "/fibers",
            },
            {
                name: {
                    ru: "Сравнение",
                    en: 'Comparasing'
                },
                path: "/fibers/compare",
            },
            {
                name: {
                    ru: "f_PLA",
                    en: 'f_PLA'
                },
                path: "/fibers/f_PLA",
            },
            {
                name: {
                    ru: "f_PETg",
                    en: 'f_PETg'
                },
                path: "/fibers/f_PETg",
            },
            {
                name: {
                    ru: "f_ABS",
                    en: 'f_ABS'
                },
                path: "/fibers/f_ABS",
            },
            {
                name: {
                    ru: "f_ASA",
                    en: 'f_ASA'
                },
                path: "/fibers/f_ASA",
            },
            {
                name: {
                    ru: "f_PA",
                    en: 'f_PA'
                },
                path: "/fibers/f_PA",
            },
            {
                name: {
                    ru: "f_CABS",
                    en: 'f_CABS'
                },
                path: "/fibers/f_CABS",
            },
            {
                name: {
                    ru: "f_CN",
                    en: 'f_CN'
                },
                path: "/fibers/f_CN",
            },
            {
                name: {
                    ru: "f_PC",
                    en: 'f_PC'
                },
                path: "/fibers/f_PC",
            },
            {
                name: {
                    ru: "f_PP",
                    en: 'f_PP'
                },
                path: "/fibers/f_PP",
            },
            {
                name: {
                    ru: "f_SEBS",
                    en: 'f_SEBS'
                },
                path: "/fibers/f_SEBS",
            },
        ]
    },
    {
        name: {
            ru: "каталог",
            en: 'catalog'
        },
        path: "/catalog"
    },
    {
        name: {
            ru: "заказать",
            en: 'order'
        },
        path: "/order"
    },
] satisfies IPage[]

const Nav:React.FC<IProps> = ({lang, setState, mobOpened, desktopOpened}): JSX.Element => {
    //const scrollTimeout = useRef<any>()
    const _blur = useRef<HTMLDivElement>(null)
    

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


  
    useEffect(() => {

    },[])


    const subMenuClicked = () => {
        console.log('nav re');
    }
    

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
                                        data-text={page.name[lang]}
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
                                                                data-text={page.name[lang]}
                                                                onClick={subMenuClicked}
                                                            >
                                                                {subPage.name[lang]}
                                                            </NavLink>
                                                        </li>
                                                    )
                                                })}
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
    desktopOpened: state.base.desktopOpened
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		base: bindActionCreators(actionsList, dispatch)
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
