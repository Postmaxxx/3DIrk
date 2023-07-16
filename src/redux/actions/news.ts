import { IAction, IDispatch, IErrRes, IFetch, IFullState, IMsgRes, INewsItem, INewsItemShort,  ISendNewsItem } from "../../interfaces"
import { actionsListNews } from './actionsList'
import { empty, fetchingFetch, successFetch } from "../../assets/js/consts";



export const setLoadNews = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_LOAD_STATUS_NEWS,
    payload: payload
});

export const setLoadOneNews = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_LOAD_STATUS_ONE_NEWS,
    payload: payload
});


export const setSendNews = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_SEND_STATUS_NEWS,
    payload: payload
});


export const setDataNews = <T extends Array<INewsItemShort>>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_DATA_NEWS,
    payload: payload
});


export const setDataOneNews = <T extends INewsItem>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_DATA_ONE_NEWS,
    payload: payload
});

export const setTotalNews = <T extends number>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_TOTAL_NEWS,
    payload: payload
});


export const loadSomeNews = (from: number, amount: number) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().news.load.status === 'fetching') return
        const news = getState().news
        dispatch(setLoadNews(fetchingFetch))
        try {
            const response: Response = await fetch(`${process.env.REACT_BACK_URL}/api/news/get-some?from=${from}&amount=${amount}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadNews({status: 'error', message: (result as IErrRes).message || {...empty}, errors: result.errors || []}))
            }
            
            const result: {news: INewsItem[], total: number} = await response.json()
            dispatch(setDataNews([...news.newsList, ...result.news.map(item => {
                return {                    
                    date: new Date(item.date),
                    _id: item._id,
                    header: item.header,
                    short: item.short,
                    text: item.text,
                    images: item.images
                }
            })]))

            
            dispatch(setTotalNews(result.total))
            dispatch(setLoadNews(successFetch))

        } catch (e) {
            dispatch(setLoadNews({status: 'error', message: {en: `Error occured while loading news: ${e}`, ru: `Ошибка в процессе загрузки новостей: ${e}`}}))
        }
    }
}





export const loadOneNews = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().news.loadOne.status === 'fetching') return
        dispatch(setLoadOneNews(fetchingFetch))
        try {
            const response: Response = await fetch(`${process.env.REACT_BACK_URL}/api/news/get-one?_id=${_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json()
                return dispatch(setLoadOneNews({status: 'error', message: (result as IErrRes).message  || {...empty}, errors: result.errors || []}))
            }
            
            const result = await response.json()
            dispatch(setDataOneNews({
                    ...result.news,
                    date: new Date(result.news.date) //changing format, check !!!
                }
            ))
            dispatch(setLoadOneNews(successFetch))
        } catch (e) {
            dispatch(setLoadOneNews({status: 'error', message: {en: `Error occured while loading this news: ${e}`, ru: `Ошибка в процессе загрузки новости: ${e}`}}))
        }
    }
}




export const sendNews = (newsItem: ISendNewsItem) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().news.send.status === 'fetching') return
        const token = getState().user.token
        dispatch(setSendNews(fetchingFetch))

        const sendForm = new FormData()   
        if (newsItem.files && newsItem.files?.length > 0) {
            newsItem.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        //post to db
        try {
            const newsToDb: Partial<INewsItem> = {
                header: {
                    en:  newsItem.header.en.trim(),
                    ru:  newsItem.header.ru.trim()
                },
                text: {
                    en:  newsItem.text.en.trim(),
                    ru:  newsItem.text.ru.trim()
                },
                short: {
                    en:  newsItem.short.en.trim(),
                    ru:  newsItem.short.ru.trim()
                },
                date: newsItem.date,
            }
            sendForm.append('news', JSON.stringify(newsToDb))

            const response: Response = await fetch(`${process.env.REACT_BACK_URL}/api/news/create`, {
                method: 'POST',
                headers: {
                    'enctype': "multipart/form-data",
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
            })

            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendNews({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors || []
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendNews({status: 'success', message: result.message || {...empty}}))
            
        } catch (e) {           
            dispatch(setSendNews({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }

    }
}






export const updateNews = (newsItem: ISendNewsItem) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().news.send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendNews(fetchingFetch))

        const sendForm = new FormData()   
        if (newsItem.files && newsItem.files?.length > 0) {
            newsItem.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }

        //post to db
        try {
            const newsToDb: Partial<INewsItem> = {
                header: {
                    en:  newsItem.header.en.trim(),
                    ru:  newsItem.header.ru.trim()
                },
                text: {
                    en:  newsItem.text.en.trim(),
                    ru:  newsItem.text.ru.trim()
                },
                short: {
                    en:  newsItem.short.en.trim(),
                    ru:  newsItem.short.ru.trim()
                },
                date: newsItem.date,
                _id: newsItem._id,
            }
            sendForm.append('news', JSON.stringify(newsToDb))
            
            const response: Response = await fetch(`${process.env.REACT_BACK_URL}/api/news/edit`, {
                method: 'PUT',
                headers: {
                    'enctype': "multipart/form-data",
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendNews({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors || []
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendNews({status: 'success', message: result.message || {...empty}}))
            
        } catch (e) {           
            dispatch(setSendNews({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }
    }
}






export const deleteNews = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().news.send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendNews(fetchingFetch))
        
        try {
            
            const response: Response = await fetch(`${process.env.REACT_BACK_URL}/api/news/delete`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({_id})
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendNews({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors || []
                }))
            }

            const result: IMsgRes = await response.json()
            dispatch(setSendNews({status: 'success', message: result.message || {...empty}}))
        } catch (e) {           
            dispatch(setSendNews({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}, errors: []}))
        }

    }
}



