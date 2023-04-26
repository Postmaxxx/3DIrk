import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { IPage, IState, TLang } from "src/interfaces";
import "./nav.scss"
import navLogo from "../../assets/img/nav_logo.png"
import { connect } from "react-redux";


const pages: Array<IPage> = [
    {
        nameRu: "Главная",
        nameEn: "Home",
        path: "/"
    },
    {
        nameRu: "Технологии",
        nameEn: "Technologies",
        path: "/tech"
    },
    {
        nameRu: "Материалы",
        nameEn: "Fabric",
        path: "/fiber"
    },
    {
        nameRu: "Портфолио",
        nameEn: "Portfolio",
        path: "/portfolio"
    },
    {
        nameRu: "Заказать",
        nameEn: "Order",
        path: "/order"
    },
]

interface IProps {
    lang: TLang
}


const Nav:React.FC<IProps> = (props) => {
    const [opened, setOpened] = useState(true)
    const scrollTimeout = useRef<any>()

    const navToggle = () => {
        setOpened(!opened)
    }

    const handleScroll =() => {
        scrollTimeout.current && clearTimeout(scrollTimeout.current)
        scrollTimeout.current = setTimeout(()=> {
            setOpened(window.scrollY < 400)
        }, 250)
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return(() => {
            window.removeEventListener("scroll", handleScroll);
        })
    },[])
  
    return (
        <nav className={opened ? "nav_desktop opened" : "nav_desktop"}>
            <div className="nav__container">
                <ul>
                    {pages.map((page: IPage) => {
                        return (
                            <li key={page.path}>
                                <NavLink className={({ isActive }) => {return isActive ? "selected" : ""}}
                                    to={page.path}>
                                    {props.lang === 'Ru' ? page.nameRu : page.nameEn}
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
    lang: state.lang
})
/*
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
*/
export default connect(mapStateToProps)(Nav)
