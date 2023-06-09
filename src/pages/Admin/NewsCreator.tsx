import { IDataSending, IFullState, INewsItem, IUserState, TLang } from 'src/interfaces';
import './news-creator.scss'
import {  useRef } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { postNews } from "../../redux/actions/news"

const actionsListNews = { postNews }

interface IPropsState {
    lang: TLang
    userState: IUserState
    sending: IDataSending
}


interface IPropsActions {
    setState: {
        news: typeof actionsListNews
    }
}



interface IProps extends IPropsState, IPropsActions {
}


const NewsCreator: React.FC<IProps> = ({lang, userState, sending, setState}): JSX.Element => {

    const _header_en = useRef<HTMLInputElement>(null)
    const _header_ru = useRef<HTMLInputElement>(null)
    const _short_en = useRef<HTMLTextAreaElement>(null)
    const _short_ru = useRef<HTMLTextAreaElement>(null)
    const _date = useRef<HTMLInputElement>(null)
    const _text_en = useRef<HTMLTextAreaElement>(null)
    const _text_ru = useRef<HTMLTextAreaElement>(null)
    const _images = useRef<HTMLTextAreaElement>(null)


    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

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
            imgs: _images.current?.value || ''
        }
        
        setState.news.postNews(news)


    }

    return (
        <div className="page page_news-add">
            <div className="container_page">
                <div className="container">
                    <h1>{lang === 'en' ? 'Post news' : 'Добавление новости'}</h1>
                    <form>
                        <h3>EN</h3>
                        <h3>RU</h3>
                        <div className="input-item">
                            <label htmlFor="header-en">{lang === 'en' ? 'Header (EN)' : 'Заголовок (EN)'}:</label>
                            <input type="text" id="header-en" ref={_header_en}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="header-ru">{lang === 'en' ? 'Header (RU)' : 'Заголовок (RU)'}:</label>
                            <input type="text" id="header-ru" ref={_header_ru}/>
                        </div>

                        <div className="input-item">
                            <label htmlFor="short-en">{lang === 'en' ? 'Short text (EN)' : 'Краткий текст (EN)'}:</label>
                            <textarea id="short-en"  ref={_short_en}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="short-ru">{lang === 'en' ? 'Short text (RU)' : 'Краткий текст (RU)'}:</label>
                            <textarea id="short-ru"  ref={_short_ru}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="text">{lang === 'en' ? 'Full text (EN)' : 'Полный текст (EN)'}:</label>
                            <textarea id="text" ref={_text_en}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="text">{lang === 'en' ? 'Full text (RU)' : 'Полный текст (RU)'}:</label>
                            <textarea id="text" ref={_text_ru}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="images">{lang === 'en' ? 'Images' : 'Изображения'}:</label>
                            <textarea id="images" ref={_images}/>
                        </div>
                        <span></span>
                        <div className="input-item">
                            <label htmlFor="date">{lang === 'en' ? 'Date' : 'Дата'}:</label>
                            <input type="date" id="date" ref={_date}/>
                        </div>
                        <span></span>

                        <button className='button_blue' disabled={sending.status === 'sending'} onClick={e => onSubmit(e)}>{lang === 'en' ? 'Post news' : "Отправить новость"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}





const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    userState: state.user,
    sending: state.news.dataSending
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		news: bindActionCreators(actionsListNews, dispatch),
	}
})

    
export default connect(mapStateToProps, mapDispatchToProps)(NewsCreator)