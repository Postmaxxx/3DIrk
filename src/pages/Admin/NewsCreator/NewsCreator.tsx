import { IFetch, IFullState, INewsItem, IUserState, TLang } from 'src/interfaces';
import './news-creator.scss'
import React, {  useRef } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal from 'src/components/Modal/Modal';
import MessageInfo from 'src/components/MessageInfo/MessageInfo';
import { useEffect, useState } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import { useParams } from 'react-router-dom';
import { loadOneNews } from 'src/redux/actions/news';

interface IPropsState {
    lang: TLang
    userState: IUserState
    sending: IFetch
}


interface IPropsActions {
    setState: {
        news: typeof allActions.news
    }
}



interface IProps extends IPropsState, IPropsActions {
}


const NewsCreator: React.FC<IProps> = ({lang, userState, sending, setState}): JSX.Element => {
    const paramNewsId = useParams().newsId || ''
    const addFiles = useRef<IAddFilesFunctions>(null)
	const [modal, setModal] = useState<boolean>(false)
    const [message, setMessage] = useState({header: '', status: '', text: ['']})
    const [changeImages, setChangeImages] = useState<boolean>(true)
    const [newsItem, setNewsItem] = useState<Omit<INewsItem, "images"> & {images: File[]}>({
        _id: '', 
        header: {en: '', ru: ''}, 
        date: new Date(), 
        short: {en: '', ru: ''},
        text: {en: '', ru: ''},
        images: []
    })

    const prevent = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }


    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }
    
    const closeModal = () => {
		setModal(false)
        setMessage({
            status: '',
            header: sending.status,
            text: ['']
        })
        setState.news.setSendNews({status: 'idle', message: {en: '', ru: ''}})
	}


    useEffect(() => {
        if (sending.status === 'idle' || sending.status === 'fetching')  return
        const errors: string[] = sending.errors?.map(e => e[lang]) || []
        setMessage({
            header: sending.status === 'success' ? lang === 'en' ? 'News posted' : 'Новость добавлена' : lang === 'en' ? 'Error' : 'Ошибка',
            status: sending.status,
            text: [sending.message[lang], ...errors]
        })
		setModal(true)

    }, [sending.status])



    const saveFiles = (files: File[]) => {
        setNewsItem(prev => ({...prev, images: files}))
    }



    const loadNewsData = async (_id: string) => {
        const news = await loadOneNews(_id)
        if (news.status === 'success') {
            setNewsItem(news.data)
        }
    }



    const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.id === 'header_en' &&  setNewsItem(prev => ({...prev, header: {...prev.header, en: e.target.value}}))
        e.target.id === 'header_ru' &&  setNewsItem(prev => ({...prev, header: {...prev.header, ru: e.target.value}}))
        e.target.id === 'short_en' &&  setNewsItem(prev => ({...prev, short: {...prev.short, en: e.target.value}}))
        e.target.id === 'short_ru' &&  setNewsItem(prev => ({...prev, short: {...prev.short, ru: e.target.value}}))
        e.target.id === 'text_en' &&  setNewsItem(prev => ({...prev, text: {...prev.text, en: e.target.value}}))
        e.target.id === 'text_ru' &&  setNewsItem(prev => ({...prev, text: {...prev.text, ru: e.target.value}}))
        e.target.id === 'date' &&  setNewsItem(prev => ({...prev, date: new Date(e.target.value)}))       
    }


    useEffect(() => { //if edit
        if (!paramNewsId) {
            return setChangeImages(true)
        }
        loadNewsData(paramNewsId)
        setChangeImages(false)
    }, [paramNewsId])




    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        if (paramNewsId) {
            setState.news.editNews(newsItem, changeImages)
        } else {
            setState.news.sendNews(newsItem)
        }
    }



    return (
        <div className="page page_news-add">
            <div className="container_page">
                <div className="container">
                    {paramNewsId ? 
                        <h1>{lang === 'en' ? 'Edit news' : 'Редактирование новости'}</h1>
                    :
                        <h1>{lang === 'en' ? 'Post news' : 'Добавление новости'}</h1>
                    }
                    <form>

                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="input-block">
                            <label htmlFor="header_en">{lang === 'en' ? 'Header' : 'Заголовок'}:</label>
                            <div className="input__wrapper">
                                <input type="text" id="header_en" onChange={(e) => onChangeText(e)} value={newsItem.header.en}/>
                            </div>
                            <div className="input__wrapper">
                                <input type="text" id="header_ru"onChange={(e) => onChangeText(e)} value={newsItem.header.ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label htmlFor="short_en">{lang === 'en' ? 'Short text' : 'Краткий текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id="short_en" onChange={(e) => onChangeText(e)} value={newsItem.short.en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id="short_ru" onChange={(e) => onChangeText(e)} value={newsItem.short.ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label htmlFor="text_en">{lang === 'en' ? 'Full text' : 'Полный текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id="text_en" onChange={(e) => onChangeText(e)} value={newsItem.text.en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id="text_ru" onChange={(e) => onChangeText(e)} value={newsItem.text.ru}/>
                            </div>
                        </div>


                        <div className="input-block">
                            <label htmlFor="date">{lang === 'en' ? 'Date' : 'Дата'}:</label>
                            <input type="date" id="date" onChange={(e) => onChangeText(e)} value={newsItem.date.toISOString().slice(0, 10)}/>
                        </div>

                        {changeImages ? 
                            <>
                                <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                                <AddFiles saveFiles={saveFiles} lang={lang} ref={addFiles} multiple={true} id='big'/>
                                {paramNewsId && <button className='button_blue change-images' onClick={onChangeImages}>Do not change images</button>}
                            </>
                        :
                            <>{paramNewsId && <button className='button_blue change-images' onClick={onChangeImages}>Change all images</button>}</>
                        }
                        <button className='button_blue post' disabled={sending.status === 'fetching'} onClick={e => onSubmit(e)}>{lang === 'en' ? paramNewsId ? 'Save news' : 'Post news' : paramNewsId ? "Сохранить новость" : "Отправить новость"}</button>
                    </form>
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
    userState: state.user,
    sending: state.news.send
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		news: bindActionCreators(allActions.news, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(NewsCreator)