import { IAction, ICartItem, IFetch, IOrderState } from "src/interfaces"
import initialOrderState from '../initialStates/order'
import { actionsListOrder } from '../actions/actionsList'




const reducerOrder = (state:IOrderState = initialOrderState, action: IAction<any>): IOrderState => {
    switch (action.type) {
        case actionsListOrder.SET_SEND_STATUS_ORDER: 
            return {
                ...state, 
                send: action.payload
            }
        case actionsListOrder.SET_LOAD_STATUS_ORDER: 
            return {
                ...state, 
                load: action.payload
            }
        case actionsListOrder.SET_ORDER_TEXT: 
            return {
                ...state, 
                ...action.payload as Partial<Pick<IOrderState, "name" | "email" | "message" | "phone">>
            }
        case actionsListOrder.CLEAR_ORDER_FORM: 
            return {
                ...state, 
                message: '',
            }
        case actionsListOrder.SET_ORDER_FILES: 
            return {
                ...state, 
                files: action.payload as File[],
            }












        default: return state
    }
}

export default reducerOrder