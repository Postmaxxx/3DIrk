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





export const sendColor = (color: Omit<IColor, "_id">) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const token = getState().user.token
        const temp = getState().colors.send
        dispatch(setSendColors({status: 'fetching', message: {en: `Saving color`, ru: 'Сохранение цвета'}}))
        try {
            const response: Response = await fetch('/api/colors/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(color)
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
            console.log('111', temp);
            
            dispatch(setSendColors({status: 'success', message: result.message}))


        } catch (e) {
            dispatch(setSendColors({status: 'error', message: {en:`Error while saving color: ${e}`, ru: `Ошибка при сохранении цвета: ${e}`}}))
        }
    }
}


