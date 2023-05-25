import { IAction, IDataLoading, IDispatch, IFiber } from "src/interfaces"
import mockFibers from '../mocks/fibers'
import { actionsListFibers } from './actionsList'



export const setLoadDataStatusFibers = <T extends IDataLoading>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_LOAD_DATA_STATUS_FIBERS,
    payload: payload
});


export const setDataFibers = <T extends Array<IFiber>>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_DATA_FIBERS,
    payload: payload
});


export const setCompareListFibers = <T extends Array<IFiber['id']>>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_COMPARE_LIST_FIBERS,
    payload: payload
});

export const setSelectedFiber = <T extends IFiber['id']>(payload: T):IAction<T> => ({
    type: actionsListFibers.SET_SELECTED_FIBER,
    payload: payload
});


export const loadFibers = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusFibers({status: 'loading', message: `Loading fibers`}))
        try {
            const data: IFiber[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    res(mockFibers)
                    console.log('fibers loaded');
                }, 2000)
            })

            dispatch(setLoadDataStatusFibers({status: 'success', message: `Fibers loaded`}))
            dispatch(setDataFibers(data))
        } catch (e) {
            dispatch(setLoadDataStatusFibers({status: 'error', message: `ERROR while loading fibers: ${e}`}))
        }
    }
}