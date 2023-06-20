import { IFetch, IFullState, IMessageModal, INewsItem, INewsState, TLang } from '../../interfaces'
import './news-details.scss'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import Preloader from '../../components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useRef, useEffect, useState, useMemo } from "react";
import SpliderCommon from '../../components/Spliders/Common/SpliderCommon';
import { allActions } from "../../redux/actions/all";
import Delete from 'src/components/Delete/Delete';
import Modal from "../../components/Modal/Modal";
import MessageInfo from 'src/components/MessageInfo/MessageInfo';
import { loadOneNews } from 'src/redux/actions/news';
import Edit from 'src/components/tiny/IconEdit/IconEdit';
import IconEdit from 'src/components/tiny/IconEdit/IconEdit';


interface IPropsState {
    lang: TLang
    isAdmin: boolean
    send: IFetch
}


interface IPropsActions {
    setState: {
        news: typeof allActions.news
    }
}

interface IProps extends IPropsState, IPropsActions {}


const NewsDetails: React.FC<IProps> = ({lang, setState, send, isAdmin }): JSX.Element => {
    const paramNewsId = useParams().newsId || ''
    const navigate = useNavigate()
    const [loaded, setLoaded] = useState<boolean>(false)
    const [newsItem, setNewsItem] = useState<INewsItem>()
	const [modal, setModal] = useState<boolean>(false)
    const [message, setMessage] = useState<IMessageModal>({header: '', status: '', text: []})

    const loadNews = async (_id: string) => {
        const news = await loadOneNews(_id)
        if (news.status === 'success') {
            setNewsItem(news.data)
        }
        setLoaded(true)
    }



    useEffect(() => {
        loadNews(paramNewsId)
    }, [])


    const onDelete = (item: INewsItem) => {
        setState.news.deleteNews(item._id)
    }


    const closeModal = () => {
		setModal(false)
        if (send.status === 'success') {
            setState.news.setSendNews({status: 'idle', message: {en: '', ru: ''}})
            navigate('/', { replace: true });
            window.location.reload()
        } else {
            setState.news.setSendNews({status: 'idle', message: {en: '', ru: ''}})
        }
	}


    useEffect(() => {
        if (send.status === 'success' || send.status === 'error') {
            const errors: string[] = send.errors?.map(e => e[lang]) || []
            setMessage({
                header: send.status === 'success' ? lang === 'en' ? 'Success' : 'Успех' : lang === 'en' ? 'Error' : 'Ошибка',
                status: send.status,
                text: [send.message[lang], ...errors]
            })
            setModal(true)
        }
    }, [send.status])
    


    return (
        <div className="page page_news-details">
            <div className="container_page">
                <div className="container">
                    {loaded ? 
                        <>
                            {newsItem ? 
                                <>
                                    <h1>{newsItem.header[lang]}</h1>
                                    <span className='date'>{String(newsItem.date.toISOString().slice(0, 10))}</span>
                                    <div className="news__details">
                                        <>
                                            {newsItem.text[lang].split('\n').map((text, i) => {
                                                return <p key={i}>{text}</p>
                                            })}
                                            <div className="images__container">
                                                <SpliderCommon images={newsItem.images} imagesPerSlide={Math.min(newsItem.images.length, 3)}/>
                                            </div>
                                        </>
                                    </div>
                                </>
                            :
                                <>
                                    <h1>{lang === 'en' ? 'News was not found' : 'Запрашиваемая новость не найднена'}</h1>
                                </>
                            }
                            <div className="buttons">
                                {isAdmin && newsItem ? 
                                    <NavLink className="button_edit"
                                        to={`../../admin/news-create/${newsItem._id}`}
                                    >
                                        <IconEdit />
                                    </NavLink>
                                :
                                    null    
                                }
                                <button className="button_blue button_back" onClick={() => navigate(-1)}>
                                    <svg width="24" height="16" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.6875 8.72615C24.0885 8.34643 24.1058 7.71351 23.7261 7.31246L17.5384 0.777062C17.1586 0.376018 16.5257 0.358725 16.1247 0.738437C15.7236 1.11815 15.7063 1.75108 16.086 2.15212L21.5863 7.96137L15.777 13.4616C15.376 13.8413 15.3587 14.4743 15.7384 14.8753C16.1181 15.2763 16.7511 15.2936 17.1521 14.9139L23.6875 8.72615ZM0.342942 8.38133L22.9727 8.99962L23.0273 7.00036L0.397565 6.38207L0.342942 8.38133Z"/>
                                    </svg>
                                    {lang === 'en' ? 'Back' : 'Вернуться'}
                                </button>
                                {isAdmin && newsItem ? 
                                    <Delete<INewsItem> remove={onDelete} idInstance={newsItem} lang={lang} disabled={send.status === 'fetching'}/>
                                :
                                    null    
                                }
                            </div>
                        </>
                    :
                        <Preloader />}
                </div>
                <Modal {...{visible: modal, close: closeModal, escExit: true}}>
                    <MessageInfo {...{  
                            status: message.status,
                            header: message.header,
                            text: message.text, 
                            buttonText: lang === 'en' ? 'Close' : "Закрыть", 
                            buttonAction: closeModal
                        }}/>
                </Modal> 
            </div>
        </div>
    )
}

const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    isAdmin: state.user.isAdmin,
    send: state.news.send
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		news: bindActionCreators(allActions.news, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetails);