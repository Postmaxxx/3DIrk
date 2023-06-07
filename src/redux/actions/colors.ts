import { IAction, IProductState, ICategoriesListItem, ICategory, ICategoryReceived, IDispatch, IProduct, IColor, IColorsState } from "../../interfaces"
import { actionsListColors } from './actionsList'
import mockColors from "../mocks/colors";


export const setLoadDataStatusColors = <T extends IColorsState["dataLoading"]>(payload: T):IAction<T> => ({
    type: actionsListColors.SET_LOAD_DATA_STATUS_COLORS,
    payload
});


export const setColors = <T extends IColor[]>(payload: T):IAction<T> => ({
    type: actionsListColors.SET_DATA_COLORS,
    payload
});


export const loadColors = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusColors({status: 'loading', message: `Loading colors`}))
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
                dispatch(setLoadDataStatusColors({status: 'success', message: `colors loaded`}))
            }).catch(err => {
                dispatch(setLoadDataStatusColors({status: 'error', message: `ERROR while loading colors: ${err}`}))
            })

        } catch (e) {
            dispatch(setLoadDataStatusColors({status: 'error', message: `ERROR while loading colors: ${e}`}))
        }
    }
}

