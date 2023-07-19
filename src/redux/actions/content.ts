import { IAction, IContentState, IDispatch, IErrRes, IFetch, IFullState, IMsgRes, } from "../../interfaces"
import { actionsListContent } from './actionsList'
import { APIList, empty, fetchingFetch } from "../../assets/js/consts";



export const setSendContent = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListContent.SET_SEND_STATUS_CONTENT,
    payload: payload
});


export const setLoadContent = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListContent.SET_LOAD_STATUS_CONTENT,
    payload: payload
});


export const setContent = <T extends IContentState>(payload: T):IAction<T> => ({
    type: actionsListContent.SET_CONTENT,
    payload: payload
});



export const sendSplider = (files: File[]) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().content.send.status === 'fetching') return
        if (files.length === 0 || !files) return 
        const token = getState().user.token
        dispatch(setSendContent(fetchingFetch))

        const sendForm = new FormData()       
        files.forEach(item => {
            sendForm.append('files', item, item.name)
        })
        try {
            const response: Response = await fetch(APIList.content.carouselMax.update.url, {
                method: APIList.content.carouselMax.update.method,
                headers: {
                    'enctype': "multipart/form-data",
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendContent({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors || []
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendContent({status: 'success', message: result.message || {...empty}}))
        } catch (e) {           
            dispatch(setSendContent({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }
    }
}





export const loadSplider = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().content.load.status === 'fetching') return
        dispatch(setLoadContent(fetchingFetch))
        try {
            const response: Response = await fetch(APIList.content.carouselMax.get.url, {
                method: APIList.content.carouselMax.get.method,
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadContent({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors || []
                }))
            }
            const result = await response.json() //message, errors
            dispatch(setContent({...getState().content, splider: result}))
            dispatch(setLoadContent({status: 'success', message: result.message || {...empty}}))
        } catch (e) {           
            dispatch(setLoadContent({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }
    }
}


