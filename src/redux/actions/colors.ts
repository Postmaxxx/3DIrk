import { IAction, IDispatch, IColor, IFetch, IFullState, IErrRes, TLangText, IMsgRes, ISendColor, } from "../../interfaces"
import { actionsListColors } from './actionsList'
import { APIList, DOMExceptions, errorFetch, fetchingFetch, successFetch } from "../../assets/js/consts";
import { fetchError, resErrorFiller } from "../../../src/assets/js/processors";


export const setLoadColors = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListColors.SET_LOAD_STATUS_COLORS,
    payload
});


export const setSendColors = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListColors.SET_SEND_STATUS_COLORS,
    payload
});


export const setColors = <T extends IColor[]>(payload: T):IAction<T> => ({
    type: actionsListColors.SET_DATA_COLORS,
    payload
});


interface IImages {
    images: {
        files: {
            full: string
            thumb: string
        },
        paths: {
            full: string
            thumb: string
        }
    },
    name: TLangText,
    _id: string
}

export const loadColors = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.colors.get.timeout) //set time limit for fetch
        dispatch(setLoadColors({...fetchingFetch, controller}))  
        try {
            const response: Response = await fetch(APIList.colors.get.url, {
                signal: controller.signal,
                method: APIList.colors.get.method,
                headers: {
                    "Content-Type": 'application/json',
                }
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json()
                return dispatch(setLoadColors(resErrorFiller(result)))
            }
            const result: {colors: IImages[], message: TLangText} = await response.json()
            const resultProcessed = result.colors.map((item) => {
                return {
                    _id: item._id,
                    name: item.name,
                    url: {
                        full: `${item.images.paths.full}/${item.images.files.full}`,
                        thumb: `${item.images.paths.thumb}/${item.images.files.thumb}`
                    }
                }
            })
            dispatch(setColors(resultProcessed))
            dispatch(setLoadColors({...successFetch}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setLoadColors,
                controller,
                comp: {en: 'loading colors', ru: 'загрузки цветов'}
            })
        }
    }
}




export const sendColor = (color: ISendColor) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.colors.create.timeout) //set time limit for fetch
        dispatch(setSendColors({...fetchingFetch, controller}))  
        const sendForm = new FormData()   
        const colorFiles = [color.files.full, color.files.thumb]
        colorFiles.forEach(item => {
            sendForm.append('files', item, item.name)
        })
        sendForm.append('data', JSON.stringify({name: color.name}))
        try {
            const response: Response = await fetch(APIList.colors.create.url, {
                signal: controller.signal,
                method: APIList.colors.create.method,
                headers: {
                    'enctype': "multipart/form-data",
                    'Authorization': `Bearer ${getState().user.token}`
                },
                body: sendForm
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendColors(resErrorFiller(result)))
            }
            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendColors({...errorFetch}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setSendColors,
                controller,
                comp: {en: 'loading saving color to db', ru: 'сохранения цвета в бд'}
            })
        }
    }
}



export const editColor = (color: ISendColor, changeImages: boolean) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.colors.update.timeout) //set time limit for fetch
        dispatch(setSendColors({...fetchingFetch, controller}))  
        const sendForm = new FormData()   
        sendForm.append('data', JSON.stringify({name: color.name, _id: color._id}))
        if (changeImages) {
            const colorFiles = [color.files.full, color.files.thumb]
            colorFiles.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        try {
            const response: Response = await fetch(APIList.colors.update.url, {
                signal: controller.signal,
                method: APIList.colors.update.method,
                headers: {
                    "enctype": 'multipart/form-data',
                    'Authorization': `Bearer ${getState().user.token}`
                },
                body: sendForm
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendColors(resErrorFiller(result)))
            }
            dispatch(setSendColors({...successFetch}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setSendColors,
                controller,
                comp: {en: 'loading saving color to db', ru: 'сохранения цвета в бд'}
            })
        }
    }
}




export const deleteColor = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.colors.delete.timeout) //set time limit for fetch
        dispatch(setSendColors({...fetchingFetch, controller}))  
        const token = getState().user.token 
        // to db
        try {
            const response: Response = await fetch(APIList.colors.delete.url, {
                signal: controller.signal,
                method: APIList.colors.delete.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({_id})
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendColors(resErrorFiller(result)))
            }
            dispatch(setSendColors({...successFetch}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setSendColors,
                controller,
                comp: {en: 'deleting color from db', ru: 'удаления цвета из бд'}
            })
        }
    }
}
