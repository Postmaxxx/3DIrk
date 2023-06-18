import { IAction, IDispatch, IErrRes, IFetch, IFiber, IFullState, IImgWithThumb, IMsgRes, TLangText } from "src/interfaces"
import mockFibers from '../mocks/fibers'
import { actionsListFibers } from './actionsList'
import { imageUploader } from "src/assets/js/imageUploader";



export const setLoadFibers = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_LOAD_DATA_STATUS_FIBERS,
    payload: payload
});

export const setSendFibers = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_SEND_DATA_STATUS_FIBERS,
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
    return async function(dispatch: IDispatch) {
        dispatch(setLoadFibers({status: 'fetching', message: {en: `Loading fibers`, ru: 'Загрузка материалов'}, errors: []}))
        try {
            const data: IFiber[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    res(mockFibers)
                    //console.log('fibers loaded');
                }, 2000)
            })

            dispatch(setLoadFibers({status: 'success', message: {en: `Fibers has been loaded`, ru: 'Материалы загружены'}, errors: []}))
            dispatch(setDataFibers(data))
        } catch (e) {
            dispatch(setLoadFibers({status: 'error', message: {en:`Error while loading fibers: ${e}`, ru: `Ошибка при загрузке материалов: ${e}`}, errors: []}))
        }
    }
}








export const sendFiber = (newFiber: Omit<IFiber, '_id' | 'images'> & {images: File[]}) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token //get current user state
        dispatch(setSendFibers({status: 'fetching', message: {en: '', ru: ''}}))
        const delayBetweenImagesPost = 300

        // images to imgbb
        const imageUrls: IImgWithThumb[] = []
        
        await newFiber.images.reduce(async (acc: Promise<string>, image: File, i) => {
            return new Promise(async (res, rej) => {
                await acc
                                
                const fiberImagePost = await imageUploader(image)
                if (fiberImagePost.status !== 'success') {
                    rej(`Error while uploading image ${image.name}`)
                    return dispatch(setSendFibers(fiberImagePost))
                }
                imageUrls.push(fiberImagePost.urls as IImgWithThumb)
                setTimeout(() => res('ok'), delayBetweenImagesPost)
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
