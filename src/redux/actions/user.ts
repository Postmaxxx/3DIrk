import { IAction, ICartItem, IDispatch, IErrRes, IFetch, IFullState, ILoggingForm, IMsgRes, IUserLoginResOk, IUserState, TLangText } from "src/interfaces";
import { actionsListUser } from './actionsList'
//import { setText } from "./order";
import { errorFetch, fetchingFetch, minTimeBetweenSendings, successFetch } from "src/assets/js/consts";

export const setUser = <T extends Partial<IUserState>>(payload: T):IAction<T> => ({
    type: actionsListUser.SET_USER,
    payload: payload
});


export const setSendOrder = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListUser.SET_SEND_STATUS_ORDER,
    payload: payload
});



export const register = ({name, email, phone, password}: ILoggingForm) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state
        dispatch(setUser({...user, auth: fetchingFetch}))
        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({name, email, phone, password})
            })    
            const result: IErrRes = await response.json() //message, errors
            if (response.status !== 201) {
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: result.message, 
                        errors: result.errors as TLangText[] || []
                    }
                }))
            }
            await login({email, password})(dispatch, getState)
        } catch (e) {   
            dispatch(setUser({...user,auth: {status: 'error', message: (e as IErrRes).message}}))
        } 
    }
}




export const login = ({email, password}: Pick<ILoggingForm, "email" | "password">) => {         
    return async function(dispatch: IDispatch, getState: () => IFullState) {              
        const { user } = getState() //get current user state
        dispatch(setUser({...user, auth: fetchingFetch}))
        try {
            const response: Response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify({email, password})
                })
            
            
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                
                return dispatch(setUser({
                    ...user, 
                    auth: {
                        status: 'error', 
                        message: (result as IErrRes).message, 
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
            dispatch(setUser({...user, auth: {status: 'error', message: (e as IErrRes).message}}))
        } 
    }
}





export const loginWithToken = () => {   
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { user } = getState() //get current user state        

        const savedUser = localStorage.getItem('user')
        const currentToken: string = savedUser ? JSON.parse(savedUser).token : null
        if (!currentToken) {
            return dispatch(setUser({...user, auth: {status: 'error', message: {en: 'Token not found', ru: 'Токен не найден'}, errors: []}}))
        }

        dispatch(setUser({...user, auth: fetchingFetch}))
        
        try {
            const response: Response = await fetch('/api/user/login-token', {
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
                        message: (result as IErrRes).message, 
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
            dispatch(setUser({...user, auth: {status: 'error', message: (e as IErrRes).message}}))
        } 
    }
}





interface ISendOrder {
    informer: (info: TLangText) => void
    message: string
    files: File[]
}


export const sendOrder = ({informer, message, files}: ISendOrder ) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { fibers, colors} = getState()
        const { user } = getState()
        const {lang} = getState().base
        const urlMessage= `https://api.telegram.org/bot${process.env.REACT_APP_TG_TOK}/sendMessage`;
        const urlDocument= `https://api.telegram.org/bot${process.env.REACT_APP_TG_TOK}/sendDocument`;
        dispatch(setSendOrder({...fetchingFetch, message: {en: 'Sending message', ru: 'Отправка сообщения'}}))

        const textCart = user.cart.items.reduce((text: string, item: ICartItem, i: number) => {
            return text + `${i+1}) ${item.product.name[lang]}
${lang === 'en' ? 'Options' : 'Версия'}: ${item.type} 
${lang === 'en' ? 'Fiber' : 'Материал'}: ${fibers.fibersList.find(fiberItem => fiberItem._id === item.fiber)?.short.name[lang]}
${lang === 'en' ? 'Color' : 'Цвет'}: ${colors.colors.find(color => color._id === item.color)?.name[lang]}
${lang === 'en' ? 'Amount' : 'Количество'}: ${item.amount}\n\n`
        }, '')

        const textOrder: string = `
${lang === 'en' ? 'Date' : 'Дата'}: ${new Date().toISOString().slice(0,10)}
${lang === 'en' ? 'Time' : 'Время'}: ${new Date().toISOString().slice(11, 19)}
${lang === 'en' ? 'Name' : 'Имя'}: ${user.name}
${lang === 'en' ? 'Email' : 'Почта'}: ${user.email}
${lang === 'en' ? 'Phone' : 'Телефон'}: ${user.phone}
${lang === 'en' ? 'Message' : 'Сообщение'}: ${user.message}`;

        const text = `${lang === 'en' ? 'New order' : 'Новый заказ'}:${textOrder}\n\n\n ${lang === 'en' ? 'Cart content' : 'Содержимое корзины'}: \n${textCart}${files.length > 0 ? (lang==='en' ? '\n\n\nAttached files:' : '\n\n\nПрикрепленные файлы:') : ''}`


        await fetch(urlMessage, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: process.env.REACT_APP_CHT_ID, text })
            })
            .then(res => {
                if (!res.ok) {
                    dispatch(setSendOrder({
                        ...errorFetch,
                        message: {
                            en: `Error while sending a message. Error: ${res}. Please try again later.`, 
                            ru: `Ошибка http при отправке сообщения: ${res}. Пожалуйста, попробуйте позже.`
                        }
                    }))
                    return
                }
            })
            .catch(err => {
                dispatch(setSendOrder({
                    ...errorFetch,
                    message: {
                        en: `Error while sending a message: ${err.message}. Please try again later.`,
                        ru: `Ошибка при отправке сообщения: ${err.message}. Пожалуйста, попробуйте позже.`
                    },
                }))
                return
            });


        files.reduce(async (acc: Promise<string>, file: File, i) => {
            await acc
            const message = {
                en: `Files to send left: ${files.length - i}`, 
                ru: `Осталось отправить файлов: ${files.length - i}`
            }
            informer(message)
            return new Promise<string>(async (res, rej) => {
                const timeStart = Date.now()
                const formData: FormData = new FormData();
                formData.append('chat_id', process.env.REACT_APP_CHT_ID || '');
                formData.append('document', file, file.name);
                const options = {method: 'POST', body: formData};
                
                await fetch(urlDocument, options)
                    .then(res => {
                        if (!res.ok) {
                            dispatch(setSendOrder({
                                ...errorFetch,
                                message: {
                                    en: `Error while sending files. HTTP error, status: ${res.status}. Try again later.`,
                                    ru: `Ошибка http при отправке файлов, статус: ${res.status}. Пожалуйста, попробуйте позже.`
                                }
                            }))
                            rej(lang === 'en' ? `Error while sending file "${file.name}": ${res.status}. Sending files has been aborted.` : `Error при отправке файла "${file.name}": ${res.status}. Отправка файлов прервана.`)
                        }
                    })
                    .then(data => {
                        const transitionSending = Date.now() - timeStart
                        setTimeout(() => { // if (sendingTime < minTimeBetweenSendings) => wait until (sendingTime >= minTimeBetweenSendings)
                            res(`File ${file.name} has been sent successfully`)
                        }, minTimeBetweenSendings - transitionSending)
                    })
                    .catch(error => {
                        dispatch(setSendOrder({
                            ...errorFetch,
                            message: {
                                en: `Your message has been sent succesfully, but the error has been occured while sending a file:, ${file.name}, error: ${error.message}`,
                                ru: `Ваше сообщение было успешно отправлено, но возникла ошибка при отправке файла: ${file.name}, ошибка: ${error.message}`
                            }
                        }))
                        rej(lang === 'en' ? `Error while sending file "${file.name}": ${error.message}. Sending files has been aborted.` : `Error при отправке файла "${file.name}": ${error.message}. Отправка файлов прервана.`)
                    })
            })

        }, Promise.resolve('Files sending started')).then(data => {
                dispatch(setSendOrder({
                    ...successFetch,
                    message: {
                        en: `Your message ${files.length > 0 ? "and files have" : "has"} been sent`,
                        ru: `Ваше сообщение ${files.length > 0 ? "и вложения были успешно отправлены" : "было успешно отправлено"}`
                    },
                    errors: []
                }))
            })
            .catch(err => {
                dispatch(setSendOrder({
                    ...errorFetch,
                    message: {
                        en: `The error occur while saving files: ${err}`,
                        ru: `Возникла ошибка при отправке файлов: ${err}` 
                    },
                }))
            })
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

export const setCart = <T extends ICartItem[]>(payload: T):IAction<T> => ({
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



/*
export const loadCart = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadCart({status: 'fetching', message: {en: `Loading cart`, ru: 'Загрузка корзины'}, errors: []}))
        const receivedData: string = await new Promise((res, rej) => {
            setTimeout(()=> {res(localStorage.getItem('cart') as string)}, 1000)
        })
        if (receivedData) {
            console.log('raw cart loaded', receivedData);
            const loadedItems: ICartItem[] = JSON.parse(receivedData) || []

            dispatch(setCart(loadedItems))
            dispatch(setLoadCart({status: 'success', message: {en: `Cart has been loaded`, ru: 'Корзина была загружена'}, errors: []}))
        } else {
            clearCart()
            dispatch(setLoadCart({status: 'success', message: {en: `Сart is empty`, ru: 'Корзина пуста'}, errors: []}))
        }
    }
}
*/





export const updateCart = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { cart } = getState().user
        const token = getState().user.token
        dispatch(setSendCart(fetchingFetch))

        try {
            const response: Response = await fetch('/api/user/cart', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cart)
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendCart({
                    status: 'error', 
                    message: result.message, 
                    errors: result.errors
                }))
            }
            const result: IMsgRes = await response.json() //message, errors
            
            dispatch(setSendCart({status: 'success', message: result.message}))
            
        } catch (e) {           
            dispatch(setSendCart({status: 'error', message: {en: `Error "${e}", try again later`, ru: `Ошибка "${e}", попробуйте позже`}}))
        }

    }
}























/*
export const saveCart = (items: ICartItem[]) => {
    return async function(dispatch: IDispatch) {
        dispatch(setSendOrderCart({status: 'fetching', message: {en: 'Saving cart', ru: 'Сохраняем корзину'}, errors: []}))
        const dataToSave = items.map(item => {
            return {
                ...item,
                product: item.product
            }
        })
        localStorage.setItem('cart', JSON.stringify(dataToSave))
        dispatch(setSendOrderCart({status: 'success', message: {en: 'Cart has been saved', ru: 'Корзина сохранена'}, errors: []}))
    }
}
*/



/*
export const sendCart = () => {   
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { order, user } = getState() //get current cart state
       
        dispatch(setSendCart({status: 'fetching', message: {en: 'Sending cart', ru: 'Отправка корзины'}, errors: []}))
        
        try {
            const cartToSend = order.cart.items.map(item => {
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
                auth: {status: 'success', message: result.message, errors: []},
            }))
            localStorage.setItem('user', JSON.stringify({token: result.user.token}))
        } catch (e) {         
            //dispatch(setSendOrderCart({...user, auth: {status: 'error', message: (e as IErrRes).message, errors: []}}))
        } 
    }
}*/
