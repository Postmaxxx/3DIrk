import { INewsItem, TLang } from "../../interfaces";
import './news.scss'
import { NavLink } from "react-router-dom";
import ImgWithPreloader from "../../assets/js/ImgWithPreloader";
import Delete from "../Delete/Delete";


interface IProps {
    newsPiece: INewsItem 
    lang: TLang
}


const News:React.FC<IProps> = ({newsPiece, lang}):JSX.Element => {
    return (
        <div className="news card">
            <div className="img__container">
                {newsPiece.images[0]?.thumb ? 
                    <ImgWithPreloader src={newsPiece.images[0].thumb} alt={newsPiece.header[lang]} />
                :
                    null
                }
            </div>
            <div className="news_text">
                <span>{String(newsPiece.date.toISOString().slice(0, 10))}</span>
                <h3>{newsPiece.header[lang]}</h3>
            </div>
            <p>{newsPiece.short[lang]}</p>
            <NavLink
                className="button_news"
                to={`news/${newsPiece._id}`}
                key={newsPiece._id}
                >
                    {lang === 'en' ? 'Read more...' : 'Подробнее...'}
                    <svg width="24" height="16" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.6875 8.72615C24.0885 8.34643 24.1058 7.71351 23.7261 7.31246L17.5384 0.777062C17.1586 0.376018 16.5257 0.358725 16.1247 0.738437C15.7236 1.11815 15.7063 1.75108 16.086 2.15212L21.5863 7.96137L15.777 13.4616C15.376 13.8413 15.3587 14.4743 15.7384 14.8753C16.1181 15.2763 16.7511 15.2936 17.1521 14.9139L23.6875 8.72615ZM0.342942 8.38133L22.9727 8.99962L23.0273 7.00036L0.397565 6.38207L0.342942 8.38133Z"/>
                    </svg>
            </NavLink>
        </div>
    )
}

export default (News)  