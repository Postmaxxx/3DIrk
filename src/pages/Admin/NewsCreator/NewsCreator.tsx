import { IFetch, IFullState, INewsItem, ISendNewsItem, TLang } from '../../../interfaces';
import './news-creator.scss'
import { FC, useRef, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { useEffect } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import { inputsProps, navList, newsItemEmpty, resetFetch } from '../../../assets/js/consts';
import { checkAndLoad, errorsChecker, filesDownloader, focusMover, modalMessageCreator, prevent } from '../../../assets/js/processors';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../components/Preloaders/Preloader';
import inputChecker from "../../../../src/assets/js/inputChecker";
import moment from 'moment';
import { IModalFunctions } from '../../../../src/components/Modal/ModalNew';
import MessageNew from '../../../../src/components/Message/MessageNew';

interface IPropsState {
    lang: TLang
    send: IFetch
    newsOne: INewsItem
    loadOne: IFetch
    modal: IModalFunctions | null
}


interface IPropsActions {
    setState: {
        news: typeof allActions.news
    }
}


interface IProps extends IPropsState, IPropsActions {}


const NewsCreator: FC<IProps> = ({lang, send, newsOne, loadOne, modal, setState}): JSX.Element => {
    const paramNewsId = useParams().newsId || ''
    const navigate = useNavigate()
    const addFilesRef = useRef<IAddFilesFunctions>(null)
    const _form = useRef<HTMLFormElement>(null)
    const _headerEn = useRef<HTMLInputElement>(null)
    const _headerRu = useRef<HTMLInputElement>(null)
    const _textShortEn = useRef<HTMLTextAreaElement>(null)
    const _textShortRu = useRef<HTMLTextAreaElement>(null)
    const _textEn = useRef<HTMLTextAreaElement>(null)
    const _textRu = useRef<HTMLTextAreaElement>(null)
    const _date = useRef<HTMLInputElement>(null)
    
    const focuser = useMemo(() => focusMover(), [lang])
    const errChecker = useMemo(() => errorsChecker({lang}), [lang])


    
    const closeModal = useCallback(() => {
        if (modal?.getName() === 'newsSend') {
            if (send.status === 'success') {
                navigate(navList.account.admin.news.to, { replace: true });
            }
            setState.news.setSendNews({...resetFetch})
        }
        setState.news.setSendNews(resetFetch)// clear fetch status
        errChecker.clear()
        modal?.closeCurrent()
	}, [send.status, paramNewsId, errChecker])




    useEffect(() => {
        if (send.status === 'idle' || send.status === 'fetching')  return
        modal?.openModal({
            name: 'newsSend',
            onClose: closeModal,
            children: <MessageNew {...modalMessageCreator(send, lang)} buttonClose={{action: closeModal, text: 'Close'}}/>
        })
    }, [send.status])



    useEffect(() => { 
        if (paramNewsId) {//if edit
            checkAndLoad({
                fetchData: loadOne,
                loadFunc: setState.news.loadOneNews,
                args: [paramNewsId],
                force: true
            })
        } else { //if create
            setState.news.setDataOneNews({...newsItemEmpty})
            fillValues({...newsItemEmpty})
        }
        return () => {setState.news.setLoadOneNews(resetFetch)}
    }, [paramNewsId])


    useEffect(() => {
        if (loadOne.status === 'success') {
            fillValues(newsOne)           
        }
    }, [loadOne])

    

    const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        (e.target as HTMLElement).parentElement?.classList.remove('incorrect-value') 
    }




    
    const fillValues = async (news: INewsItem) => {//fill values based on selected color
        console.log(paramNewsId, news.header.en);
        
        if (!_headerEn.current || !_headerRu.current || !_textShortEn.current || !_textShortRu.current || 
            !_textEn.current || !_textRu.current || !_date.current) return
        if (paramNewsId) { //news exists
            const files = await filesDownloader(
                news.images.files.map(file => (`${news.images.paths.full}/${file}`))
            )
            addFilesRef.current?.replaceFiles(files)
        } else { //new news
            addFilesRef.current?.clearAttachedFiles()
        }
        
        _headerEn.current.value = news?.header?.en || ''
        _headerRu.current.value = news?.header?.ru || ''
        _textShortEn.current.value = news?.short?.en || ''
        _textShortRu.current.value = news?.short?.ru || ''
        _textEn.current.value = news?.text?.en || ''
        _textRu.current.value = news?.text?.ru || ''
        _date.current.value =  moment(news?.date || '').format('YYYY-MM-DD')
    }



    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)   
        if (!_form.current || !_headerEn.current || !_headerRu.current || !_textShortEn.current || !_textShortRu.current || !_textEn.current ||
            !_textRu.current || !_date.current ) return
        focuser.focusAll(); //run over all elements to get all errors
        const errorFields = _form.current.querySelectorAll('.incorrect-value')
        if (errorFields && errorFields?.length > 0) {
            errChecker.add(lang === 'en' ? 'Some fields are filled incorrectly' : 'Некоторые поля заполнены неправильно')
        }    
        if (errChecker.amount() > 0) {
            modal?.openModal({
                name: 'errorChecker',
                onClose: closeModal,
                children: <MessageNew {...errChecker.result()} buttonClose={{action: closeModal, text: 'Close'}}/>
            })
            return
        }   
        //if no errors
        const newsItem: ISendNewsItem = {
            _id: paramNewsId || '',
            header: {
                en: _headerEn.current.value,
                ru: _headerRu.current.value,
            },
            text: {
                en: _textEn.current.value,
                ru: _textRu.current.value,
            },
            short: {
                en: _textShortEn.current.value,
                ru: _textShortRu.current.value,
            },
            date: new Date(_date.current.value),
            files: addFilesRef.current?.getFiles() || []
        }
        setState.news.sendNews(newsItem)
    }




    useEffect(() => {       
        if (!_form.current) return
        focuser.create({container: _form.current})
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
                    <form ref={_form}>
                        <div className="input-block_header">
                            <span></span>
                            <h3 className='lang'>EN</h3>
                            <h3 className='lang'>RU</h3>
                        </div>
                        <div className="input-block">
                            <label>{lang === 'en' ? 'Header' : 'Заголовок'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    ref={_headerEn}
                                    data-selector="input"
                                    type="text" 
                                    id='header_en' 
                                    onChange={onChangeInputs}
                                    onKeyDown={focuser.next} 
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.header.min, max:inputsProps.news.header.max, el: e.target})}/>
                            </div>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    ref={_headerRu}
                                    data-selector="input"
                                    type="text" 
                                    id='header_ru' 
                                    onChange={onChangeInputs} 
                                    onKeyDown={focuser.next}
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.header.min, max:inputsProps.news.header.max, el: e.target})}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Short text' : 'Краткий текст'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <textarea 
                                    ref={_textShortEn}
                                    data-selector="input"
                                    id='text_short_en' 
                                    onChange={onChangeInputs} 
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.textShort.min, max:inputsProps.news.textShort.max, el: e.target})}/>
                            </div>
                            <div className="input__wrapper" data-selector="input-block">
                                <textarea 
                                    ref={_textShortRu}
                                    data-selector="input"
                                    id='text_short_ru' 
                                    onChange={onChangeInputs} 
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.textShort.min, max:inputsProps.news.textShort.max, el: e.target})}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Full text' : 'Полный текст'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <textarea 
                                    ref={_textEn}
                                    data-selector="input"
                                    id='text_en' 
                                    onChange={onChangeInputs} 
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.textFull.min, max:inputsProps.news.textFull.max, el: e.target})}/>
                            </div>
                            <div className="input__wrapper" data-selector="input-block">
                                <textarea 
                                    ref={_textRu}
                                    data-selector="input"
                                    id='text_ru' 
                                    onChange={onChangeInputs} 
                                    onBlur={(e) => inputChecker({lang, min:inputsProps.news.textFull.min, max:inputsProps.news.textFull.max, el: e.target})}/>
                            </div>
                        </div>

                        <div className="input-block">
                            <label>{lang === 'en' ? 'Date' : 'Дата'}:</label>
                            <div className="input__wrapper" data-selector="input-block">
                                <input 
                                    ref={_date}
                                    data-selector="input"
                                    type="date" 
                                    id="date" 
                                    onChange={onChangeInputs} 
                                    onKeyDown={focuser.next}
                                    //value={newsItem.date.toISOString().slice(0, 10)}
                                    onBlur={(e) => inputChecker({lang, type: "date", el: e.target})}/>
                            </div>
                        </div>
                        <h2 className='section-header full-width'>{lang === 'en' ? 'IMAGES' : 'ИЗОБРАЖЕНИЯ'}</h2>           
                        <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='allImages'/>
                        <button className='button_blue post' disabled={send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {send.status === 'fetching' ? 
                                <Preloader />
                            :
                                <>{lang === 'en' ? paramNewsId ? 'Save news' : 'Post news' : paramNewsId ? "Сохранить новость" : "Отправить новость"}</>
                            }
                        </button>
                    </form>
                </div>
            </div>

        </div>
    )
}





const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    send: state.news.send,
    newsOne: state.news.newsOne,
    loadOne: state.news.loadOne,
    modal: state.base.modal.current
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		news: bindActionCreators(allActions.news, dispatch),
	}
})
  

    
export default connect(mapStateToProps, mapDispatchToProps)(NewsCreator)