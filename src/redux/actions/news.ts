import { IAction, IDispatch, IErrRes, IFetch, IFullState, INewsItem, INewsItemShort,  ISendNewsItem } from "../../interfaces"
import { actionsListNews } from './actionsList'
import { APIList, DOMExceptions, fetchingFetch, successFetch } from "../../assets/js/consts";
import { fetchError, resErrorFiller } from "../../../src/assets/js/processors";



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
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.news.getSome.timeout) //set time limit for fetch
        dispatch(setLoadNews({...fetchingFetch, controller}))  
        const news = getState().news
        try {
            const response: Response = await fetch(`${APIList.news.getSome.url}?from=${from}&amount=${amount}`, {
                signal: controller.signal,
                method: APIList.news.getSome.method,
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadNews(resErrorFiller(result)))
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
            dispatch(setLoadNews({...successFetch}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setLoadNews,
                controller,
                comp: {en: 'loading news', ru: 'загрузки новостей'}
            })
        }
    }
}





export const loadOneNews = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.news.getOne.timeout) //set time limit for fetch
        dispatch(setLoadOneNews({...fetchingFetch, controller}))  
        try {
            const response: Response = await fetch(`${APIList.news.getOne.url}?_id=${_id}`, {
                signal: controller.signal,
                method: APIList.news.getOne.method,
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json()
                return dispatch(setLoadOneNews(resErrorFiller(result)))
            }
            clearTimeout(fetchTimeout)
            const result = await response.json()
            dispatch(setDataOneNews({
                    ...result.news,
                    date: new Date(result.news.date) //changing format, check !!!
                }
            ))
            dispatch(setLoadOneNews({...successFetch}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setLoadOneNews,
                controller,
                comp: {en: 'loading this news', ru: 'загрузки этой новости'}
            })
        }
    }
}




export const sendNews = (newsItem: ISendNewsItem) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.news.create.timeout) //set time limit for fetch
        dispatch(setLoadOneNews({...fetchingFetch, controller})) 
        dispatch(setSendNews(fetchingFetch))

        const sendForm = new FormData()   
        const {files, ...newsToSend} = newsItem //exclude files from data
        sendForm.append('news', JSON.stringify(newsToSend))
        if (newsItem.files && newsItem.files?.length > 0) {
            newsItem.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        try {
            const response: Response = await fetch(APIList.news.create.url, {
                signal: controller.signal,
                method: APIList.news.create.method,
                headers: {
                    'enctype': "multipart/form-data",
                    'Authorization': `Bearer ${getState().user.token}`
                },
                body: sendForm
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendNews(resErrorFiller(result)))
            }
            dispatch(setSendNews({...successFetch}))
        } catch (e) {  
            fetchError({ 
                e,
                dispatch,
                setter: setSendNews,
                controller,
                comp: {en: 'creating news', ru: 'создания новости'}
            })         
        }
    }
}





export const updateNews = (newsItem: ISendNewsItem, changeImages: boolean) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.news.update.timeout) //set time limit for fetch
        dispatch(setSendNews({...fetchingFetch, controller})) 
        const token = getState().user.token //get current user state
        const sendForm = new FormData()   
        const {files, ...newsToSend} = newsItem //exclude files from data
        sendForm.append('data', JSON.stringify(newsToSend))
        if (changeImages) {
            newsItem.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        try {
            const response: Response = await fetch(APIList.news.update.url, {
                signal: controller.signal,
                method: APIList.news.update.method,
                headers: {
                    'enctype': "multipart/form-data",
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendNews(resErrorFiller(result)))
            }
            dispatch(setSendNews({...successFetch}))
        } catch (e) {   
            fetchError({ 
                e,
                dispatch,
                setter: setSendNews,
                controller,
                comp: {en: 'updating news', ru: 'редактирования новости'}
            })          
        }
    }
}






export const deleteNews = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.news.delete.timeout) //set time limit for fetch
        dispatch(setSendNews({...fetchingFetch, controller})) 
        try {
            const response: Response = await fetch(APIList.news.delete.url, {
                signal: controller.signal,
                method: APIList.news.delete.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getState().user.token}`
                },
                body: JSON.stringify({_id})
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendNews(resErrorFiller(result)))
            }
            dispatch(setSendNews({...successFetch}))
        } catch (e) {  
            fetchError({ 
                e,
                dispatch,
                setter: setSendNews,
                controller,
                comp: {en: 'deleting news', ru: 'удаления новости'}
            })            
        }
    }
}



