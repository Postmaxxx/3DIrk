import { IAction, ICartItem, ICartState, IDispatch, IFetch, IFullState, TLang, TLangText } from "src/interfaces"
import { actionsListOrder } from './actionsList'

export const setName = <T extends string>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_ORDER_NAME,
    payload
});

export const setPhone = <T extends string>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_ORDER_PHONE,
    payload
});

export const setEmail = <T extends string>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_ORDER_EMAIL,
    payload
});

export const setMessage = <T extends string>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_ORDER_MESSAGE,
    payload
});

export const clearFiles = <T>():IAction<T> => ({
    type: actionsListOrder.CLEAR_ORDER_FILES,
});


export const clearForm = <T>():IAction<T> => ({
    type: actionsListOrder.CLEAR_ORDER_FORM,
});


export const addFiles = <T extends File[]>(payload: T):IAction<T> => ({
    type: actionsListOrder.ADD_ORDER_FILES,
    payload
});


export const setSendDataStatus = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_SEND_STATUS_ORDER,
    payload
});


interface ISendOrder {
    lang: TLang
    text: string
    filesArr: File[]
    informer: (message: TLangText) => void
}

const minTimeBetweenSendings = 1000; //in ms

export const sendOrder = ({lang, text, filesArr, informer}: ISendOrder) => {
    return async function(dispatch: IDispatch) {
        const urlMessage= `https://api.telegram.org/bot${process.env.REACT_APP_TG_TOK}/sendMessage`;
        const urlDocument= `https://api.telegram.org/bot${process.env.REACT_APP_TG_TOK}/sendDocument`;
        
        dispatch(setSendDataStatus({status: 'fetching', message: {en: 'Sending message', ru: 'Отправка сообщения'}, errors: []}))
       
        await fetch(urlMessage, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: process.env.REACT_APP_CHT_ID,
                text
              })
            })
            .then(res => {
                if (!res.ok) {
                    dispatch(setSendDataStatus({
                        status: 'error', 
                        message: {
                            en: `Error while sending a message. HTTP error, status: ${res.status}. Try again later.`, 
                            ru: `Ошибка http при отправке сообщения, статус: ${res.status}. Пожалуйста, попробуйте позже.`
                        },
                        errors: []
                    }))
                    return
                }
            })
            .then(data => {})
            .catch(err => {
                dispatch(setSendDataStatus({
                    status: 'error', 
                    message: {
                        en: `Error while sending a message: ${err.message}. Please try again later.`,
                        ru: `Ошибка при отправке сообщения: ${err.message}. Пожалуйста, попробуйте позже.`
                    },
                    errors: []
                }))
                return
            });

        filesArr.reduce(async (acc: Promise<string>, file: File, i) => {
            await acc
            const message = {
                en: `Files to send left: ${filesArr.length - i}`, 
                ru: `Осталось отправить файлов: ${filesArr.length - i}`
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
                            dispatch(setSendDataStatus({
                                status: 'error', 
                                message: {
                                    en: `Error while sending files. HTTP error, status: ${res.status}. Try again later.`,
                                    ru: `Ошибка http при отправке файлов, статус: ${res.status}. Пожалуйста, попробуйте позже.`
                                },
                                errors: []
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
                        dispatch(setSendDataStatus({
                            status: 'error', 
                            message: {
                                en: `Your message has been sent succesfully, but the error has been occured while sending a file:, ${file.name}, error: ${error.message}`,
                                ru: `Ваше сообщение было успешно отправлено, но возникла ошибка при отправке файла: ${file.name}, ошибка: ${error.message}`
                            },
                            errors: []
                        }))
                        rej(lang === 'en' ? `Error while sending file "${file.name}": ${error.message}. Sending files has been aborted.` : `Error при отправке файла "${file.name}": ${error.message}. Отправка файлов прервана.`)
                    })
            })

        }, Promise.resolve('Files sending started'))
            .then(data => {
                dispatch(setSendDataStatus({
                    status: 'success', 
                    message: {
                        en: `Your message ${filesArr.length > 0 ? "and files have" : "has"} been sent`,
                        ru: `Ваше сообщение ${filesArr.length > 0 ? "и вложения были успешно отправлены" : "было успешно отправлено"}`
                    },
                    errors: []
                }))
            })
            .catch(err => {
                dispatch(setSendDataStatus({
                    status: 'error', 
                    message: {
                        en: `The error occur while saving files: ${err}`,
                        ru: `Возникла ошибка при отправке файлов: ${err}` 
                    },
                    errors: []
                }))
            })
    }
}


//============================================== CART
export const setLoadDataStatusCart = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_LOAD_STATUS_CART,
    payload
});


export const setSendDataStatusCart = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_SEND_STATUS_CART,
    payload
});


export const addItem = <T extends ICartItem>(payload: T):IAction<T> => ({
    type: actionsListOrder.ADD_ITEM,
    payload
});

export const setCart = <T extends ICartItem[]>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_CART,
    payload
});

export const changeItem = <T extends ICartItem>(payload: T):IAction<T> => ({
    type: actionsListOrder.CHANGE_AMOUNT,
    payload
});

export const clearCart = <T>():IAction<T> => ({
    type: actionsListOrder.CLEAR_CART
});

export const removeItem = <T extends ICartItem>(payload: T):IAction<T> => ({
    type: actionsListOrder.REMOVE_ITEM,
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
        const { order, user } = getState() //get current cart state
       
        dispatch(setSendDataStatusCart({status: 'fetching', message: {en: 'Sending cart', ru: 'Отправка корзины'}, errors: []}))
        
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
