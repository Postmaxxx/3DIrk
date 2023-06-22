import { IFetch, IFullState, INewsItem, TLang } from 'src/interfaces';
import './news-creator.scss'
import { FC, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { useEffect } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from 'src/components/AddFiles/AddFiles';
import { useParams } from 'react-router-dom';
import { headerStatus, resetFetch, timeModalClosing } from 'src/assets/js/consts';
import { errorsChecker, prevent } from 'src/assets/js/processors';

interface IPropsState {
    lang: TLang
    sending: IFetch
    newsOne: INewsItem
}


interface IPropsActions {
    setState: {
        news: typeof allActions.news
    }
}


interface IProps extends IPropsState, IPropsActions {
}


const NewsCreator: FC<IProps> = ({lang, sending, newsOne, setState}): JSX.Element => {
    const paramNewsId = useParams().newsId || ''
    const addFilesBig = useRef<IAddFilesFunctions>(null)
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)

    const _header_en = useRef<HTMLInputElement>(null)
    const _header_ru = useRef<HTMLInputElement>(null)
    const _text_short_en = useRef<HTMLTextAreaElement>(null)
    const _text_short_ru = useRef<HTMLTextAreaElement>(null)
    const _text_en = useRef<HTMLTextAreaElement>(null)
    const _text_ru = useRef<HTMLTextAreaElement>(null)
    const _date = useRef<HTMLInputElement>(null)


    const onChangeImages = (e: React.MouseEvent<HTMLElement>) => {
        prevent(e)
        setState.news.setDataOneNews({...newsOne, changeImages: !newsOne.changeImages})
    }

    
    const closeModal = () => {
        modal.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        setState.news.setSendNews(resetFetch)// clear fetch status
	}


    useEffect(() => {
        if (sending.status === 'idle' || sending.status === 'fetching')  return
        const errors: string[] = sending.errors?.map(e => e[lang]) || []
        message.current?.update({
            header: headerStatus[sending.status][lang],
            status: sending.status,
            text: [sending.message[lang], ...errors]
        })
		modal.current?.openModal()
    }, [sending.status])


    useEffect(() => { //if edit
        if (!paramNewsId) {
            setState.news.setDataOneNews({...newsOne, changeImages: true})
        }
        setState.news.loadOneNews(paramNewsId)
        setState.news.setDataOneNews({...newsOne, changeImages: false})
    }, [paramNewsId])


    const errChecker = useMemo(() => errorsChecker({lang}), [lang])

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        if (!_header_en.current || !_header_ru.current  || !_text_en.current  || !_text_ru.current  || !_text_short_en.current  || 
            !_text_short_ru.current || !_date.current) return

        errChecker.check(_header_en.current, 5, 50)
        errChecker.check(_header_ru.current, 5, 50)
        errChecker.check(_text_en.current, 40, 5000)
        errChecker.check(_text_ru.current, 40, 5000)
        errChecker.check(_text_short_en.current, 20, 150)
        errChecker.check(_text_short_ru.current, 20, 150)
        errChecker.check(_date.current, 10, 10)

        if (errChecker.result().length > 0) {
            message.current?.update({                        
                header: lang === 'en' ? 'Errors in fields' : 'Найдены ошибки в полях',
                status: 'error',
                text: [...errChecker.result()]
            })
            modal.current?.openModal()
            errChecker.clear()
            return
        }
        //if no errors
        setState.news.setDataOneNews({
            ...newsOne,
            header: {
                en: _header_en.current.value,
                ru: _header_ru.current.value
            },
            short: {
                en: _text_short_en.current.value,
                ru: _text_short_ru.current.value
            },
            text: {
                en: _text_en.current.value,
                ru: _text_ru.current.value
            },
            date: new Date(_date.current.value),
            files: addFilesBig.current?.getFiles()
        })

        if (paramNewsId) {
            setState.news.editNews()
        } else {
            setState.news.sendNews()
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
                            <label>{lang === 'en' ? 'Header' : 'Заголовок'}:</label>
                            <div className="input__wrapper">
                                <input type="text" ref={_header_en} data-en="Header EN" data-ru="Заголовок EN"/>
                            </div>
                            <div className="input__wrapper">
                                <input type="text" ref={_header_ru} data-en="Header RU" data-ru="Заголовок RU"/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Short text' : 'Краткий текст'}:</label>
                            <div className="input__wrapper">
                                <textarea ref={_text_short_en} data-en="Short text EN" data-ru="Краткий текст EN"/>
                            </div>
                            <div className="input__wrapper">
                                <textarea ref={_text_short_ru} data-en="Short text RU" data-ru="Краткий текст RU"/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Full text' : 'Полный текст'}:</label>
                            <div className="input__wrapper">
                                <textarea ref={_text_en} data-en="Text EN" data-ru="Tекст EN"/>
                            </div>
                            <div className="input__wrapper">
                                <textarea ref={_text_ru} data-en="Text RU" data-ru="Tекст RU"/>
                            </div>
                        </div>


                        <div className="input-block">
                            <label>{lang === 'en' ? 'Date' : 'Дата'}:</label>
                            <input type="date" ref={_date} data-en="Date" data-ru="Дата"/>
                        </div>
                        {newsOne.changeImages ? 
                            <>
                                <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                                <AddFiles lang={lang} ref={addFilesBig} multiple={true} id='allImages'/>
                                {paramNewsId && <button className='button_blue change-images' onClick={onChangeImages}>Do not change images</button>}
                            </>
                        :
                            <>{paramNewsId && <button className='button_blue change-images' onClick={onChangeImages}>Change all images</button>}</>
                        }
                        <button className='button_blue post' disabled={sending.status === 'fetching'} onClick={e => onSubmit(e)}>{lang === 'en' ? paramNewsId ? 'Save news' : 'Post news' : paramNewsId ? "Сохранить новость" : "Отправить новость"}</button>
                    </form>
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
    sending: state.news.send,
    newsOne: state.news.newsOne
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		news: bindActionCreators(allActions.news, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(NewsCreator)