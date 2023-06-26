import { imageUploader } from "src/assets/js/imageUploader";
import { IAction, IDispatch, IColor, IColorsState, IFetch, IFullState, IErrRes, TLangText, IMsgRes, ISendColor, IImgWithThumb } from "../../interfaces"
import { actionsListColors } from './actionsList'
import { resetFetch } from "src/assets/js/consts";
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


export const loadColors = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadColors(resetFetch))
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
                    message: result.message, 
                    errors: result.errors
                }))
            }

            const result: {colors: IColor[], message: TLangText} = await response.json()
            const resultProcessed = result.colors.map((item) => {
                return {
                    _id: item._id,
                    name: item.name,
                    url: item.url
                }
            })

            dispatch(setColors(resultProcessed))
              
            dispatch(setLoadColors({status: 'success', message: result.message}))
        } catch (e) {
            dispatch(setLoadColors({status: 'error', message: {en:`Error while loading colors: ${e}`, ru: `Ошибка при загрузке цветов: ${e}`}}))
        }
    }
}






export const sendColor = (color: ISendColor) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token
        dispatch(setSendColors(resetFetch))
        const imageUrls = {} as {full:string, small: string}
        
        // upload to imgbb imageBig
        const postFull = await imageUploader(color.files.full)
        if (postFull.status !== 'success') {
            return dispatch(setSendColors(postFull))
        }
        imageUrls.full = (postFull.urls as IImgWithThumb).full

        // upload to imgbb imageSmall, not thumb, specific size as fullImage
        const postSmall = await imageUploader(color.files.small)
        if (postSmall.status !== 'success') {
            return dispatch(setSendColors(postSmall))
        }
        imageUrls.small = (postSmall.urls as IImgWithThumb).full
        
        

        // to db
        try {
            const colorToDb = {
                name: {
                    en: color.name.en.trim(),
                    ru: color.name.ru.trim()
                },
                url: {
                    full: imageUrls.full,
                    small: imageUrls.small
                }
            }

            const response: Response = await fetch('/api/colors/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(colorToDb)
            })
        
        
            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendColors({
                        status: 'error', 
                        message: (result as IErrRes).message, 
                        errors: result.errors
                    }
                ))
            }

            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendColors({status: 'success', message: result.message}))


        } catch (e) {
            dispatch(setSendColors({status: 'error', message: {en:`Error while saving color to db: ${e}`, ru: `Ошибка при сохранении цвета в бд: ${e}`}}))
        }
    }
}





export const editColor = (color: ISendColor, changeImages: boolean) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token
        dispatch(setSendColors(resetFetch))
        const imageUrls = {} as {full:string, small: string}
        
        // upload to imgbb imageBig
        if (changeImages) {
            const postFull = await imageUploader(color.files.full)
            if (postFull.status !== 'success') {
                return dispatch(setSendColors(postFull))
            }
            imageUrls.full = (postFull.urls as IImgWithThumb).full
    
            // upload to imgbb imageSmall, not thumb, specific size as fullImage
            const postSmall = await imageUploader(color.files.small)
            if (postSmall.status !== 'success') {
                return dispatch(setSendColors(postSmall))
            }
            imageUrls.small = (postSmall.urls as IImgWithThumb).full
        }

        // to db
        try {

            const colorToDb: Partial<IColor> = {
                _id: color._id,
                name: {
                    en: color.name.en.trim(),
                    ru: color.name.ru.trim()
                },
                url: {
                    full: imageUrls.full,
                    small: imageUrls.small
                }
            }
            
            if (!changeImages) {
                delete colorToDb.url
            }

            const response: Response = await fetch('/api/colors/edit', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(colorToDb)
            })
        
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendColors({
                        status: 'error', 
                        message: (result as IErrRes).message, 
                        errors: result.errors
                    }
                ))
            }

            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendColors({status: 'success', message: result.message}))


        } catch (e) {
            dispatch(setSendColors({status: 'error', message: {en:`Error while saving color to db: ${e}`, ru: `Ошибка при сохранении цвета в бд: ${e}`}}))
        }
    }
}





export const deleteColor = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token
        dispatch(setSendColors(resetFetch))       
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
                        message: (result as IErrRes).message, 
                        errors: result.errors
                    }
                ))
            }

            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendColors({status: 'success', message: result.message}))

        } catch (e) {
            dispatch(setSendColors({status: 'error', message: {en:`Error while deleting color from db: ${e}`, ru: `Ошибка при удалении цвета из бд: ${e}`}}))
        }
    }
}
