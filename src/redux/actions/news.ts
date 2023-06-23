import { IAction, IDispatch, IErrRes, IFetch, IFullState, IImgWithThumb, IMsgRes, INewsItem, INewsItemShort, ISendNews, IUserState, TLangText } from "src/interfaces"
import { actionsListNews } from './actionsList'
import { imageUploader } from "src/assets/js/imageUploader";



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





export const loadOneNews = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const news = getState().news
        if (news.loadOne.status === 'fetching') return
        dispatch(setLoadOneNews({status: 'fetching', message: {en: `Loading news ${_id}`, ru: `Загрузка новости  ${_id}`},}))
        try {
            const response: Response = await fetch(`/api/news/get-one?_id=${_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json()
                return dispatch(setLoadOneNews({status: 'error', message: (result as IErrRes).message, errors: result.errors}))
            }
            
            const result = await response.json()
            dispatch(setDataOneNews({
                    ...result.news,
                    date: new Date(result.news.date) //changing format, check !!!
                }
            ))
            dispatch(setLoadOneNews({status: 'success', message: {en: `This news has been loaded`, ru: 'Новость была загружена успешно'}}))
        } catch (e) {
            dispatch(setLoadOneNews({status: 'error', message: {en: `Error occured while loading this news: ${e}`, ru: `Ошибка в процессе загрузки новости: ${e}`}}))
        }
    }
}




export const sendNews = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { newsOne } = getState().news
        const token = getState().user.token //get current user state
        dispatch(setSendNews({status: 'fetching', message: {en: '', ru: ''}}))
        const delayBetweenImagesPost = 300

        const imageUrls: IImgWithThumb[] = []
        // images to imgbb
        if (newsOne.files && newsOne.files?.length > 0) {
            await newsOne.files.reduce(async (acc: Promise<string>, image: File, i) => {
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






export const updateNews = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { newsOne } = getState().news
        const token = getState().user.token //get current user state
        dispatch(setSendNews({status: 'fetching', message: {en: '', ru: ''}}))
        const delayBetweenImagesPost = 300

        const imageUrls: IImgWithThumb[] = []
        // images to imgbb
        if (newsOne.changeImages && newsOne.files && newsOne.files?.length > 0) {
            await newsOne.files.reduce(async (acc: Promise<string>, file: File, i) => {
                return new Promise(async (res, rej) => {
                    await acc             
                    const newsImagePosted = await imageUploader(file)
                    if (newsImagePosted.status !== 'success') {
                        rej(`Error while uploading image ${file.name}`)
                        return dispatch(setSendNews(newsImagePosted))
                    }
                    imageUrls.push(newsImagePosted.urls as IImgWithThumb)
                    setTimeout(() => res('ok'), delayBetweenImagesPost) //wait between request to avoid any issues like ban
                })
            }, Promise.resolve('start fetching images'))
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



