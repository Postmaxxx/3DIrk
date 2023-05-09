import { IAction, IDataLoading, IDataSending, IDispatch, IOrderState, TLang } from "src/interfaces"
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



export const sendOrder = ({lang, text, sendFilesArr}: {lang: TLang, text: string, sendFilesArr: File[]}) => {
    return async function(dispatch: IDispatch) {
        const urlMessage:string = `https://api.telegram.org/bot${process.env.REACT_APP_TG_TOK}/sendMessage?chat_id=${process.env.REACT_APP_CHT_ID}&text=${text}`;
        const urlDocument= `https://api.telegram.org/bot${process.env.REACT_APP_TG_TOK}/sendDocument`;
        
        dispatch(setSendDataStatus({status: 'sending', message: `Sending message`}))

        await fetch(urlMessage)
            .then(res => {
                if (!res.ok) {
                    dispatch(setSendDataStatus({status: 'error', message: lang === 'en' ? `Error while sending a message. HTTP error, status: ${res.status}. Try again later.` : `Ошибка http при отправке сообщения, статус: ${res.status}. Пожалуйста, попробуйте позже.`}))
                    return
                }
            })
            .then(data => {})
            .catch(err => {
                dispatch(setSendDataStatus({status: 'error', message: lang === 'en' ? `Error while sending a message: ${err.message}. Please try again later.` : `Ошибка при отправке сообщения: ${err.message}. Пожалуйста, попробуйте позже.`}))
                return
            });
        

        Promise.all(
            sendFilesArr.map((file: File) => new Promise((res, rej) => {
                const formData: FormData = new FormData();
                formData.append('chat_id', process.env.REACT_APP_CHT_ID || '');
                formData.append('document', file, file.name);
                const options = {method: 'POST', body: formData};
                fetch(urlDocument, options)
                    .then(res => {
                        if (!res.ok) {
                            dispatch(setSendDataStatus({status: 'error', message: lang === 'en' ? `Error while sending files. HTTP error, status: ${res.status}. Try again later.` : `Ошибка http при отправке файлов, статус: ${res.status}. Пожалуйста, попробуйте позже.`}))
                            rej()
                            return
                        }
                })
                .then(data => {
                    res('ok')
                })
                .catch(error => {
                    dispatch(setSendDataStatus({status: 'error', message: lang === 'en' ? `Your message has been sent succesfully, but the error has been occured while sending a file:, ${file.name}, error: ${error.message}` : `Ваше сообщение было успешно отправлено, но возникла ошибка при отправке файла: ${file.name}, ошибка: ${error.message}`}))
                    rej()
                    return
                })
            }))
        ).then(data => {
            dispatch(setSendDataStatus({status: 'success', message: lang === 'en' ? `Your message ${sendFilesArr.length > 0 ? "and files have" : "has"} been sent` : `Ваше сообщение ${sendFilesArr.length > 0 ? "и вложения были успешно отправлены" : "было успешно отправлено"}`, }))
        })


    }
}