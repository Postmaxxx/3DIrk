import { IAction, IDispatch, IFetch, IFiber } from "src/interfaces"
import mockFibers from '../mocks/fibers'
import { actionsListFibers } from './actionsList'



export const setFetchFibers = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_LOAD_DATA_STATUS_FIBERS,
    payload: payload
});


export const setDataFibers = <T extends Array<IFiber>>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_DATA_FIBERS,
    payload: payload
});


export const setSelectedFiber = <T extends IFiber['id']>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_SELECTED_FIBER,
    payload: payload
});


export const loadFibers = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setFetchFibers({status: 'fetching', message: {en: `Loading fibers`, ru: 'Загрузка материалов'}, errors: []}))
        try {
            const data: IFiber[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    res(mockFibers)
                    //console.log('fibers loaded');
                }, 2000)
            })

            dispatch(setFetchFibers({status: 'success', message: {en: `Fibers has been loaded`, ru: 'Материалы загружены'}, errors: []}))
            dispatch(setDataFibers(data))
        } catch (e) {
            dispatch(setFetchFibers({status: 'error', message: {en:`Error while loading fibers: ${e}`, ru: `Ошибка при загрузке материалов: ${e}`}, errors: []}))
        }
    }
}