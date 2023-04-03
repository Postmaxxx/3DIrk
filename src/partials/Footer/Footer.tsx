import './footer.scss'
import iconInstagram from "../../assets/img/logo_instagram.svg"
import iconWhatsapp from "../../assets/img/logo_whatsapp.svg"
import iconTelegram from "../../assets/img/logo_telegram.svg"
import iconYoutube from "../../assets/img/logo_youtube.svg"


const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer__content">
                    <span className='footer__copyright'>PrintIrk © 2023</span>
                    <div className="footer__social">
                        <span>We are in socials: </span>
                        <div className="social_links">
                            <a href="#">
                                <img src={iconTelegram} alt="Our Telegram" title="Join us in Telegram"/>
                            </a>
                            <a href="#">
                                <img src={iconWhatsapp} alt="Our WhatsApp" title="Join us in WhatsApp"/>
                            </a>
                            <a href="#">
                                <img src={iconInstagram} alt="Our Instagram" title="Join us in Instagram"/>
                            </a>
                            <a href="#">
                                <img src={iconYoutube} alt="Our Youtube" title="Our Youtube channel"/>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    )
}


export default Footer;