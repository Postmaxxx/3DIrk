import { IAction, IDispatch, IErrRes, IFetch, IFilterUser, IFullState, IMsgRes, IOrdersState, OrderType, TLang, TLangText } from "../../interfaces"
import { actionsListOrders } from './actionsList'
import { APIList, empty, fetchingFetch, successFetch } from "../../assets/js/consts";



export const setSendOrders = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListOrders.SET_SEND_STATUS_ORDERS,
    payload
});


export const setLoadOrders = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListOrders.SET_LOAD_STATUS_ORDERS,
    payload
});


export const setOrders = <T extends IOrdersState['users']>(payload: T):IAction<T> => ({
    type: actionsListOrders.SET_ORDERS,
    payload
});



interface ILoadOrders {
    from: string
    to: string
    userId: string
    status: string 
}

export const loadOrders = ({from, to, userId, status}: ILoadOrders) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().orders.load.status === 'fetching') return
        dispatch(setLoadOrders({...fetchingFetch}))
        try {
            const response: Response = await fetch(`${APIList.orders.getSome.url}?from=${from}&to=${to}&userId=${userId}&status=${status}`, {
                method: APIList.orders.getSome.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getState().user.token}`
                },
            })
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadOrders({status: 'error', message: (result as IErrRes).message || {...empty}, errors: result.errors || []}))
            }
            const result = await response.json() //message, errors
            dispatch(setOrders(result.users))
            dispatch(setLoadOrders(successFetch))
        } catch (e) {
            dispatch(setLoadOrders({status: 'error', message: {en: `Error occured while loading orders: ${e}`, ru: `Ошибка в процессе загрузки заказов: ${e}`}}))
        }
    }
}



export const changeOrderStatus = (orderId: string, newStatus: OrderType) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().orders.send.status === 'fetching') return
        dispatch(setSendOrders({...fetchingFetch}))
        try {
            const response: Response = await fetch(APIList.orders.editStatus.url, {
                method: APIList.orders.editStatus.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getState().user.token}`
                },
                body: JSON.stringify({orderId, newStatus})
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendOrders({status: 'error', message: (result as IErrRes).message || {...empty}, errors: result.errors || []}))
            }
            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendOrders({...successFetch, message: result.message}))
        } catch (e) {
            dispatch(setSendOrders({status: 'error', message: {en: `Error occured while loading orders: ${e}`, ru: `Ошибка в процессе загрузки заказов: ${e}`}}))
        }
    }
}






export const setLoadUsers = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListOrders.SET_LOAD_USERLIST,
    payload
});


export const setUserList = <T extends IFilterUser[]>(payload: T):IAction<T> => ({
    type: actionsListOrders.SET_USERLIST,
    payload
});



export const loadUsers = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().orders.userList.load.status === 'fetching') return
        dispatch(setLoadUsers({...fetchingFetch}))
        try {
            const response: Response = await fetch(APIList.orders.getUsers.url, {
                method: APIList.orders.getUsers.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getState().user.token}`
                },
            })
            if (response.status !== 200) {               
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadUsers({status: 'error', message: (result as IErrRes).message || {...empty}, errors: result.errors || []}))
            }
            const result = await response.json() //message, errors
            dispatch(setUserList(result.userList))
            dispatch(setLoadUsers(successFetch))
        } catch (e) {
            dispatch(setLoadUsers({status: 'error', message: {en: `Error occured while loading orders: ${e}`, ru: `Ошибка в процессе загрузки заказов: ${e}`}}))
        }
    }
}
