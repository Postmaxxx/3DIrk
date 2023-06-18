import { IAction, IDispatch, IErrRes, IFetch, IFullState, IImgWithThumb, IMsgRes, INewsItem, ISendNews, TLangText } from "src/interfaces"
import { actionsListNews } from './actionsList'
import { imageUploader } from "src/assets/js/imageUploader";



export const setLoadNews = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListNews.SET_LOAD_DATA_STATUS_NEWS,
    payload: payload
});


export const setSendNews = <T extends IFetch>(payload: T):IAction<T> => ({
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
        dispatch(setLoadNews({status: 'fetching', message: {en: `Loading ${amount} news`, ru: `Загрузка ${amount} новостей`},}))
        try {
            const response: Response = await fetch(`/api/news/get-some?from=${from}&amount=${amount}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadNews({
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
            dispatch(setLoadNews({status: 'success', message: {en: `News have been loaded`, ru: 'Новости были загружены успешно'}}))

        } catch (e) {
            dispatch(setLoadNews({status: 'error', message: {en: `Error occured while loading news: ${e}`, ru: `Ошибка в процессе загрузки новостей: ${e}`}}))
        }
    }
}






export const sendNews = (news: ISendNews) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token //get current user state
        dispatch(setSendNews({status: 'fetching', message: {en: '', ru: ''}}))
        const delayBetweenImagesPost = 300

        const imageUrls: IImgWithThumb[] = []
        // images to imgbb
        await news.images.reduce(async (acc: Promise<string>, image: File, i) => {
            return new Promise(async (res, rej) => {
                await acc
                                
                const newsImagePost = await imageUploader(image)
                if (newsImagePost.status !== 'success') {
                    rej(`Error while uploading image ${image.name}`)
                    return dispatch(setSendNews(newsImagePost))
                }
                imageUrls.push(newsImagePost.urls as IImgWithThumb)
                setTimeout(() => res('ok'), delayBetweenImagesPost)
            })
            
        }, Promise.resolve('start fetching images'))



        //post to db
        try {
            const newsToDb = {
                ...news,
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
                    message: result.message, 
                    errors: result.errors as TLangText[] || []
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendNews({status: 'success', message: result.message}))
            
        } catch (e) {           
            dispatch(setSendNews({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }

    }
}


export const deleteNews = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setSendNews({status: 'fetching', message: {en: '', ru: ''}, errors: []}))
        
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
                return dispatch(setSendNews({
                    status: 'error', 
                    message: result.message, 
                    errors: result.errors as TLangText[] || []
                }))
            }

            const result: IMsgRes = await response.json()
            dispatch(setSendNews({status: 'success', message: result.message}))
        } catch (e) {           
            dispatch(setSendNews({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}, errors: []}))
        }

    }
}



