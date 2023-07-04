import { IAction, ICartItem, IDispatch, IErrRes, IFetch, IFullState, IOrdersState, TLang, TLangText } from "src/interfaces"
import { actionsListOrders } from './actionsList'
import { empty, errorFetch, fetchingFetch, minTimeBetweenSendings, successFetch } from "src/assets/js/consts";



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
}

export const loadOrders = ({from, to, userId}: ILoadOrders) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        if (getState().orders.load.status === 'fetching') return
        dispatch(setLoadOrders(fetchingFetch))
        
        
        try {
            const response: Response = await fetch(`/api/user/orders?from=${from}&to=${to}&userId=${userId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getState().user.token}`
                },
            })
            /*if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadOrders({status: 'error', message: (result as IErrRes).message || {...empty}, errors: result.errors || []}))
            }*/
            
            //const result = await response.json() //message, errors
            //console.log(result);
            

            
            dispatch(setLoadOrders(successFetch))

        } catch (e) {
            dispatch(setLoadOrders({status: 'error', message: {en: `Error occured while loading orders: ${e}`, ru: `Ошибка в процессе загрузки заказов: ${e}`}}))
        }
    }
}



