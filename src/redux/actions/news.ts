import { IAction, IDispatch, IErrRes, IFetch, IFullState, IMsgRes, INewsItem, TLangText } from "src/interfaces"
import { actionsListNews } from './actionsList'



export const setLoadDataStatusNews = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_LOAD_DATA_STATUS_NEWS,
    payload: payload
});


export const setSendDataStatusNews = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_SEND_DATA_STATUS_NEWS,
    payload: payload
});


export const setDataNews = <T extends Array<INewsItem>>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_DATA_NEWS,
    payload: payload
});


export const setTotalNews = <T extends number>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_TOTAL_NEWS,
    payload: payload
});


export const loadSomeNews = (from: number, amount: number) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const news = getState().news
        if (news.load.status === 'fetching') return
        dispatch(setLoadDataStatusNews({status: 'fetching', message: {en: `Loading ${amount} news`, ru: `Загрузка ${amount} новостей`},}))
        try {
            const response: Response = await fetch(`/api/news/get-some?from=${from}&amount=${amount}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadDataStatusNews({
                    status: 'error', 
                    message: (result as IErrRes).message, 
                    errors: result.errors as TLangText[] || []
                }))
            }
            
            const result: {news: INewsItem[], total: number} = await response.json()
            dispatch(setDataNews([...news.newsList, ...result.news.map(item => {
                return {
                    ...item,
                    date: new Date(item.date),
                }
            })]))
            dispatch(setTotalNews(result.total))
            dispatch(setLoadDataStatusNews({status: 'success', message: {en: `News have been loaded`, ru: 'Новости были загружены успешно'}}))

        } catch (e) {
            dispatch(setLoadDataStatusNews({status: 'error', message: {en: `Error occured while loading news: ${e}`, ru: `Ошибка в процессе загрузки новостей: ${e}`}}))
        }
    }
}






export const postNews = (news: Omit<INewsItem, "_id">) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setSendDataStatusNews({status: 'fetching', message: {en: '', ru: ''}}))
        
        try {
            
            const response: Response = await fetch('/api/news/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(news)
            })

            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendDataStatusNews({
                    status: 'error', 
                    message: result.message, 
                    errors: result.errors as TLangText[] || []
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendDataStatusNews({status: 'success', message: result.message}))
            
        } catch (e) {           
            dispatch(setSendDataStatusNews({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }

    }
}


export const deleteNews = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setSendDataStatusNews({status: 'fetching', message: {en: '', ru: ''}, errors: []}))
        
        try {
            
            const response: Response = await fetch('/api/news/delete', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({_id})
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendDataStatusNews({
                    status: 'error', 
                    message: result.message, 
                    errors: result.errors as TLangText[] || []
                }))
            }

            const result: IMsgRes = await response.json()
            dispatch(setSendDataStatusNews({status: 'success', message: result.message}))
        } catch (e) {           
            dispatch(setSendDataStatusNews({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}, errors: []}))
        }

    }
}



