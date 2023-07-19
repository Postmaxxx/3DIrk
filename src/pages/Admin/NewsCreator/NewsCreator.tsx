import { IFetch, IFullState, INewsItem, ISendNewsItem, TLang } from '../../../interfaces';
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
import { empty, headerStatus, inputsProps, navList, newsItemEmpty, resetFetch, timeModalClosing } from '../../../assets/js/consts';
import { errorsChecker, focusMover, modalMessageCreator, prevent } from '../../../assets/js/processors';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../components/Preloaders/Preloader';
import inputChecker from "../../../../src/assets/js/inputChecker";

interface IPropsState {
    lang: TLang
    send: IFetch
}


interface IPropsActions {
    setState: {
        news: typeof allActions.news
    }
}


interface IProps extends IPropsState, IPropsActions {
}


const NewsCreator: FC<IProps> = ({lang, send, setState}): JSX.Element => {
    const paramNewsId = useParams().newsId || ''
    const navigate = useNavigate()
    const addFilesBigRef = useRef<IAddFilesFunctions>(null)
    const modalRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)
    const _form = useRef<HTMLFormElement>(null)
    const [changeImages, setChangeImages] = useState<boolean>(true)
    const [submit, setSubmit] = useState<boolean>(false)
    const [newsItem, setNewsItem] = useState<ISendNewsItem>({...newsItemEmpty})
    const processedContainer = '[data-selector="news-form"]'
    
    const focuser = useMemo(() => focusMover(), [lang])
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])


    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setChangeImages(prev => !prev)
    }

    
    const closeModal = useCallback(() => {
        modalRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (modalRef.current?.getOwner() === 'sender') {
            if (send.status === 'success') {
                setNewsItem({...clearForm})
                addFilesBigRef.current?.clearAttachedFiles()
                if (paramNewsId) {
                    navigate(navList.account.admin.news.to, { replace: true });
                }
            }
            setState.news.setSendNews({...resetFetch})
            errChecker.clear()
        }
        if (modalRef.current?.getOwner() === 'errorChecker') {
            errChecker.clear()
        }
        setState.news.setSendNews(resetFetch)// clear fetch status
	}, [send.status, paramNewsId, errChecker])




    useEffect(() => {
        if (send.status === 'idle' || send.status === 'fetching')  return
        messageRef.current?.update(modalMessageCreator(send, lang))
		modalRef.current?.openModal("sender")
    }, [send.status])



    useEffect(() => { 
        if (paramNewsId) {//if edit
            setState.news.loadOneNews(paramNewsId)
            setChangeImages(false)
        } else {
            setNewsItem({...clearForm})
            setChangeImages(true)
            addFilesBigRef.current?.clearAttachedFiles()
        }
    }, [paramNewsId])

    


    const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //  errChecker.clearError(e.target)
        e.target.id === 'header_en' && setNewsItem(prev => ({...prev, header: {...prev.header, en: e.target.value}}))
        e.target.id === 'header_ru' && setNewsItem(prev => ({...prev, header: {...prev.header, ru: e.target.value}}))
        e.target.id === 'text_short_en' && setNewsItem(prev => ({...prev, short: {...prev.short, en: e.target.value}}))
        e.target.id === 'text_short_ru' && setNewsItem(prev => ({...prev, short: {...prev.short, ru: e.target.value}}))
        e.target.id === 'text_en' && setNewsItem(prev => ({...prev, text: {...prev.text, en: e.target.value}}))
        e.target.id === 'text_ru' && setNewsItem(prev => ({...prev, text: {...prev.text, ru: e.target.value}}))
        e.target.id === 'date' && setNewsItem(prev => ({...prev, date: isNaN(Date.parse(e.target.value)) ? prev.date : new Date(e.target.value)}) )
    }

    const clearForm = useMemo(() => ({...newsItemEmpty}), [])



    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)   
        if (!_form.current) return
        focuser.focusAll(); //run over all elements to get all errors
        const errorFields = document.querySelector(processedContainer)?.querySelectorAll('.incorrect-value')
        if (errorFields && errorFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields are filled incorrectly' : 'Некоторые поля заполнены неправильно')
        }    
        if (errChecker.amount() > 0) {
            messageRef.current?.update(errChecker.result())
            modalRef.current?.openModal("errorChecker")
            return
        }   
        //if no errors
        setNewsItem(prev => ({...prev, files: addFilesBigRef.current?.getFiles() || []}))
        setSubmit(true)
    }


    useEffect(() => {
        if (!submit) return
        paramNewsId ? setState.news.updateNews(newsItem) : setState.news.sendNews(newsItem)
        setSubmit(false)
    }, [submit])


    useEffect(() => {       
        focuser.create({container: processedContainer})
    }, [lang])


    return (
        <div className="page page_creator_fiber">
            <div className="container_page">
                <div className="container">
                    {paramNewsId ? 
                        <h1>{lang === 'en' ? 'Edit news' : 'Редактирование новости'}</h1>
                    :
                        <h1>{lang === 'en' ? 'Post news' : 'Добавление новости'}</h1>
                    }
                    <form ref={_form} data-selector="news-form">
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="input-block">
                            <label>{lang === 'en' ? 'Header' : 'Заголовок'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    data-selector="input"
                                    type="text" 
                                    id='header_en' 
                                    onChange={(e) => onChangeText(e)}
                                    onKeyDown={(e) => focuser.next(e)} 
                                    value={newsItem.header.en}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.header.min, max:inputsProps.news.header.max, el: e.target})}/>
                            </div>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    data-selector="input"
                                    type="text" 
                                    id='header_ru' 
                                    onChange={(e) => onChangeText(e)} 
                                    onKeyDown={(e) => focuser.next(e)}
                                    value={newsItem.header.ru}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.header.min, max:inputsProps.news.header.max, el: e.target})}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Short text' : 'Краткий текст'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <textarea 
                                    data-selector="input"
                                    id='text_short_en' 
                                    onChange={(e) => onChangeText(e)} 
                                    onKeyDown={(e) => focuser.next(e)}
                                    value={newsItem.short.en}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.textShort.min, max:inputsProps.news.textShort.max, el: e.target})}/>
                            </div>
                            <div className="input__wrapper" data-selector="input-block">
                                <textarea 
                                    data-selector="input"
                                    id='text_short_ru' 
                                    onChange={(e) => onChangeText(e)} 
                                    onKeyDown={(e) => focuser.next(e)}
                                    value={newsItem.short.ru}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.textShort.min, max:inputsProps.news.textShort.max, el: e.target})}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Full text' : 'Полный текст'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <textarea 
                                    data-selector="input"
                                    id='text_en' 
                                    onChange={(e) => onChangeText(e)} 
                                    onKeyDown={(e) => focuser.next(e)}
                                    value={newsItem.text.en}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.textFull.min, max:inputsProps.news.textFull.max, el: e.target})}/>
                            </div>
                            <div className="input__wrapper" data-selector="input-block">
                                <textarea 
                                    data-selector="input"
                                    id='text_ru' 
                                    onChange={(e) => onChangeText(e)} 
                                    onKeyDown={(e) => focuser.next(e)}
                                    value={newsItem.text.ru}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.textFull.min, max:inputsProps.news.textFull.max, el: e.target})}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Date' : 'Дата'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    data-selector="input"
                                    type="date" 
                                    id="date" 
                                    onChange={(e) => onChangeText(e)} 
                                    onKeyDown={(e) => focuser.next(e)}
                                    value={newsItem.date.toISOString().slice(0, 10)}
                                    onBlur={(e) => inputChecker({lang, type: "date", el: e.target})}/>
                            </div>
                        </div>
                        {changeImages ? 
                            <>
                                <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                                <AddFiles lang={lang} ref={addFilesBigRef} multiple={true} id='allImages'/>
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
                <Modal escExit={true} ref={modalRef} onClose={closeModal}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModal} ref={messageRef}/>
                </Modal>
            </div>

        </div>
    )
}





const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    send: state.news.send,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		news: bindActionCreators(allActions.news, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(NewsCreator)