import { IAction, IDispatch, IErrRes, IFetch, IFiber, IFullState, IMsgRes, ISendFiber, TLangText } from "../../interfaces"
import { actionsListFibers } from './actionsList'
import { APIList, empty, fetchingFetch } from "../../assets/js/consts";


export const setLoadFibers = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_LOAD_STATUS_FIBERS,
    payload: payload
});

export const setSendFibers = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_SEND_STATUS_FIBERS,
    payload: payload
});

export const setDataFibers = <T extends Array<IFiber>>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_DATA_FIBERS,
    payload: payload
});

export const setSelectedFiber = <T extends IFiber['_id']>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_SELECTED_FIBER,
    payload: payload
});


export const loadFibers = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().fibers.load.status === 'fetching') return
        const token = getState().user.token
        dispatch(setLoadFibers({...fetchingFetch}))
        try {
            const response = await fetch(APIList.fibers.get.url, {
                method: APIList.fibers.get.method,
                headers: {
                    'Content-type': 'application/json',
                    Autorization: `Bearer ${token}`
                }
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json()
                return dispatch(setLoadFibers({status: 'error', message: result.message || {...empty}, errors: result.errors || []}))
            }
            const result: {fibers: IFiber[], message: TLangText} = await response.json()
            dispatch(setDataFibers(result.fibers.map(item => { //to not get some redundant fields from item like _v 
                return {_id: item._id,
                    name: item.name,
                    text: item.text,
                    short: item.short,
                    images: item.images,
                    proscons: item.proscons,
                    colors: item.colors,
                    params: Object.entries(item.params).reduce((acc, [key, value]) => {acc[key] = Number(value); return acc}, {} as {[key: string]: number}) as IFiber["params"]// convert strings to number
                }})))
            dispatch(setLoadFibers({status: 'success', message: result.message || {...empty}}))
        } catch (e) {
            dispatch(setLoadFibers({status: 'error', message: {en:`Error while loading fibers: ${e}`, ru: `Ошибка при загрузке материалов: ${e}`}}))
        }
    }
}



export const sendFiber = (newFiber: ISendFiber) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().fibers.send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendFibers({...fetchingFetch}))

        const sendForm = new FormData()   
        if (newFiber.files && newFiber.files.length > 0) {
            newFiber.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        const {files, ...fiberToSend}  = newFiber //except files from data
        sendForm.append('data', JSON.stringify(fiberToSend))
        try { 
            const response: Response = await fetch(APIList.fibers.create.url, {
                method: APIList.fibers.create.method,
                headers: {
                    'enctype': "multipart/form-data",
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
            })
            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendFibers({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors as TLangText[] || []
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendFibers({status: 'success', message: result.message || {...empty}}))
        } catch (e) {           
            dispatch(setSendFibers({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }
    }
}



export const editFiber = (fiber: ISendFiber, changeImages: boolean) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().fibers.send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendFibers(fetchingFetch))

        const sendForm = new FormData()   
        const {files, ...fiberToSend} = fiber //exclude files from data
        sendForm.append('data', JSON.stringify(fiberToSend))
        if (changeImages) {
            fiber.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
         //post to db
        try {
            const response: Response = await fetch(APIList.fibers.update.url, {
                method: APIList.fibers.update.method,
                headers: {
                    "enctype": 'multipart/fomr-data',
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
            })
            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendFibers({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors || []
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendFibers({status: 'success', message: result.message || {...empty}}))
        } catch (e) {           
            dispatch(setSendFibers({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }
    }
}



export const deleteFiber = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().fibers.send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendFibers({...fetchingFetch}))
        try {
            const response: Response = await fetch(APIList.fibers.delete.url,{
                method: APIList.fibers.delete.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({_id})
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json()
                dispatch(setSendFibers({status: 'error', message: result.message || {...empty}, errors: result.errors || []}))
            }
            const result:IMsgRes = await response.json()
            dispatch(setSendFibers({status: 'success', message: result.message}))
        } catch (e) {           
            dispatch(setSendFibers({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }
    }
}
