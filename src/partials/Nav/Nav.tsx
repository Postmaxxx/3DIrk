import { Fragment, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { IPage, IState, TLang } from "src/interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.png"
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";


interface IProps {
    lang: TLang
    pagesList: Array<IPage>
    mobOpened: boolean
    desktopOpened: boolean
    setState: typeof actions
}


const Nav:React.FC<IProps> = ({lang, pagesList, setState, mobOpened, desktopOpened}: IProps) => {
    //const scrollTimeout = useRef<any>()
    const _blur = useRef<HTMLDivElement>(null)

    const navToggle = () => {
        desktopOpened ? setState.setNavCloseDt() : setState.setNavOpenDt()
    }

    const navToggleMobile = () => {
        mobOpened ? setState.setNavCloseMob() : setState.setNavOpenMob()
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


    return (
        <>
            <nav className={desktopOpened ? "nav_desktop opened" : "nav_desktop"}>
                <div className="nav__container">
                    <ul>
                        {pagesList.map((page: IPage) => {
                            return (
                                <li key={page.path}>
                                    <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                        to={page.path}
                                        data-text={page.name[lang]}
                                        >
                                        {page.name[lang]}
                                    </NavLink>
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

const mapStateToProps = (state: IState) => ({
    lang: state.lang, 
    mobOpened: state.nav.mobOpened,
	desktopOpened: state.nav.desktopOpened,
    pagesList: state.pagesList
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
