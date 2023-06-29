import { IAction, IDispatch, IErrRes, IFetch, IFiber, IFullState, IImgWithThumb, IMsgRes, ISendFiber, TLangText } from "src/interfaces"
import { actionsListFibers } from './actionsList'
import { imagesUploader } from "src/assets/js/imageUploader";
import { empty, errorFetch, fetchingFetch } from "src/assets/js/consts";




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
        const load = getState().fibers.load
        if (load.status === 'fetching') return
        const token = getState().user.token
        dispatch(setLoadFibers(fetchingFetch))
        try {
            const response = await fetch('/api/fibers/all', {
                method: "GET",
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
        const send = getState().fibers.send
        if (send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendFibers({status: 'fetching', message: {en: '', ru: ''}}))

        // images to imgbb
        const imageUrls = await imagesUploader({files: newFiber.files, dispatch, errorHandler: setSendFibers})
        if (imageUrls.err.en) {
           return dispatch(setSendFibers({...errorFetch, message: imageUrls.err || {...empty}}))
        }


        //fetch to db
        try {
            const fiberToDB: Omit<IFiber, "_id"> = {
                ...newFiber,
                images: imageUrls.urls
            }
            
            const response: Response = await fetch('/api/fibers/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(fiberToDB)
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







export const editFiber = (fiber: Partial<ISendFiber>) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const send = getState().fibers.send
        if (send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendFibers(fetchingFetch))

        const imageUrls:IImgWithThumb[] = []
        // images to imgbb
        if (fiber.changeImages && fiber.files && fiber.files.length > 0) {
            const resultUrls = await imagesUploader({files: fiber.files, dispatch, errorHandler: setSendFibers})
            if (resultUrls.err.en) {
                return dispatch(setSendFibers({...errorFetch, message: resultUrls.err || {...empty}}))
            }
            imageUrls.concat([...resultUrls.urls])
        }

            //post to db
        try {
            const fiberToDb: Partial<IFiber> = {...fiber, images: imageUrls}
            if (!fiber.changeImages) {
                delete fiberToDb.images
            }

            
            const response: Response = await fetch('/api/fibers/edit', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(fiberToDb)
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
        const send = getState().fibers.send
        if (send.status === 'fetching') return
        const token = getState().user.token //get current user state
        dispatch(setSendFibers(fetchingFetch))

        try {
            const response: Response = await fetch(`/api/fibers/delete`,{
                method: 'DELETE',
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
