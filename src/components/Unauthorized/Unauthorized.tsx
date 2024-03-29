import { TLang } from "src/interfaces"
import './unauthorized.scss'

const Unauthorized = ({lang}: {lang: TLang}) => {
    return (
        <div className="unauthorized">
            <div className="container">
                <div className="block_text">
                    <p>{lang === 'en' ? "You are not authorized. Please login to get premissions to see this page" : "Вы не авторизованы. Пожалуйста, войдите чтобы отобразить страницу"}</p>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized