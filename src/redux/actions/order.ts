import { IAction, ICartItem, IDispatch, IFetch, IFullState, TLang, TLangText } from "src/interfaces"
import { actionsListOrder } from './actionsList'
import { errorFetch, fetchingFetch, minTimeBetweenSendings, successFetch } from "src/assets/js/consts";


/*
export const setSendOrder = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_SEND_STATUS_ORDER,
    payload
});


export const setLoadOrder = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_LOAD_STATUS_ORDER,
    payload
});

export const setText = <T extends Partial<Pick<IOrderState, "name" | "email" | 'message' | "phone">>>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_ORDER_TEXT,
    payload
});


export const clearForm = <T>():IAction<T> => ({
    type: actionsListOrder.CLEAR_ORDER_FORM,
});


export const setFiles = <T extends File[]>(payload: T):IAction<T> => ({
    type: actionsListOrder.SET_ORDER_FILES,
    payload
});
*/





