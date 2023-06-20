import { IAction, IDispatch, IErrRes, IFetch, IFullState, IImgWithThumb, IMsgRes, INewsItem, ISendNews, IUserState, TLangText } from "src/interfaces"
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
                return dispatch(setLoadNews({status: 'error', message: (result as IErrRes).message, errors: result.errors}))
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
            dispatch(setLoadNews({status: 'success', message: {en: `News have been loaded`, ru: 'Новости были загружены успешно'}}))

        } catch (e) {
            dispatch(setLoadNews({status: 'error', message: {en: `Error occured while loading news: ${e}`, ru: `Ошибка в процессе загрузки новостей: ${e}`}}))
        }
    }
}



export const loadOneNews = async (_id: string) => {
    try {
        const response: Response = await fetch(`/api/news/get-one?_id=${_id}`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
            },
        })
        
        if (response.status !== 200) {
            const result: IErrRes = await response.json()
            return {status: 'error', message: result.message, errors: result.errors}
        }
        const result = await response.json()
        return {
            status: 'success', 
            message: result.message,
            data: {
                ...result.news,
                date: new Date(result.news.date)
            } 
        }       
    } catch (e) {
        return {status: 'error', message: {en: `Error on server: ${e}`, ru: `Ошибка на сервере: ${e}`}}
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
                    errors: result.errors
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendNews({status: 'success', message: result.message}))
            
        } catch (e) {           
            dispatch(setSendNews({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }

    }
}






export const editNews = (news: Partial<ISendNews>, changeImages: boolean) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        
        const token = getState().user.token //get current user state
        dispatch(setSendNews({status: 'fetching', message: {en: '', ru: ''}}))
        const delayBetweenImagesPost = 300

        const imageUrls: IImgWithThumb[] = []
        // images to imgbb
        if (changeImages && news.images) {
            
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

        }

            //post to db
        try {
            const newsToDb: Partial<INewsItem> = {...news, images: imageUrls}
            if (!changeImages) {
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
                    message: result.message, 
                    errors: result.errors
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
        const token = getState().user.token //get current user state
        dispatch(setSendNews({status: 'fetching', message: {en: '', ru: ''}, errors: []}))
        
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
                    message: result.message, 
                    errors: result.errors
                }))
            }

            const result: IMsgRes = await response.json()
            dispatch(setSendNews({status: 'success', message: result.message}))
        } catch (e) {           
            dispatch(setSendNews({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}, errors: []}))
        }

    }
}



