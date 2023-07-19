import { IAction, IDispatch, IErrRes, IFetch, IFullState, IMsgRes, INewsItem, INewsItemShort,  ISendNewsItem } from "../../interfaces"
import { actionsListNews } from './actionsList'
import { APIList, empty, fetchingFetch, successFetch } from "../../assets/js/consts";



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
            const response: Response = await fetch(`${APIList.news.getSome.url}?from=${from}&amount=${amount}`, {
                method: APIList.news.getSome.method,
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
            const response: Response = await fetch(`${APIList.news.getOne.url}?_id=${_id}`, {
                method: APIList.news.getOne.method,
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
        const {files, ...newsToSend} = newsItem //exclude files from data
        sendForm.append('news', JSON.stringify(newsToSend))
        if (newsItem.files && newsItem.files?.length > 0) {
            newsItem.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        try {
            const response: Response = await fetch(APIList.news.create.url, {
                method: APIList.news.create.method,
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





export const updateNews = (newsItem: ISendNewsItem, changeImages: boolean) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().news.send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendNews(fetchingFetch))

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
                method: APIList.news.update.method,
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
            const response: Response = await fetch(APIList.news.delete.url, {
                method: APIList.news.delete.method,
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



