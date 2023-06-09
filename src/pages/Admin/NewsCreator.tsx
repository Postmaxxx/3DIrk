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
    const _images = useRef<HTMLInputElement>(null)


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
                en: (_text_en.current?.value as string).split('\n').map(str => ({part: str})),
                ru: (_text_ru.current?.value as string).split('\n').map(str => ({part: str})),
            },
            date: _date.current?.valueAsDate || new Date(),
            //images: _images.current?.files?.[0] as Blob,
        }
        
        setState.news.postNews(news)


    }

    return (
        <div className="page page_news-add">
            <div className="container_page">
                <div className="container">
                    <form>
                        <div className="input-item">
                            <label htmlFor="header-en">Header</label>
                            <input type="text" id="header-en" ref={_header_en}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="header-ru">Заголовок</label>
                            <input type="text" id="header-ru" ref={_header_ru}/>
                        </div>

                        <div className="input-item">
                            <label htmlFor="short-en">Short text</label>
                            <textarea id="short-en"  ref={_short_en}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="short-ru">Краткий текст</label>
                            <textarea id="short-ru"  ref={_short_ru}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="text">Text</label>
                            <textarea id="text" ref={_text_en}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="text">Текст</label>
                            <textarea id="text" ref={_text_ru}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor="images">Images</label>
                            <input 
                                type="file" 
                                multiple 
                                id="images" 
                                name="images"
                                ref={_images}
                                accept="image/png, image/jpeg, image/jpg, image/webp"/>
                        </div>
                        
                        <div className="input-item">
                            <label htmlFor="date">Date</label>
                            <input type="date" id="date" ref={_date}/>
                        </div>

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