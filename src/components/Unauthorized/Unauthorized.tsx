import { TLang } from "src/interfaces"
import './unauthorized.scss'

const Unauthorized = ({lang}: {lang: TLang}) => {
    return (
        <div className="unauthorized__container">
            <span>{lang === 'en' ? "You are not authorized" : "Вы не авторизованы"}</span>
        </div>
    )
}

export default Unauthorized