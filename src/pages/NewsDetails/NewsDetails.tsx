import { IFetch, IFullState, INewsItem, TLang } from '../../interfaces'
import './news-details.scss'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import Preloader from '../../components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useRef, useEffect, FC, useMemo, useCallback } from "react";
import SpliderCommon from '../../components/Spliders/Common/SpliderCommon';
import { allActions } from "../../redux/actions/all";
import Delete from 'src/components/Delete/Delete';
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import IconEdit from 'src/components/tiny/IconEdit/IconEdit';
import { headerStatus, resetFetch, timeModalClosing } from 'src/assets/js/consts';


interface IPropsState {
    lang: TLang
    isAdmin: boolean
    send: IFetch
    loadOne: IFetch,
    newsOne: INewsItem
}


interface IPropsActions {
    setState: {
        news: typeof allActions.news
    }
}

interface IProps extends IPropsState, IPropsActions {}


const NewsDetails: FC<IProps> = ({lang, setState, send, loadOne, newsOne, isAdmin }): JSX.Element => {
    const paramNewsId = useParams().newsId || ''
    
    const navigate = useNavigate()
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)

    useEffect(() => {
        setState.news.loadOneNews(paramNewsId)
        return () => {setState.news.setLoadOneNews(resetFetch)}
    }, [paramNewsId])


    const onDelete = (item: INewsItem) => {
        setState.news.deleteNews(item._id)
    }


    const closeModal = useCallback(() => {
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (send.status === 'success') {
            setState.news.setSendNews(resetFetch)
            navigate('/', { replace: true });
            window.location.reload()
        } else {
            setState.news.setSendNews(resetFetch)
        }
	}, [send.status])


    useEffect(() => { //if admin delete news
        if (send.status === 'success' || send.status === 'error') {
            const errors: string[] = send.errors?.map(e => e[lang]) || []
            message.current?.update({                        
                header: headerStatus[send.status][lang],
                status: send.status,
                text: [send.message[lang], ...errors]
            })
            modal.current?.openModal()
        }
        if (loadOne.status === 'error') { //if any fail to load news
            const errors: string[] = loadOne.errors?.map(e => e[lang]) || []
            message.current?.update({                        
                header: headerStatus[loadOne.status][lang],
                status: loadOne.status,
                text: [loadOne.message[lang], ...errors]
            })
            modal.current?.openModal()
        }
    }, [send.status, loadOne.status])


    
    const renderNews = useMemo(() => {
        return (
            newsOne && loadOne.status === 'success' ? 
                <>
                    <div className="block_text">
                        <h1>{newsOne.header[lang]}</h1>
                        <span className='date'>{String(newsOne.date.toISOString().slice(0, 10))}</span>
                    </div>
                    <div className="news__details">
                        <>
                            <div className="block_text">
                                {newsOne.text[lang].split('\n').map((text, i) => {
                                    return <p key={i}>{text}</p>
                                })}
                            </div>
                            <div className="images__container">
                                <SpliderCommon images={newsOne.images} imagesPerSlide={Math.min(newsOne.images.length, 3)}/>
                            </div>
                        </>
                    </div>
                </>
            :
                <h1>{lang === 'en' ? 'News was not found' : 'Запрашиваемая новость не найдена'}</h1>
            )
    }, [lang, newsOne, loadOne.status])


    const renderButtons = useMemo(() => {
        return (
            <div className="buttons">
                {isAdmin && newsOne && loadOne.status === 'success' ? 
                    <NavLink className="button_edit"
                        to={`../../admin/news-create/${newsOne._id}`}
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
                {isAdmin && newsOne && loadOne.status === 'success' ? 
                    <Delete<INewsItem> remove={onDelete} idInstance={newsOne} lang={lang} disabled={send.status === 'fetching'}/>
                :
                    null    
                }
            </div>
        )
    }, [newsOne, isAdmin, lang, send.status, loadOne.status])





    return (
        <div className="page page_news-details">
            <div className="container_page">
                <div className="container">
                    {loadOne.status === 'success' || loadOne.status === 'error' ? 
                        <>
                            {renderNews}
                            {renderButtons}
                        </>
                    :
                        <Preloader />}
                </div>
                <Modal escExit={true} ref={modal}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={message}/>
                </Modal>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    isAdmin: state.user.isAdmin,
    send: state.news.send,
    loadOne: state.news.loadOne,
    newsOne: state.news.newsOne
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		news: bindActionCreators(allActions.news, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetails);