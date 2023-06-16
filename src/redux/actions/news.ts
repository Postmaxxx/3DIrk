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



interface IPostNews {
    header: TLangText
    short: TLangText
    text: TLangText
    date: Date
    images: File[]
}


export const postNews = (news: IPostNews) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setSendDataStatusNews({status: 'fetching', message: {en: '', ru: ''}}))
        const delayBetweenImagesPost = 300

        const imageUrls: {full: string, medium: string, thumb: string, fileName: string}[] = []
        // images to imgbb
        await news.images.reduce(async (acc: Promise<string>, image: File, i) => {
            return new Promise(async (res, rej) => {
                await acc
                try {
                    let form = new FormData();
                    form.append("image", image)
        
                    const response: Response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB}`, {
                        method: 'POST',
                        body: form
                    })
        
                    const result = await response.json()
                    
                    if (!result.success) {
                        rej(`Error while uploading image ${image.name}`)
                        return dispatch(setSendDataStatusNews({status: 'error', message: {en:`Error while deploying images`, ru: `Ошибка при сохранении файлов`}}))
                    }

                    imageUrls.push({full: result.data.image?.url, medium: result.data.medium?.url, thumb: result.data.thumb?.url, fileName: image.name.split(".").slice(0,-1).join(".") || image.name})
                    setTimeout(() => res('ok'), delayBetweenImagesPost)
                   
                } catch (e) {
                    return dispatch(setSendDataStatusNews({status: 'error', message: {en:`Error while deploying images: ${e}`, ru: `Ошибка при сохранении файлов: ${e}`}}))
                }  
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
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(newsToDb)
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



