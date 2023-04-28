import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { IPage, IState, TLang } from "src/interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.png"
import { connect } from "react-redux";


interface IProps {
    lang: TLang
    pagesList: Array<IPage>
}


const Nav:React.FC<IProps> = ({lang, pagesList}: IProps) => {
    const [opened, setOpened] = useState(true)
    const scrollTimeout = useRef<any>()

    const navToggle = () => {
        setOpened(!opened)
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
  
    return (
        <nav className={opened ? "nav_desktop opened" : "nav_desktop"}>
            <div className="nav__container">
                <ul>
                    {pagesList.map((page: IPage) => {
                        return (
                            <li key={page.path}>
                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                    to={page.path}>
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
    )
}

const mapStateToProps = (state: IState) => ({
    lang: state.lang, 
    pagesList: state.pagesList
})
/*
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
*/
export default connect(mapStateToProps)(Nav)
