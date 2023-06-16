import { IAction, IDispatch, IColor, IColorsState, IFetch, IFullState, IErrRes, TLangText, IMsgRes } from "../../interfaces"
import { actionsListColors } from './actionsList'
//import mockColors from "../mocks/colors";


export const setLoadColors = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListColors.SET_LOAD_DATA_STATUS_COLORS,
    payload
});


export const setSendColors = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListColors.SET_SEND_DATA_STATUS_COLORS,
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
                    errors: result.errors as TLangText[] || []
                }))
            }

            const result: {colors: IColor[], message: TLangText} = await response.json()
            
            setColors(result.colors.map((item) => {
                return {
                    _id: item._id,
                    name: item.name,
                    url: item.url
                }
            }))
              
            dispatch(setLoadColors({status: 'success', message: result.message}))
        } catch (e) {
            dispatch(setLoadColors({status: 'error', message: {en:`Error while loading colors: ${e}`, ru: `Ошибка при загрузке цветов: ${e}`}}))
        }
    }
}



interface ISendColor {
    name: {
        ru: string, 
        en: string
    }, 
    files: {
        big: File, 
        small: File
    }
    //file: File
}

export const sendColor = (color: ISendColor) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token
        const temp = getState().colors.send
        dispatch(setSendColors({status: 'fetching', message: {en: `Saving color`, ru: 'Сохранение цвета'}}))

        /*try {
            await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB}`, {
                method: 'OPTIONS',
                headers: {
                    'Access-Control-Request-Method': 'POST',
                }
            })
        }
        catch(e) {
            return dispatch(setSendColors({status: 'error', message: {en:`Error while deploying color image: ${e}`, ru: `Ошибка при сохранении файла цвета: ${e}`}}))
        }*/

        
        let fullUrl = ''
        let smallUrl = ''
        
        // to imgbb big
        try {
            let form = new FormData();
            form.append("image", color.files.big)

            const response: Response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB}`, {
                method: 'POST',
                body: form
            })

            const result = await response.json()
            
            if (!result.success) {
                return dispatch(setSendColors({status: 'error', message: {en:`No file`, ru: `отсутствует файл`}}))
            }
            fullUrl = result.data.image.url
           
        } catch (e) {
            return dispatch(setSendColors({status: 'error', message: {en:`Error while deploying color image: ${e}`, ru: `Ошибка при сохранении файла цвета: ${e}`}}))
        }  
        
        
        // to imgbb small
        try {
            let form = new FormData();
            form.append("image", color.files.small)

            const response: Response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB}`, {
                method: 'POST',
                body: form
            })

            const result = await response.json()

            if (!result.success) {
                return dispatch(setSendColors({status: 'error', message: {en:`No file`, ru: `отсутствует файл`}}))
            }
            smallUrl = result.data.image.url
           
        } catch (e) {
            return dispatch(setSendColors({status: 'error', message: {en:`Error while deploying color image: ${e}`, ru: `Ошибка при сохранении файла цвета: ${e}`}}))
        }   


        // to db
        try {
            const response: Response = await fetch('/api/colors/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: color.name,
                    url: {
                        full: fullUrl,
                        small: smallUrl
                    }
                })
            })
        
        
            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendColors({
                        status: 'error', 
                        message: (result as IErrRes).message, 
                        errors: result.errors as TLangText[] || []
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


