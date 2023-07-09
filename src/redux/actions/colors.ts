import { IAction, IDispatch, IColor, IColorsState, IFetch, IFullState, IErrRes, TLangText, IMsgRes, ISendColor, IImgWithThumb } from "../../interfaces"
import { actionsListColors } from './actionsList'
import { empty, fetchingFetch } from "src/assets/js/consts";
//import mockColors from "../mocks/colors";


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
        if (getState().colors.load.status === 'fetching') return
        dispatch(setLoadColors(fetchingFetch))
        try {
            const response: Response = await fetch('/api/colors/load-all', {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                }
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json()
                dispatch(setLoadColors({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors || []
                }))
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
            dispatch(setLoadColors({status: 'success', message: result.message || {...empty}}))
        } catch (e) {
            dispatch(setLoadColors({status: 'error', message: {en:`Error while loading colors: ${e}`, ru: `Ошибка при загрузке цветов: ${e}`}}))
        }
    }
}






export const sendColor = (color: ISendColor) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().colors.send.status === 'fetching') return
        const token = getState().user.token
        dispatch(setSendColors(fetchingFetch))
        const colorFiles = [color.files.full, color.files.thumb]

        const sendForm = new FormData()   
        colorFiles.forEach(item => {
            sendForm.append('files', item, item.name)
        })
        sendForm.append('data', JSON.stringify({name: color.name}))

        // to db
        try {
            const response: Response = await fetch('/api/colors/create', {
                method: 'POST',
                headers: {
                    'enctype': "multipart/form-data",
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
            })
        
        
            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendColors({
                        status: 'error', 
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors || []
                    }
                ))
            }

            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendColors({status: 'success', message: result.message || {...empty}}))
        } catch (e) {
            dispatch(setSendColors({status: 'error', message: {en:`Error while saving color to db: ${e}`, ru: `Ошибка при сохранении цвета в бд: ${e}`}}))
        }
    }
}





export const editColor = (color: ISendColor) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().colors.send.status === 'fetching') return
        const token = getState().user.token
        dispatch(setSendColors(fetchingFetch))

        const colorFiles = [color.files.full, color.files.thumb]
        const sendForm = new FormData()   
        sendForm.append('data', JSON.stringify({name: color.name, _id: color._id}))
        if (color.files.full && color.files.thumb) {
            colorFiles.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        
        // to db
        try {
            const response: Response = await fetch('/api/colors/edit', {
                method: 'PUT',
                headers: {
                    "enctype": 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
            })
        
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendColors({
                        status: 'error', 
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors || []
                    }
                ))
            }

            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendColors({status: 'success', message: result.message || {...empty}}))


        } catch (e) {
            dispatch(setSendColors({status: 'error', message: {en:`Error while saving color to db: ${e}`, ru: `Ошибка при сохранении цвета в бд: ${e}`}}))
        }
    }
}





export const deleteColor = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().colors.send.status === 'fetching') return
        const token = getState().user.token
        dispatch(setSendColors(fetchingFetch))       
        // to db
        try {
            const response: Response = await fetch('/api/colors/delete', {
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({_id})
            })
        
        
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendColors({
                        status: 'error', 
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors || []
                    }
                ))
            }

            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendColors({status: 'success', message: result.message || {...empty}}))

        } catch (e) {
            dispatch(setSendColors({status: 'error', message: {en:`Error while deleting color from db: ${e}`, ru: `Ошибка при удалении цвета из бд: ${e}`}}))
        }
    }
}
