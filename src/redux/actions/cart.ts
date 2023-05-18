import { IAction, ICartItem, ICartState, IDispatch, IProduct } from 'src/interfaces';
import { actionsListCart } from './actionsList'


export const setLoadDataStatusCart = <T extends ICartState["dataLoading"]>(payload: T):IAction<T> => ({
    type: actionsListCart.SET_LOAD_DATA_STATUS_CART,
    payload
});


export const setSendDataStatusCart = <T extends ICartState["dataSending"]>(payload: T):IAction<T> => ({
    type: actionsListCart.SET_SEND_DATA_STATUS_CART,
    payload
});


export const addItem = <T extends ICartItem>(payload: T):IAction<T> => ({
    type: actionsListCart.ADD_ITEM,
    payload
});

export const setCart = <T extends ICartItem[]>(payload: T):IAction<T> => ({
    type: actionsListCart.SET_CART,
    payload
});

export const changeItem = <T extends ICartItem>(payload: T):IAction<T> => ({
    type: actionsListCart.CHANGE_ITEM,
    payload
});

export const clearCart = <T>():IAction<T> => ({
    type: actionsListCart.CLEAR_CART
});

export const removeItem = <T extends IProduct["id"]>(payload: T):IAction<T> => ({
    type: actionsListCart.REMOVE_ITEM,
    payload
});


export const loadCart = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusCart({status: 'loading', message: `Loading cart`}))

        const receivedData = localStorage.getItem('cart')
        if (receivedData) {
            setCart(JSON.parse(receivedData))
            dispatch(setLoadDataStatusCart({status: 'success', message: `Cart is loaded`}))
        } else {
            clearCart()
            dispatch(setLoadDataStatusCart({status: 'success', message: `Cart is empty`}))
        }
    }
}


export const saveCart = (items: ICartItem[]) => {
    return async function(dispatch: IDispatch) {
        dispatch(setSendDataStatusCart({status: 'sending', message: `Saving cart`}))
        localStorage.setItem('cart', JSON.stringify(items))
        dispatch(setSendDataStatusCart({status: 'success', message: `Cart is saved`}))
    }
}


