import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import siteLogo from "../../assets/img/logo.png"
import './header.scss'

const Header = () => {
    //console.log("header render");
   
    return (
        <header>
            <div className="container">
                <div className="header__content">
                    <Link to="/" className="logo-link"> 
                        <img src={siteLogo} alt="Our Logo" width={70} height={70}/>
                    </Link>
                    <Nav />
                </div>
            </div>
        </header>
    )
}


export default Header;