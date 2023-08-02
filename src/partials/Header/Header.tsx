import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import siteLogo from "../../assets/img/logo.png"
import './header.scss'

const Header = () => {
    return (
        <header>
            <div className="container">
                <div className="header__content">
                    <Link to="/" className="header__link"> 
                        <img src={siteLogo} alt="Our Logo"/>
                    </Link>
                    <Nav />
                </div>
            </div>
        </header>
    )
}


export default Header;