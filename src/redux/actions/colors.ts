import { imageUploader } from "src/assets/js/imageUploader";
import { IAction, IDispatch, IColor, IColorsState, IFetch, IFullState, IErrRes, TLangText, IMsgRes, ISendColor, IImgWithThumb } from "../../interfaces"
import { actionsListColors } from './actionsList'
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
        dispatch(setLoadColors({status: 'fetching', message: {en: `Loading colors`, ru: 'Загрузка цветов'}}))
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
        dispatch(setSendColors({status: 'fetching', message: {en: `Saving color`, ru: 'Сохранение цвета'}}))
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
            const response: Response = await fetch('/api/colors/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: {
                        en: color.name.en.trim(),
                        ru: color.name.ru.trim()
                    },
                    url: {
                        full: imageUrls.full,
                        small: imageUrls.small
                    }
                })
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


