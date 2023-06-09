import { IAction, IDataLoading, IDataSending, IDispatch, IFullState, IMsgErrRes, INewsItem } from "src/interfaces"
import mockNews from '../mocks/news'
import { actionsListNews } from './actionsList'



export const setLoadDataStatusNews = <T extends IDataLoading>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_LOAD_DATA_STATUS_NEWS,
    payload: payload
});


export const setSendDataStatusNews = <T extends IDataSending>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_SEND_DATA_STATUS_NEWS,
    payload: payload
});


export const setDataNews = <T extends Array<INewsItem>>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_DATA_NEWS,
    payload: payload
});


export const loadAllNews = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusNews({status: 'loading', message: `Loading news`}))
        try {
            const data: INewsItem[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    res(mockNews)
                }, 1000)
            })
            dispatch(setLoadDataStatusNews({status: 'success', message: `News loaded`}))
            dispatch(setDataNews(data))
        } catch (e) {
            dispatch(setLoadDataStatusNews({status: 'error', message: `ERROR while loading news: ${e}`}))
        }
    }
}


export const postNews = (news: Omit<INewsItem, "id">) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setSendDataStatusNews({status: 'sending', message: `Sending news`}))
        
        try {
            const response: Response = await fetch('/api/news/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(news)
            })

            const result: IMsgErrRes = await response.json() //message, errors

            if (response.status !== 201) {
                dispatch(setSendDataStatusNews({status: 'error', message: `Error while posting news: ${result.message}`}))
            }

            dispatch(setSendDataStatusNews({status: 'success', message: `News has been posted`}))


            
        } catch (error) {
            dispatch(setSendDataStatusNews({status: 'error', message: `Error while posting news: ${error}`}))
        }

    }
}


