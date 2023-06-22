import { IFetch, IFullState, INewsItem, TLang } from 'src/interfaces';
import './news-creator.scss'
import { FC, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import Modal, { IModalFunctions } from 'src/components/Modal/Modal';
import Message, { IMessageFunctions } from 'src/components/Message/Message';
import { useEffect, useState } from "react";
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
    const addFileBig = useRef<IAddFilesFunctions>(null)
    const modal = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)


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



    const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.parentElement?.classList.remove('error')
        e.target.id === 'header_en' &&  setState.news.setDataOneNews({...newsOne, header: {...newsOne.header, en: e.target.value.trim()}})
        e.target.id === 'header_ru' &&  setState.news.setDataOneNews({...newsOne, header: {...newsOne.header, ru: e.target.value.trim()}})
        e.target.id === 'short_en' &&  setState.news.setDataOneNews({...newsOne, short: {...newsOne.short, en: e.target.value.trim()}})
        e.target.id === 'short_ru' &&  setState.news.setDataOneNews({...newsOne, short: {...newsOne.short, ru: e.target.value.trim()}})
        e.target.id === 'text_en' &&  setState.news.setDataOneNews({...newsOne, text: {...newsOne.text, en: e.target.value.trim()}})
        e.target.id === 'text_ru' &&  setState.news.setDataOneNews({...newsOne, text: {...newsOne.text, ru: e.target.value.trim()}})
        e.target.id === 'date' &&  setState.news.setDataOneNews({...newsOne, date: e.target.value})
    }


    useEffect(() => { //if edit
        if (!paramNewsId) {
            setState.news.setDataOneNews({...newsOne, changeImages: true})
        }
        setState.news.loadOneNews(paramNewsId)
        setState.news.setDataOneNews({...newsOne, changeImages: false})
    }, [paramNewsId])



    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)
        setState.news.setDataOneNews({...newsOne, files: addFileBig.current?.getFiles()})
        



        if (paramNewsId) {
            setState.news.editNews(newsOne, newsOne.changeImages)
        } else {
            setState.news.sendNews(newsOne)
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
                                <input type="text" id="header_en" onChange={(e) => onChangeText(e)} value={newsOne.header.en}/>
                            </div>
                            <div className="input__wrapper">
                                <input type="text" id="header_ru" onChange={(e) => onChangeText(e)} value={newsOne.header.ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label htmlFor="short_en">{lang === 'en' ? 'Short text' : 'Краткий текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id="short_en" onChange={(e) => onChangeText(e)} value={newsOne.short.en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id="short_ru" onChange={(e) => onChangeText(e)} value={newsOne.short.ru}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label htmlFor="text_en">{lang === 'en' ? 'Full text' : 'Полный текст'}:</label>
                            <div className="input__wrapper">
                                <textarea id="text_en" onChange={(e) => onChangeText(e)} value={newsOne.text.en}/>
                            </div>
                            <div className="input__wrapper">
                                <textarea id="text_ru" onChange={(e) => onChangeText(e)} value={newsOne.text.ru}/>
                            </div>
                        </div>


                        <div className="input-block">
                            <label htmlFor="date">{lang === 'en' ? 'Date' : 'Дата'}:</label>
                            <input type="date" id="date" onChange={(e) => onChangeText(e)} value={newsOne.date.toISOString().slice(0, 10)}/>
                        </div>
                        {newsOne.changeImages ? 
                            <>
                                <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                                <AddFiles lang={lang} ref={addFileBig} multiple={true} id='allImages'/>
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