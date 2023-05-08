import { IAction, IDataLoading, IDispatch, INewsItem } from "src/interfaces"
import mockNews from '../mocks/news'


export const LOAD_NEWS= 'LOAD_NEWS'
export const SET_DATA_NEWS= 'SET_DATA_NEWS'
export const SET_LOAD_DATA_STATUS_NEWS= 'SET_LOAD_DATA_STATUS_NEWS'


export const setLoadDataStatusNews = <T extends IDataLoading>(payload: T):IAction<T> => ({
    type: SET_LOAD_DATA_STATUS_NEWS,
    payload: payload
});


export const setDataNews = <T extends Array<INewsItem>>(payload: T):IAction<T> => ({
    type: SET_DATA_NEWS,
    payload: payload
});


export const loadNews = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusNews({status: 'loading', message: `Loading news`}))
        try {
            const data: INewsItem[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    res(mockNews)
                }, 500)
            })

            dispatch(setLoadDataStatusNews({status: 'success', message: `News loaded`}))
            dispatch(setDataNews(data))
        } catch (e) {
            dispatch(setLoadDataStatusNews({status: 'error', message: `ERROR while loading news: ${e}`}))
        }
    }
}