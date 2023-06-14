import { IAction, ICartItem, IDispatch, IFetch, IFullState, IProduct } from '../../interfaces';
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
            console.log('raw cart loaded', receivedData);
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

/*
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
*/




export const sendCart = () => {   
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { cart, user } = getState() //get current cart state
       
        dispatch(setSendDataStatusCart({status: 'fetching', message: {en: 'Sending cart', ru: 'Отправка корзины'}, errors: []}))
        
        try {
            const cartToSend = cart.items.map(item => {
                return {
                    fiber: item.fiber,
                    color: item.color,
                    type: item.type,
                    amount: item.amount
                }
            })
            const response: Response = await fetch('/api/cart/set', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({items: cartToSend}),
                })
            
            if (response.status !== 200) {
                /*const result: IErrRes = await response.json() //message, errors
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: (result as IErrRes).message, 
                        errors: result.errors as TLangText[] || []
                    }
                }))*/
            }
            /*const result: IUserLoginResOk = await response.json() //message, errors
            dispatch(setUser({
                ...user, 
                name: result.user.name,
                email: result.user.email,
                phone: result.user.phone,
                //orders: result.user.orders,
                token: result.user.token,
                auth: {status: 'success', message: result.message, errors: []},
            }))
            localStorage.setItem('user', JSON.stringify({token: result.user.token}))*/
        } catch (e) {         
            //dispatch(setSendDataStatusCart({...user, auth: {status: 'error', message: (e as IErrRes).message, errors: []}}))
        } 
    }
}



