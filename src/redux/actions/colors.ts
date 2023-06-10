import { IAction, IDispatch, IColor, IColorsState, IFetch } from "../../interfaces"
import { actionsListColors } from './actionsList'
import mockColors from "../mocks/colors";


export const setFetchColors = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListColors.SET_LOAD_DATA_STATUS_COLORS,
    payload
});


export const setColors = <T extends IColor[]>(payload: T):IAction<T> => ({
    type: actionsListColors.SET_DATA_COLORS,
    payload
});


export const loadColors = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setFetchColors({status: 'fetching', message: {en: `Loading colors`, ru: 'Загрузка цветов'}, errors: []}))
        try {
            new Promise((res, rej) => {
                setTimeout(() => {
                    const receivedData = mockColors
                    if (receivedData) {
                        //console.log(`colors loaded`);
                        res(receivedData)
                    } else (
                        rej({mesasage: `colors not found`})
                    )
                }, 500)
            }).then((data) => {
                dispatch(setColors(data as IColor[]))
                dispatch(setFetchColors({status: 'success', message: {en: `Colors has been loaded`, ru: 'Цвета загружены'}, errors: []}))
            }).catch(err => {
                dispatch(setFetchColors({status: 'error', message: {en:`Error while loading colors: ${err}`, ru: `Ошибка при загрузке цветов: ${err}`}, errors: []}))
            })

        } catch (e) {
            dispatch(setFetchColors({status: 'error', message: {en:`Error while loading colors: ${e}`, ru: `Ошибка при загрузке цветов: ${e}`}, errors: []}))
        }
    }
}

