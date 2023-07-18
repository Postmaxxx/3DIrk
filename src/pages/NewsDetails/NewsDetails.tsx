import { IFullState, INewsItem, INewsState, TLang } from '../../interfaces'
import './news-details.scss'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import Preloader from '../../components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useRef, useEffect, FC, useMemo, useCallback } from "react";
import SpliderCommon from '../../components/Spliders/Common/SpliderCommon';
import { allActions } from "../../redux/actions/all";
import Delete from '../../components/Delete/Delete';
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import Message, { IMessageFunctions } from '../../components/Message/Message';
import IconEdit from '../../components/tiny/IconEdit/IconEdit';
import { resetFetch, timeModalClosing } from '../../assets/js/consts';
import { modalMessageCreator } from '../../../src/assets/js/processors';


interface IPropsState {
    lang: TLang
    isAdmin: boolean
    newsState: INewsState
}


interface IPropsActions {
    setState: {
        news: typeof allActions.news
    }
}

interface IProps extends IPropsState, IPropsActions {}


const NewsDetails: FC<IProps> = ({lang, setState, newsState, isAdmin }): JSX.Element => {
    const paramNewsId = useParams().newsId || ''
    const navigate = useNavigate()
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)


    useEffect(() => {
        setState.news.loadOneNews(paramNewsId)
        return () => {setState.news.setLoadOneNews(resetFetch)}
    }, [paramNewsId])


    const onDelete = (item: INewsItem) => {
        setState.news.deleteNews(item._id)
    }


    const closeModal = useCallback(() => {
        modalRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        setState.news.setSendNews(resetFetch)
        if (newsState.send.status === 'success') {
            navigate('/', { replace: true });
            window.location.reload()
        }
	}, [newsState.send.status])


    useEffect(() => { 
        if (newsState.send.status === 'success' || newsState.send.status === 'error') {//if admin delete news
            messageRef.current?.update(modalMessageCreator(newsState.send, lang))
            modalRef.current?.openModal()
        }
        if (newsState.loadOne.status === 'error') { //if fail to load news
            messageRef.current?.update(modalMessageCreator(newsState.loadOne, lang))
            modalRef.current?.openModal()
        }
    }, [newsState.send.status, newsState.loadOne.status])


    
    const renderNews = useMemo(() => {
        return (
            <>
                {newsState.loadOne.status === 'success' &&
                    <>
                        <div className="block_text">
                            <h1>{newsState.newsOne.header[lang]}</h1>
                            <span className='date'>{String(newsState.newsOne.date.toISOString().slice(0, 10))}</span>
                        </div>
                        <div className="news__details">
                            <>
                                <div className="block_text">
                                    {newsState.newsOne.text[lang].split('\n').map((text, i) => {
                                        return <p key={i}>{text}</p>
                                    })}
                                </div>
                                <div className="images__container">
                                    <SpliderCommon images={newsState.newsOne.images} defaultSize='medium' imagesPerSlide={Math.min(newsState.newsOne.images.files.length, 3)}/>
                                </div>
                            </>
                        </div>
                    </>}
                {newsState.loadOne.status === 'fetching' && <Preloader />}
                {newsState.loadOne.status === 'error' && <h1>{lang === 'en' ? 'News was not found' : 'Запрашиваемая новость не найдена'}</h1>}
            </>
        )
    }, [lang, newsState.newsOne, newsState.loadOne.status])


    const renderButtons = useMemo(() => {
        return (
            <div className="buttons">
                {isAdmin && newsState.newsOne && newsState.loadOne.status === 'success' &&
                    <NavLink className="button_edit" to={`../../admin/news-create/${newsState.newsOne._id}`}>
                        <IconEdit />
                    </NavLink>}
                <button className="button_blue button_back" onClick={() => navigate(-1)}>
                    <svg width="24" height="16" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.6875 8.72615C24.0885 8.34643 24.1058 7.71351 23.7261 7.31246L17.5384 0.777062C17.1586 0.376018 16.5257 0.358725 16.1247 0.738437C15.7236 1.11815 15.7063 1.75108 16.086 2.15212L21.5863 7.96137L15.777 13.4616C15.376 13.8413 15.3587 14.4743 15.7384 14.8753C16.1181 15.2763 16.7511 15.2936 17.1521 14.9139L23.6875 8.72615ZM0.342942 8.38133L22.9727 8.99962L23.0273 7.00036L0.397565 6.38207L0.342942 8.38133Z"/>
                    </svg>
                    {lang === 'en' ? 'Back' : 'Вернуться'}
                </button>
                {isAdmin && newsState.newsOne && newsState.loadOne.status === 'success' && 
                    <Delete<INewsItem> remove={onDelete} idInstance={newsState.newsOne} lang={lang} disabled={newsState.send.status === 'fetching'}/>}
            </div>
        )
    }, [newsState.newsOne, isAdmin, lang, newsState.send.status, newsState.loadOne.status])





    return (
        <div className="page page_news-details">
            <div className="container_page">
                <div className="container">
                    {renderNews}
                    {renderButtons}
                </div>
                <Modal escExit={true} ref={modalRef}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={messageRef}/>
                </Modal>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    isAdmin: state.user.isAdmin,
    newsState: state.news,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		news: bindActionCreators(allActions.news, dispatch),
	}
})
  

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetails);