import './news_block.scss'
import { useState, useEffect, Fragment } from 'react'
import { connect } from "react-redux";
import News from '../News/News'
import { IFullState, INewsState, TLang } from 'src/interfaces'
import { AnyAction, Dispatch, bindActionCreators } from 'redux';
import Preloader from '../Preloader/Preloader';
import { loadNews }  from "../../redux/actions/news"

const actionsList = { loadNews }

interface IPropsState {
    lang: TLang,
    news: INewsState
}

interface IPropsActions {
    setState: {
        news: typeof actionsList
    }
}

interface IProps extends IPropsState, IPropsActions {}

const NewsBlock:React.FC<IProps>  = ({lang, news, setState}): JSX.Element => {
    const [newsDisplayed, setNewsDisplayed] = useState<number>(4)

    const showMoreNews = () => {
        setNewsDisplayed(prev => (Math.min(prev + 4, news.newsList?.length)))
    }

    useEffect(()=> {
        if (news.dataLoading.status === 'idle') {
            setState.news.loadNews()
        }
    },[])

    return (
        <>
            <h2>{lang === 'en' ? 'Recent news' : 'Последние новости'}</h2>
            <div className="news-block">
                {news.dataLoading.status === 'success' ? 
                <>
                    {news.newsList.map((news, i) => (
                        <Fragment key={i}>
                            {i < newsDisplayed && <News news={news} lang={lang}/>}
                        </Fragment>
                    ))}
                    <div className="break-new-line"></div>
                    {news.newsList.length > newsDisplayed && (
                        <button className='show-more-news' onClick={showMoreNews}>
                            <svg width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
                            </svg>
                                <span>{lang === 'en' ? 'Show more news' : 'Показать еще новости'}</span> 
                            <svg width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
                            </svg>
                        </button>
                    )}
                </> 
                :
                <Preloader/>
                }
            </div>
        </>
    )
}




const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    news: state.news,
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		news: bindActionCreators(actionsList, dispatch)
	}
})
  
export default connect(mapStateToProps, mapDispatchToProps)(NewsBlock)
