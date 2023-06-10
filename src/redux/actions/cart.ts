import { IAction, ICartItem, IDispatch, IFetch, IProduct } from '../../interfaces';
import { actionsListCart } from './actionsList'
import mockProducts from '../mocks/catalogFull';

export const setLoadDataStatusCart = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCart.SET_LOAD_DATA_STATUS_CART,
    payload
});


export const setSendDataStatusCart = <T extends IFetch>(payload: T):IAction<T> => ({
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
    type: actionsListCart.CHANGE_AMOUNT,
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
        dispatch(setLoadDataStatusCart({status: 'fetching', message: {en: `Loading cart`, ru: 'Загрузка корзины'}, errors: []}))
        const receivedData: string = await new Promise((res, rej) => {
            setTimeout(()=> {res(localStorage.getItem('cart') as string)}, 1000)
        })
        if (receivedData) {
            //console.log('raw cart loaded');
            const loadedItems: ICartItem[] = JSON.parse(receivedData) || []

            //const filledItems: ICartItem[] = loadedRawItems
                /*.map(item => {
                    const productFull: IProduct | undefined = mockProducts.find(product => product.id === item.product)
                    return productFull ? {...item, product: productFull } : undefined
                }).filter((item): item is ICartItem => item !== undefined)*/

            //console.log('cart converted');
            dispatch(setCart(loadedItems))
            dispatch(setLoadDataStatusCart({status: 'success', message: {en: `Cart has been loaded`, ru: 'Корзина была загружена'}, errors: []}))
        } else {
            clearCart()
            dispatch(setLoadDataStatusCart({status: 'success', message: {en: `Сart is empty`, ru: 'Корзина пуста'}, errors: []}))
        }
    }
}


export const saveCart = (items: ICartItem[]) => {
    return async function(dispatch: IDispatch) {
        dispatch(setSendDataStatusCart({status: 'fetching', message: {en: 'Saving cart', ru: 'Сохраняем корзину'}, errors: []}))
        const dataToSave = items.map(item => {
            return {
                ...item,
                product: item.product
            }
        })
        localStorage.setItem('cart', JSON.stringify(dataToSave))
        dispatch(setSendDataStatusCart({status: 'success', message: {en: 'Cart has been saved', ru: 'Корзина сохранена'}, errors: []}))
    }
}


