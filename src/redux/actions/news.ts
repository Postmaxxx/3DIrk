import { IAction, IDispatch, IErrRes, IFetch, IFullState, IImgWithThumb, IMsgRes, INewsItem, INewsItemShort, ISendNews, IUserState, TLangText } from "src/interfaces"
import { actionsListNews } from './actionsList'
import { imageUploader, imagesUploader } from "src/assets/js/imageUploader";
import { delayBetweenImagesPost, empty, errorFetch, fetchingFetch, successFetch } from "src/assets/js/consts";



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
        const load = getState().news.load
        if (load.status === 'fetching') return
        const news = getState().news
        if (news.load.status === 'fetching') return
        dispatch(setLoadNews(fetchingFetch))
        try {
            const response: Response = await fetch(`/api/news/get-some?from=${from}&amount=${amount}`, {
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
        const load = getState().news.loadOne
        if (load.status === 'fetching') return
        const news = getState().news
        if (news.loadOne.status === 'fetching') return
        dispatch(setLoadOneNews(fetchingFetch))
        try {
            const response: Response = await fetch(`/api/news/get-one?_id=${_id}`, {
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




export const sendNews = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const send = getState().news.send
        if (send.status === 'fetching') return
        const { newsOne } = getState().news
        const token = getState().user.token
        dispatch(setSendNews(fetchingFetch))


        const imageUrls:IImgWithThumb[] = []
        // images to imgbb
        if (newsOne.files && newsOne.files?.length > 0) {
            const resultUrls = await imagesUploader({files: newsOne.files, dispatch, errorHandler: setSendNews})
            if (resultUrls.err.en) {
                return dispatch(setSendNews({...errorFetch, message: resultUrls.err || {...empty}}))
            }
            imageUrls.concat([...resultUrls.urls])
        }


        //post to db
        try {
            const newsToDb: Partial<INewsItem> = {
                header: {
                    en:  newsOne.header.en.trim(),
                    ru:  newsOne.header.ru.trim()
                },
                text: {
                    en:  newsOne.text.en.trim(),
                    ru:  newsOne.text.ru.trim()
                },
                short: {
                    en:  newsOne.short.en.trim(),
                    ru:  newsOne.short.ru.trim()
                },
                date: newsOne.date,
                images: imageUrls
            }

            const response: Response = await fetch('/api/news/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newsToDb)
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






export const updateNews = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const send = getState().news.send
        if (send.status === 'fetching') return
        const { newsOne } = getState().news
        const token = getState().user.token //get current user state
        dispatch(setSendNews(fetchingFetch))

        const imageUrls:IImgWithThumb[] = []
        // images to imgbb
        if (newsOne.files && newsOne.files?.length > 0) {
            const resultUrls = await imagesUploader({files: newsOne.files, dispatch, errorHandler: setSendNews})
            if (resultUrls.err.en) {
                return dispatch(setSendNews({...errorFetch, message: resultUrls.err || {...empty}}))
            }
            imageUrls.concat([...resultUrls.urls])
        }


        //post to db
        try {
            const newsToDb: Partial<INewsItem> = {
                header: {
                    en:  newsOne.header.en.trim(),
                    ru:  newsOne.header.ru.trim()
                },
                text: {
                    en:  newsOne.text.en.trim(),
                    ru:  newsOne.text.ru.trim()
                },
                short: {
                    en:  newsOne.short.en.trim(),
                    ru:  newsOne.short.ru.trim()
                },
                date: newsOne.date,
                _id: newsOne._id,
                images: imageUrls
            }
            if (!newsOne.changeImages) {//if don't need change images => delete field at all,in this case BE will not update images
                delete newsToDb.images
            }
            
            const response: Response = await fetch('/api/news/edit', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newsToDb)
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






export const deleteNews = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const send = getState().news.send
        if (send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendNews(fetchingFetch))
        
        try {
            
            const response: Response = await fetch('/api/news/delete', {
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



