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
    const _header_en = useRef<HTMLInputElement>(null)
    const _header_ru = useRef<HTMLInputElement>(null)
    const _short_en = useRef<HTMLTextAreaElement>(null)
    const _short_ru = useRef<HTMLTextAreaElement>(null)
    const _date = useRef<HTMLInputElement>(null)
    const _text_en = useRef<HTMLTextAreaElement>(null)
    const _text_ru = useRef<HTMLTextAreaElement>(null)
	const [modal, setModal] = useState<boolean>(false)
    const [message, setMessage] = useState({header: '', status: '', text: ['']})
    const [news, setNews] = useState<Omit<INewsItem, "images"> & {images: File[]}>({
        _id: '', 
        header: {en: '', ru: ''}, 
        date: '', 
        short: {en: '', ru: ''},
        text: {en: '', ru: ''},
        images: []
    })

    const prevent = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
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
        //setFiles(files)
        setNews(prev => ({...prev, images: files}))
    }



    const loadNewsData = async (_id: string) => {
        const news = await setState.news.loadOneNews(_id)
        if (news.status === 'success') {
            //setNewsItem(news.data)
        }
        //setLoaded(true)
    }



    const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.id === 'header_en' &&  setNews(prev => ({...prev, header: {...prev.header, en: e.target.value}}))
        e.target.id === 'header_ru' &&  setNews(prev => ({...prev, header: {...prev.header, ru: e.target.value}}))
        e.target.id === 'short_en' &&  setNews(prev => ({...prev, short: {...prev.short, en: e.target.value}}))
        e.target.id === 'short_ru' &&  setNews(prev => ({...prev, short: {...prev.short, ru: e.target.value}}))
        e.target.id === 'text_en' &&  setNews(prev => ({...prev, text: {...prev.text, en: e.target.value}}))
        e.target.id === 'text_ru' &&  setNews(prev => ({...prev, text: {...prev.text, ru: e.target.value}}))
        e.target.id === 'date' &&  setNews(prev => ({...prev, date: e.target.value}))
    }


    useEffect(() => { //if edit
        if (!paramNewsId) return
        loadNewsData(paramNewsId)
    }, [])




    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        
        const news = {
            header: {
                en: _header_en.current?.value || '',
                ru: _header_ru.current?.value || '',
            },
            short: {
                en: _short_en.current?.value  || '',
                ru: _short_ru.current?.value  || '',
            },
            text: {
                en: _text_en.current?.value || '',
                ru: _text_ru.current?.value || '',
            },
            date: _date.current?.valueAsDate || new Date(),
            //images: files
        }
        
        //setState.news.sendNews(news)
    }



    return (
        <div className="page page_news-add">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Post news' : 'Добавление новости'}</h1>
                    <form>

                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="input-block">
                            <label htmlFor="header_en">{lang === 'en' ? 'Header' : 'Заголовок'}:</label>
                            <div className="input__wrapper">
                                <input type="text" id="header_en" ref={_header_en} onChange={(e) => onChangeText(e)} value={news.header.en}/>
                            </div>
                            <div className="input__wrapper">
                                <input type="text" id="header_ru" ref={_header_ru} onChange={(e) => onChangeText(e)} value={news.header.ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label htmlFor="short_en">{lang === 'en' ? 'Short text' : 'Краткий текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id="short_en" ref={_short_en} onChange={(e) => onChangeText(e)} value={news.short.en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id="short_ru" ref={_short_ru} onChange={(e) => onChangeText(e)} value={news.short.ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label htmlFor="text_en">{lang === 'en' ? 'Full text' : 'Полный текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id="text_en" ref={_text_en} onChange={(e) => onChangeText(e)} value={news.text.en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id="text_ru" ref={_text_ru} onChange={(e) => onChangeText(e)} value={news.text.ru}/>
                            </div>
                        </div>


                        <div className="input-block">
                            <label htmlFor="date">{lang === 'en' ? 'Date' : 'Дата'}:</label>
                            <input type="date" id="date" ref={_date} onChange={(e) => onChangeText(e)} value={news.date}/>
                        </div>


                        <h2 className='images__header full-width'>{lang === 'en' ? 'Images' : 'Изображения'}</h2>           
                        <AddFiles saveFiles={saveFiles} lang={lang} ref={addFiles} multiple={true} id='big'/>
                        <button className='button_blue post' disabled={sending.status === 'fetching'} onClick={e => onSubmit(e)}>{lang === 'en' ? 'Post news' : "Отправить новость"}</button>
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