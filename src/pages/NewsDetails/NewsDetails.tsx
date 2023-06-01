import { IFullState, INewsItem, INewsState, TLang } from '../../interfaces'
import './news-details.scss'
import { loadAllNews } from "../../redux/actions/news"
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import Preloader from '../../components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useRef, useEffect, useState, useMemo } from "react";
import mockNews from '../../redux/mocks/news';
import SpliderCommon from '../../components/Spliders/Common/SpliderCommon';

const actionsListNews = { loadAllNews }

interface IPropsState {
	news: INewsState
    lang: TLang
}

interface IPropsActions {
    setState: {
        news: typeof actionsListNews,
    }
}

interface IProps extends IPropsState, IPropsActions {}


const NewsDetails: React.FC<IProps> = ({lang, news }): JSX.Element => {
    const paramNewsId = useParams().newsId || ''
    const navigate = useNavigate()
    const [loaded, setLoaded] = useState<boolean>(false)
    const [newsPiece, setNewsPiece] = useState<INewsItem | undefined>(undefined)
    

    const loadNewsPiece = async (id: INewsItem['id']) => {
        new Promise<INewsItem>((res, rej) => {
            setTimeout(() => {
                const newsPieceFound = mockNews.find(newsPiece => newsPiece.id === id)
                newsPieceFound ? res(newsPieceFound) : rej()
            }, 500)
        })
            .then((result) => {
                setNewsPiece(result)
                setLoaded(true)
            })
            .catch((err) => {
                setNewsPiece(undefined)
                setLoaded(true)
            })
    }


    useEffect(() => {
        if (news.dataLoading.status === 'success') {
            const newsPieceFound = news.newsList.find(newsPiece => newsPiece.id === paramNewsId)
            if (newsPieceFound) {
                setNewsPiece(newsPieceFound)
                setLoaded(true)
            } 
        } else {
            loadNewsPiece(paramNewsId)
        }
    }, [])

    
    return (
        <div className="page page_news-details">
            <div className="container_page">
                <div className="container">
                    {loaded ? 
                        <>
                            {newsPiece ? 
                                <>
                                    <h1>{newsPiece.header[lang]}</h1>
                                    <span className='date'>{String(newsPiece.date.toISOString().slice(0, 10))}</span>
                                    <div className="news__details">
                                        <>
                                            {newsPiece.text[lang].map((text, i) => {
                                                return <p key={i}>{text.part}</p>
                                            })}
                                            <div className="images__container">
                                                <SpliderCommon images={newsPiece.imgs} lang={lang} imagesPerSlide={2}/>
                                            </div>
                                        </>
                                    </div>
                                </>
                            :
                                <>
                                    <h1>{lang === 'en' ? 'News was not found' : 'Запрашиваемая новость не найднена'}</h1>
                                </>
                            }
                            <button className="button_blue button_back" onClick={() => navigate(-1)}>
                                <svg width="24" height="16" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.6875 8.72615C24.0885 8.34643 24.1058 7.71351 23.7261 7.31246L17.5384 0.777062C17.1586 0.376018 16.5257 0.358725 16.1247 0.738437C15.7236 1.11815 15.7063 1.75108 16.086 2.15212L21.5863 7.96137L15.777 13.4616C15.376 13.8413 15.3587 14.4743 15.7384 14.8753C16.1181 15.2763 16.7511 15.2936 17.1521 14.9139L23.6875 8.72615ZM0.342942 8.38133L22.9727 8.99962L23.0273 7.00036L0.397565 6.38207L0.342942 8.38133Z"/>
                                </svg>
                                {lang === 'en' ? 'Back' : 'Вернуться'}
                            </button>
                        </>
                    :
                        <Preloader />}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    news: state.news
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
        news: bindActionCreators(actionsListNews, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetails);