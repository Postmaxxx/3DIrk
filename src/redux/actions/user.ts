import { IAction, ICartItem, ICartState, IDispatch, IErrRes, IFetch, IFullState, ILoggingForm, IMsgRes, IUserLoginResOk, IUserState, TLangText } from "../../interfaces";
import { actionsListUser } from './actionsList'
//import { setText } from "./order";
import { empty, errorFetch, fetchingFetch, minTimeBetweenSendings, successFetch } from "../../assets/js/consts";
import moment from "moment";

export const setUser = <T extends Partial<IUserState>>(payload: T):IAction<T> => ({
    type: actionsListUser.SET_USER,
    payload: payload
});


export const setSendOrder = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListUser.SET_SEND_STATUS_ORDER,
    payload: payload
});



export const register = ({name, email, phone, password}: ILoggingForm) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const { user } = getState() //get current user state
        if (user.auth.status === 'fetching') return  
        dispatch(setUser({...user, auth: fetchingFetch}))
        const localDate = moment().format('YYYY-MM-DD')
        try {
            const response = await fetch(`${process.env.REACT_BACK_URL}/api/user/register`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({name, email, phone, password, localDate})
            })    
            const result: IErrRes = await response.json() //message, errors
            if (response.status !== 201) {
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: result.message || {...empty}, 
                        errors: result.errors as TLangText[] || []
                    }
                }))
            }
            dispatch(setUser({...user, auth: successFetch}))
            await login({email, password})(dispatch, getState)
        } catch (e) {   
            dispatch(setUser({...user,auth: {status: 'error', message: (e as IErrRes).message || {...empty}}}))
        } 
    }
}




export const login = ({email, password}: Pick<ILoggingForm, "email" | "password">) => {         
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const { user } = getState() //get current user state
        if (user.auth.status === 'fetching') return             
        dispatch(setUser({...user, auth: fetchingFetch}))
        try {
            const response: Response = await fetch(`${process.env.REACT_BACK_URL}/api/user/login`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify({email, password})
                })
            
            
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                console.log(result);
                                
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors as TLangText[] || []
                    }
                }))
            }
            
            const result: IUserLoginResOk = await response.json() //message, errors
            
            dispatch(setUser({
                ...user, 
                name: result.user.name,
                email: result.user.email,
                phone: result.user.phone,
                //orders: result.user.orders,
                token: result.user.token,
                auth: {status: 'success', message: result.message},
                isAdmin: result.user.isAdmin,
                cart: {
                    ...user.cart,
                    items: result.user.cart,
                    load: successFetch
                }
            }))
            

            localStorage.setItem('user', JSON.stringify({token: result.user.token}))
        } catch (e) {         
            dispatch(setUser({...user, auth: {status: 'error', message: (e as IErrRes).message || {...empty}}}))
        } 
    }
}





export const loginWithToken = () => {   
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const { user } = getState() //get current user state        
        if (user.auth.status === 'fetching') return  
        const savedUser = localStorage.getItem('user')
        const currentToken: string = savedUser ? JSON.parse(savedUser).token : null
        if (!currentToken) {
            return dispatch(setUser({...user, auth: {status: 'error', message: {en: 'Token not found', ru: 'Токен не найден'}, errors: []}}))
        }

        dispatch(setUser({...user, auth: fetchingFetch}))
        
        try {
            const response: Response = await fetch(`${process.env.REACT_BACK_URL}/api/user/login-token`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                        'Authorization': `Bearer ${currentToken}`
                    },
                })
                
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setUser({
                    ...user, 
                    token: '',
                    auth: {
                        status: 'error', 
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors as TLangText[] || []
                    }
                }))
            }
            const result: IUserLoginResOk = await response.json() //message, errors
            dispatch(setUser({
                ...user, 
                name: result.user.name,
                email: result.user.email,
                phone: result.user.phone,
                token: result.user.token,
                auth: {status: 'success', message: result.message},
                isAdmin: result.user.isAdmin,
                cart: {
                    ...user.cart,
                    items: result.user.cart,
                    load: successFetch
                }
            }))
            localStorage.setItem('user', JSON.stringify({token: result.user.token}))
        } catch (e) {         
            dispatch(setUser({...user, auth: {status: 'error', message: (e as IErrRes).message || {...empty}}}))
        } 
    }
}


//////////////////////////////////////////////////////////////////////////////


interface ISendOrder {
    message: string
    files: File[]
}


export const sendOrder = ({message, files}: ISendOrder ) => {
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const { user } = getState()
        const {lang} = getState().base
        if (user.sendOrder.status === 'fetching') return
        await sendCart()(dispatch, getState)
      
        dispatch(setSendOrder({...fetchingFetch}))
        const sendForm = new FormData()       
        files.forEach(item => {
            sendForm.append('files', item, item.name)
        })
        sendForm.append('lang', lang)
        sendForm.append('message', message)
        
        try {
            const response = await fetch(`${process.env.REACT_BACK_URL}/api/user/orders`, {
                method: 'POST',
                headers: {
                    'enctype': "multipart/form-data",
                   // 'Content-Type': '"multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                },
                body: sendForm
            })
            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendOrder({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors || []
                }))
            }

            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendOrder({status: 'success', message: result.message}))
            
        } catch (e) {           
            dispatch(setSendOrder({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }
    }
}






//============================================== CART
export const setLoadCart = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListUser.SET_LOAD_STATUS_CART,
    payload
});


export const setSendCart = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListUser.SET_SEND_STATUS_CART,
    payload
});


export const addItem = <T extends ICartItem>(payload: T):IAction<T> => ({
    type: actionsListUser.ADD_ITEM_CART,
    payload
});

export const setCart = <T extends Partial<ICartState>>(payload: T):IAction<T> => ({
    type: actionsListUser.SET_CART,
    payload
});

export const changeItem = <T extends ICartItem>(payload: T):IAction<T> => ({
    type: actionsListUser.CHANGE_AMOUNT_CART,
    payload
});
/*
export const clearCart = <T>():IAction<T> => ({
    type: actionsListUser.CLEAR_CART
});*/

export const removeItem = <T extends ICartItem>(payload: T):IAction<T> => ({
    type: actionsListUser.REMOVE_ITEM_CART,
    payload
});





export const sendCart = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { cart } = getState().user
        //if (cart.send.status === 'fetching') return  
        const token = getState().user.token
        dispatch(setSendCart(fetchingFetch))
        
        const cartToSend = cart.items.map(item => ({
           amount: item.amount,
           type: item.type,
           colorId: item.color,
           fiberId: item.fiber,
           productId: item.product._id,
        }))
        try {
            const response: Response = await fetch(`${process.env.REACT_BACK_URL}/api/user/cart`, {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({newCart: cartToSend})
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendCart({
                    status: 'error', 
                    message: result.message || {...empty}, 
                    errors: result.errors || []
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setCart({shouldUpdate: false}))
            dispatch(setSendCart({status: 'success', message: result.message}))
            
        } catch (e) {           
            dispatch(setSendCart({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }

    }
}
