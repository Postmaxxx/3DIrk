import { IAction, ICartItem, ICartItemSave, ICartState, IDispatch, IProduct } from '../../interfaces';
import { actionsListCart } from './actionsList'
import mockProducts from '../mocks/catalogFull';

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

export const removeItem = <T extends ICartItem>(payload: T):IAction<T> => ({
    type: actionsListCart.REMOVE_ITEM,
    payload
});


export const loadCart = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusCart({status: 'loading', message: `Loading cart`}))
        const receivedData: string = await new Promise((res, rej) => {
            setTimeout(()=> {res(localStorage.getItem('cart') as string)}, 1000)
        })
        if (receivedData) {
            //console.log('raw cart loaded');
            const loadedRawItems: ICartItemSave[] = JSON.parse(receivedData) || []

            const filledItems: ICartItem[] = loadedRawItems
                .map(item => {
                    const productFull: IProduct | undefined = mockProducts.find(product => product.id === item.product)
                    return productFull ? {...item, product: productFull } : undefined
                }).filter((item): item is ICartItem => item !== undefined)
            //console.log('cart converted');
                
            dispatch(setCart(filledItems))
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
        const dataToSave = items.map(item => {
            return {
                ...item,
                product: item.product.id
            }
        })
        localStorage.setItem('cart', JSON.stringify(dataToSave))
        dispatch(setSendDataStatusCart({status: 'success', message: `Cart is saved`}))
    }
}


