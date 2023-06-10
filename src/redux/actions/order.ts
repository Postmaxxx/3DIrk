import { IAction, ICartItem, ICartState, IDataLoading, IDataSending, IDispatch, IOrderState, TLang, TLangText } from "src/interfaces"
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


export const setSendDataStatus = <T extends IDataSending>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_SEND_DATA_STATUS_ORDER,
    payload
});


interface ISendOrder {
    lang: TLang
    text: string
    filesArr: File[]
    cart: ICartState
    informer: (message: TLangText) => void
}

const minTimeBetweenSendings = 1000; //in ms

export const sendOrder = ({lang, text, filesArr, cart, informer}: ISendOrder) => {
    return async function(dispatch: IDispatch) {
        const urlMessage= `https://api.telegram.org/bot${process.env.REACT_APP_TG_TOK}/sendMessage`;
        const urlDocument= `https://api.telegram.org/bot${process.env.REACT_APP_TG_TOK}/sendDocument`;
        
        dispatch(setSendDataStatus({status: 'sending', message: {en: 'Sending message', ru: 'Отправка сообщения'}}))
       
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
                        }
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
                    }
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
                        dispatch(setSendDataStatus({
                            status: 'error', 
                            message: {
                                en: `Your message has been sent succesfully, but the error has been occured while sending a file:, ${file.name}, error: ${error.message}`,
                                ru: `Ваше сообщение было успешно отправлено, но возникла ошибка при отправке файла: ${file.name}, ошибка: ${error.message}`
                            }
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
                    }
                }))
            })
            .catch(err => {
                dispatch(setSendDataStatus({
                    status: 'error', 
                    message: {
                        en: `The error occur while saving files: ${err}`,
                        ru: `Возникла ошибка при отправке файлов: ${err}` 
                    }
                }))
            })
    }
}