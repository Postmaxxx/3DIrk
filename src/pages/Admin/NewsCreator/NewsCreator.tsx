import { IFetch, IFullState, INewsItem, TLang } from '../../../interfaces';
import './news-creator.scss'
import { FC, useRef, useMemo, useCallback, useState } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from '../../../components/Modal/Modal';
import Message, { IMessageFunctions } from '../../../components/Message/Message';
import { useEffect } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import { empty, headerStatus, resetFetch, timeModalClosing } from '../../../assets/js/consts';
import { errorsChecker, prevent } from '../../../assets/js/processors';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../components/Preloaders/Preloader';

interface IPropsState {
    lang: TLang
    send: IFetch
    newsOne: INewsItem
}


interface IPropsActions {
    setState: {
        news: typeof allActions.news
    }
}


interface IProps extends IPropsState, IPropsActions {
}


const NewsCreator: FC<IProps> = ({lang, send, newsOne, setState}): JSX.Element => {
    const paramNewsId = useParams().newsId || ''
    const navigate = useNavigate()
    const addFilesBig = useRef<IAddFilesFunctions>(null)
    const modal_message = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)
    const _form = useRef<HTMLFormElement>(null)
    const [changeImages, setChangeImages] = useState<boolean>(true)
    const [submit, setSubmit] = useState<boolean>(false)

    
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])

    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }

    
    const closeModalMessage = useCallback(() => {
        modal_message.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        errChecker.clear()
        
        if (send.status === 'success') {
            setState.news.setDataOneNews({
                ...newsOne,
                ...clearForm
            })
            addFilesBig.current?.clearAttachedFiles()
            if (paramNewsId) {
                navigate('/admin/news-create', { replace: true });
            }
        }
        setState.news.setSendNews(resetFetch)// clear fetch status
	}, [send.status, paramNewsId, errChecker])


    useEffect(() => {
        if (send.status === 'idle' || send.status === 'fetching')  return
        const errors: string[] = send.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[send.status][lang],
            status: send.status,
            text: [send.message[lang], ...errors]
        })
		modal_message.current?.openModal()
    }, [send.status])


    useEffect(() => { 
        if (paramNewsId) {//if edit
            setState.news.loadOneNews(paramNewsId)
            setChangeImages(false)
        } else {
            setState.news.setDataOneNews({
                ...newsOne,
                ...clearForm,
            })
            setChangeImages(true)
            addFilesBig.current?.clearAttachedFiles()
        }
    }, [paramNewsId])

    


    const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        errChecker.clearError(e.target)
        e.target.id === 'header_en' && setState.news.setDataOneNews({...newsOne, header: {...newsOne.header, en: e.target.value}})
        e.target.id === 'header_ru' && setState.news.setDataOneNews({...newsOne, header: {...newsOne.header, ru: e.target.value}})
        e.target.id === 'text_short_en' && setState.news.setDataOneNews({...newsOne, short: {...newsOne.short, en: e.target.value}})
        e.target.id === 'text_short_ru' && setState.news.setDataOneNews({...newsOne, short: {...newsOne.short, ru: e.target.value}})
        e.target.id === 'text_en' && setState.news.setDataOneNews({...newsOne, text: {...newsOne.text, en: e.target.value}})
        e.target.id === 'text_ru' && setState.news.setDataOneNews({...newsOne, text: {...newsOne.text, ru: e.target.value}})
        e.target.id === 'date' && setState.news.setDataOneNews({...newsOne, date: isNaN(Date.parse(e.target.value)) ? newsOne.date : new Date(e.target.value)}) 
    }

    const clearForm = useMemo(() => ({
        header: empty,
        text: empty,
        short: empty,
        _id: '',
        files: [],
        date: new Date(),
    }), [])



    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)   
        
        if (!_form.current) return
        console.log(errChecker.amount());
        errChecker.check(_form.current.querySelector('#header_en') as HTMLInputElement, 5, 50)
        errChecker.check(_form.current.querySelector('#header_ru') as HTMLInputElement, 5, 50)
        errChecker.check(_form.current.querySelector('#text_short_en') as HTMLInputElement, 40, 150)
        errChecker.check(_form.current.querySelector('#text_short_ru') as HTMLInputElement, 40, 150)
        errChecker.check(_form.current.querySelector('#text_en') as HTMLInputElement, 20, 5000)
        errChecker.check(_form.current.querySelector('#text_ru') as HTMLInputElement, 20, 5000)
        errChecker.check(_form.current.querySelector('#date') as HTMLInputElement, 10, 10)
        isNaN(Date.parse((_form.current.querySelector('#date') as HTMLInputElement).value)) && errChecker.add(lang === 'en' ? 'Date is wrong' : 'Дата неверная')
        console.log(errChecker.amount());
        
        
        /*if (errChecker.amount() > 0) { 
            message.current?.update(errChecker.result())
            modal_message.current?.openModal()
            return
        }*/
        //if no errors
        setState.news.setDataOneNews({
            ...newsOne,
            files: addFilesBig.current?.getFiles()
        })
        
        setSubmit(true)
    }


    useEffect(() => {
        if (!submit) return
        if (paramNewsId) {
            setState.news.updateNews()
        } else {
            setState.news.sendNews()
        }
        setSubmit(false)
    }, [submit])



    return (
        <div className="page page_news-add">
            <div className="container_page">
                <div className="container">
                    {paramNewsId ? 
                        <h1>{lang === 'en' ? 'Edit news' : 'Редактирование новости'}</h1>
                    :
                        <h1>{lang === 'en' ? 'Post news' : 'Добавление новости'}</h1>
                    }
                    <form ref={_form}>
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="input-block">
                            <label>{lang === 'en' ? 'Header' : 'Заголовок'}:</label>
                            <div className="input__wrapper">
                                <input type="text" id='header_en' data-en="Header EN" data-ru="Заголовок EN"  onChange={(e) => onChangeText(e)} value={newsOne.header.en}/>
                            </div>
                            <div className="input__wrapper">
                                <input type="text" id='header_ru' data-en="Header RU" data-ru="Заголовок RU"  onChange={(e) => onChangeText(e)} value={newsOne.header.ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Short text' : 'Краткий текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id='text_short_en' data-en="Short text EN" data-ru="Краткий текст EN"  onChange={(e) => onChangeText(e)} value={newsOne.short.en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id='text_short_ru' data-en="Short text RU" data-ru="Краткий текст RU" onChange={(e) => onChangeText(e)} value={newsOne.short.ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Full text' : 'Полный текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id='text_en' data-en="Text EN" data-ru="Tекст EN" onChange={(e) => onChangeText(e)} value={newsOne.text.en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id='text_ru' data-en="Text RU" data-ru="Tекст RU" onChange={(e) => onChangeText(e)} value={newsOne.text.ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Date' : 'Дата'}:</label>
                            <div className="input__wrapper">
                                <input type="date" id="date" data-en="Date" data-ru="Дата" onChange={(e) => onChangeText(e)} value={newsOne.date.toISOString().slice(0, 10)}/>
                            </div>
                        </div>
                        {changeImages ? 
                            <>
                                <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                                <AddFiles lang={lang} ref={addFilesBig} multiple={true} id='allImages'/>
                                {paramNewsId && <button className='button_blue change-images' onClick={onChangeImages}>Do not change images</button>}
                            </>
                        :
                            <>{paramNewsId && <button className='button_blue change-images' onClick={onChangeImages}>Change all images</button>}</>
                        }
                        <button className='button_blue post' disabled={send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {send.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? paramNewsId ? 'Save news' : 'Post news' : paramNewsId ? "Сохранить новость" : "Отправить новость"}</>
                            }
                        </button>
                    </form>
                </div>
                <Modal escExit={true} ref={modal_message} onClose={closeModalMessage}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={message}/>
                </Modal>
            </div>

        </div>
    )
}





const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    send: state.news.send,
    newsOne: state.news.newsOne
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		news: bindActionCreators(allActions.news, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(NewsCreator)