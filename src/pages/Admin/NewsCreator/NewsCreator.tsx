import { IFetch, IFullState, IUserState, TLang } from 'src/interfaces';
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
    const [files, setFiles] = useState<File[]>([])


    const prevent = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }


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
            images: files
        }
        
        setState.news.sendNews(news)
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
        setFiles(files)
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
                                <input type="text" id="header_en" ref={_header_en}/>
                            </div>
                            <div className="input__wrapper">
                                <input type="text" id="header_ru" ref={_header_ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label htmlFor="short_en">{lang === 'en' ? 'Short text' : 'Краткий текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id="short_en" ref={_short_en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id="short_ru" ref={_short_ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label htmlFor="full_en">{lang === 'en' ? 'Full text' : 'Полный текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id="full_en" ref={_text_en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id="full_ru" ref={_text_ru}/>
                            </div>
                        </div>


                        <div className="input-block">
                            <label htmlFor="date">{lang === 'en' ? 'Date' : 'Дата'}:</label>
                            <input type="date" id="date" ref={_date}/>
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