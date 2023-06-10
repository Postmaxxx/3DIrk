import { IAction, IDispatch, IErrRes, IFetch, IFullState, INewsItem, TLangText } from "src/interfaces"
import mockNews from '../mocks/news'
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


export const loadAllNews = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusNews({status: 'fetching', message: {en: `Loading news`, ru: 'Загрузка новостей'}, errors: []}))
        try {
            const data: INewsItem[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    res(mockNews)
                }, 1000)
            })
            dispatch(setLoadDataStatusNews({status: 'success', message: {en: `News have been loaded`, ru: 'Новости были загружены успешно'}, errors: []}))
            dispatch(setDataNews(data))
        } catch (e) {
            dispatch(setLoadDataStatusNews({status: 'error', message: {en: `Error occured while loading news: ${e}`, ru: `Ошибка в процессе загрузки новостей: ${e}`}, errors: []}))
        }
    }
}


export const postNews = (news: Omit<INewsItem, "id">) => {
    console.log(111);
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setSendDataStatusNews({status: 'fetching', message: {en: '', ru: ''}, errors: []}))
        
        try {
            
            const response: Response = await fetch('/api/news/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(news)
            })

            const result: IErrRes = await response.json() //message, errors
            if (response.status !== 201) {
                return dispatch(setSendDataStatusNews({
                    status: 'error', 
                    message: result.message, 
                    errors: result.errors as TLangText[] || []
                }))
            }

            
            dispatch(setSendDataStatusNews({status: 'success', message: result.message, errors: []}))
            
            
            
        } catch (e) {
            dispatch(setSendDataStatusNews({status: 'error', message: (e as IErrRes).message, errors: []}))
        }

    }
}


