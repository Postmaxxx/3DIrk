import { IFetch, IFullState, INewsItem, ISendNewsItem, TLang } from '../../../interfaces';
import './news-creator.scss'
import { FC, useRef, useCallback } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { useEffect } from "react";
import { allActions } from "../../../redux/actions/all";
import AddFiles, { IAddFilesFunctions } from '../../../components/AddFiles/AddFiles';
import { inputsProps, navList, newsItemEmpty, resetFetch } from '../../../assets/js/consts';
import { filesDownloader, modalMessageCreator, prevent } from '../../../assets/js/processors';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { IModalFunctions } from '../../../../src/components/Modal/ModalNew';
import MessageNew from '../../../../src/components/Message/MessageNew';
import Uploader from '../../../../src/components/Preloaders/Uploader';
import BlockInput, { IBlockInputFunctions } from '../../../components/BlockInput/BlockInput';

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
    const _headerEn = useRef<IBlockInputFunctions>(null)
    const _headerRu = useRef<IBlockInputFunctions>(null)
    const _textShortEn = useRef<IBlockInputFunctions>(null)
    const _textShortRu = useRef<IBlockInputFunctions>(null)
    const _textEn = useRef<IBlockInputFunctions>(null)
    const _textRu = useRef<IBlockInputFunctions>(null)
    const _date = useRef<IBlockInputFunctions>(null)
    
  
    const closeModal = useCallback(async () => {   
        if (await modal?.getName() === 'newsSend') {
            if (send.status === 'success') {
                navigate(navList.account.admin.news.to, { replace: true })
                fillValues({...newsItemEmpty})
            }
            setState.news.setSendNews({...resetFetch})
        }
        setState.news.setSendNews(resetFetch)// clear fetch status
        modal?.closeCurrent()
	}, [send.status, paramNewsId, modal])




    useEffect(() => {
        if (send.status === 'success' || send.status === 'error') {
            modal?.closeName('newsSending');
            modal?.openModal({
                name: 'newsSend',
                onClose: closeModal,
                children: <MessageNew {...modalMessageCreator(send, lang)} buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}/>
            })
        }
        if (send.status === 'fetching') {
            modal?.openModal({
                name: 'newsSending',
                closable: false,
                onClose: closeModal,
                children: <Uploader text={lang === 'en' ? "Sending news, please wait..." : "Отправка новости, пожалуйста ждите..."}/>
            })
        }
    }, [send.status])



    useEffect(() => { 
        if (paramNewsId) {//if edit
            if (loadOne.status !== 'success' && loadOne.status  !== 'fetching') {
                setState.news.loadOneNews(paramNewsId)
            }
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

    

   
    const fillValues = async (news: INewsItem) => {//fill values based on selected color
        if (!_headerEn.current || !_headerRu.current || !_textShortEn.current || !_textShortRu.current || 
            !_textEn.current || !_textRu.current || !_date.current) return
        if (paramNewsId) { //news exists
            const files = await filesDownloader(
                news.images.files.map(file => (`${news.images.basePath}/${news.images.sizes[news.images.sizes.length - 1].subFolder}/${file}`))
            )
            addFilesRef.current?.replaceFiles(files)
        } else { //new news
            addFilesRef.current?.clearAttachedFiles()
        }
        
        _headerEn.current.setValue(news?.header?.en || '')
        _headerRu.current.setValue(news?.header?.ru || '')
        _textShortEn.current.setValue(news?.short?.en || '')
        _textShortRu.current.setValue(news?.short?.ru || '')
        _textEn.current.setValue(news?.text?.en || '')
        _textRu.current.setValue(news?.text?.ru || '')
        _date.current.setValue(dayjs(news?.date || '').format('YYYY-MM-DD'))
    }
    




    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        prevent(e)   
        if (!_form.current || !_headerEn.current || !_headerRu.current || !_textShortEn.current || !_textShortRu.current || !_textEn.current ||
            !_textRu.current || !_date.current ) return

        //check errors
        const errors: string[] = [_headerEn, _headerRu, _textShortEn, _textShortRu, _textEn, _textRu, _date]
            .map(el => el.current?.getErrorText(lang))
            .filter(el => el) as string[]
        if (addFilesRef.current?.getFiles().length === 0) {
            errors.push(lang === 'en' ? 'No images' : 'Нет изображений')
        }    
    
        if (errors.length > 0) { //show modal with error
            return modal?.openModal({
                name: 'errorsInForm',
                onClose: closeModal,
                children: <MessageNew 
                    header={lang === 'en' ? 'Errors was found' : 'Найдены ошибки'}
                    status={'error'}
                    text={errors}
                    buttonClose={{action: closeModal, text: lang === 'en' ? 'Close' : 'Закрыть'}}
                />
            })
        }

        //if no errors
        const newsItem: ISendNewsItem = {
            _id: paramNewsId || '',
            header: {
                en: _headerEn.current.getValue() || 'Error',
                ru: _headerRu.current.getValue() || 'Error',
            },
            text: {
                en: _textEn.current.getValue() || 'Error',
                ru: _textRu.current.getValue() || 'Error',
            },
            short: {
                en: _textShortEn.current.getValue() || 'Error',
                ru: _textShortRu.current.getValue() || 'Error',
            },
            date: new Date(_date.current.getValue() || 'Error'),
            files: addFilesRef.current?.getFiles() || []
        }
        setState.news.sendNews(newsItem)
    }




    return (
        <div className="page page_creator_news">
            <div className="container_page">
                <div className="container">
                    {paramNewsId ? 
                        <h1>{lang === 'en' ? 'Edit news' : 'Редактирование новости'}</h1>
                    :
                        <h1>{lang === 'en' ? 'Post news' : 'Добавление новости'}</h1>
                    }
                    <form className='form_full form_add-news' ref={_form}>
                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Add information' : 'Добавьте информацию'}</h3>
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Header en', ru: 'Заголовок en'}}
                                required
                                id="header_en"
                                rules={{min:inputsProps.news.header.min, max:inputsProps.news.header.max}}
                                ref={_headerEn}
                            />
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Header ru', ru: 'Заголовок ru'}}
                                required
                                id="header_ru"
                                rules={{min:inputsProps.news.header.min, max:inputsProps.news.header.max}}
                                ref={_headerRu}
                            />
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Short text en', ru: 'Краткий текст en'}}
                                required
                                typeElement="textarea"
                                id="text_short_en"
                                rules={{min:inputsProps.news.textShort.min, max:inputsProps.news.textShort.max}}
                                ref={_textShortEn}
                            />
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Short text ru', ru: 'Краткий текст ru'}}
                                required
                                typeElement="textarea"
                                id="text_short_ru"
                                rules={{min:inputsProps.news.textShort.min, max:inputsProps.news.textShort.max}}
                                ref={_textShortRu}
                            />
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Full text en', ru: 'Полный текст en'}}
                                required
                                typeElement="textarea"
                                id="text_en"
                                rules={{min:inputsProps.news.textFull.min, max:inputsProps.news.textFull.max}}
                                ref={_textEn}
                            />
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Full text ru', ru: 'Полный текст ru'}}
                                required
                                typeElement="textarea"
                                id="text_ru"
                                rules={{min:inputsProps.news.textFull.min, max:inputsProps.news.textFull.max}}
                                ref={_textRu}
                            />
                        </div>
                        <div className="form__inputs form__inputs_sm-wide">
                            <BlockInput
                                lang={lang}
                                labelText={{en: 'Date', ru: 'Дата'}}
                                required
                                inputType='date'
                                typeElement="input"
                                id="news_date"
                                rules={{type: "date"}}
                                ref={_date}
                            />
                        </div>
                        <div className="block_text">
                            <h3>{lang === 'en' ? 'Add images' : 'Добавьте изображения'}</h3>
                        </div>
                        <div className="form__inputs">
                            <AddFiles lang={lang} ref={addFilesRef} multiple={true} id='newsImages'/>
                        </div>


                        <button className='button_blue button_light' disabled={send.status === 'fetching'} onClick={e => onSubmit(e)}>
                            {lang === 'en' ? paramNewsId ? 'Save news' : 'Post news' : paramNewsId ? "Сохранить новость" : "Отправить новость"}
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