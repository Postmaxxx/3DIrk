import { IAction, IDispatch, IErrRes, IFetch, IFiber, IFullState, IImgWithThumb, IMsgRes, ISendFiber, TLangText } from "src/interfaces"
import { actionsListFibers } from './actionsList'
import { imageUploader } from "src/assets/js/imageUploader";
import { delayBetweenImagesPost } from "src/assets/js/consts";
import { makeDelay } from "src/assets/js/makeDelay";



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
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token
        dispatch(setLoadFibers({status: 'fetching', message: {en: `Loading fibers`, ru: 'Загрузка материалов'}}))
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
                return dispatch(setLoadFibers({status: 'error', message: result.message, errors: result.errors}))
            }
            
            const result: {fibers: IFiber[], message: TLangText} = await response.json()
            dispatch(setDataFibers(result.fibers.map(item => ({ //to not get some redundant fields from item, like _v
                _id: item._id,
                name: item.name,
                text: item.text,
                short: item.short,
                images: item.images,
                proscons: item.proscons,
                colors: item.colors,
                params: item.params
            }))))
            dispatch(setLoadFibers({status: 'success', message: result.message}))
        } catch (e) {
            dispatch(setLoadFibers({status: 'error', message: {en:`Error while loading fibers: ${e}`, ru: `Ошибка при загрузке материалов: ${e}`}}))
        }
    }
}








export const sendFiber = (newFiber: ISendFiber) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token //get current user state
        dispatch(setSendFibers({status: 'fetching', message: {en: '', ru: ''}}))

        // images to imgbb
        const imageUrls: IImgWithThumb[] = []
        
        await newFiber.files.reduce(async (acc: Promise<string>, image: File, i) => {
            return new Promise(async (res, rej) => {
                await acc
                                
                const fiberImagePost = await imageUploader(image)
                if (fiberImagePost.status !== 'success') {
                    rej(`Error while uploading image ${image.name}`)
                    return dispatch(setSendFibers(fiberImagePost))
                }
                imageUrls.push(fiberImagePost.urls as IImgWithThumb)
                await makeDelay(delayBetweenImagesPost)
                res('ok')
            })
            
        }, Promise.resolve('start fetching images'))

        //fetch to db
        try {
            const fiberToDB: Omit<IFiber, "_id"> = {
                ...newFiber,
                images: imageUrls
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
                    message: result.message, 
                    errors: result.errors as TLangText[] || []
                }))
            }

            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendFibers({status: 'success', message: result.message}))
            
        } catch (e) {           
            dispatch(setSendFibers({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }

    }
}







export const editFiber = (fiber: Partial<ISendFiber>, changeImages: boolean) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        
        const token = getState().user.token //get current user state
        dispatch(setSendFibers({status: 'fetching', message: {en: '', ru: ''}}))
        const delayBetweenImagesPost = 300

        const imageUrls: IImgWithThumb[] = []
        // images to imgbb
        if (changeImages && fiber.files && fiber.files.length > 0) {
            
            await fiber.files.reduce(async (acc: Promise<string>, image: File, i) => {
                return new Promise(async (res, rej) => {
                    await acc
                                    
                    const fiberImage = await imageUploader(image)
                    if (fiberImage.status !== 'success') {
                        rej(`Error while uploading image ${image.name}`)
                        return dispatch(setSendFibers(fiberImage))
                    }
                    imageUrls.push(fiberImage.urls as IImgWithThumb)
                    setTimeout(() => res('ok'), delayBetweenImagesPost)
                })
                
            }, Promise.resolve('start fetching images'))

        }

            //post to db
        try {
            const fiberToDb: Partial<IFiber> = {...fiber, images: imageUrls}
            if (!changeImages) {
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
                    message: result.message, 
                    errors: result.errors
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendFibers({status: 'success', message: result.message}))
            
        } catch (e) {           
            dispatch(setSendFibers({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }
    }
}






export const deleteFiber = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token //get current user state
        dispatch(setSendFibers({status: 'fetching', message: {en: '', ru: ''}}))

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
                dispatch(setSendFibers({status: 'error', message: result.message, errors: result.errors}))
            }

            const result:IMsgRes = await response.json()
            dispatch(setSendFibers({status: 'success', message: result.message}))

            
        } catch (e) {           
            dispatch(setSendFibers({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }

    }
}
