import { IAction, IOrderState } from "src/interfaces"
import initialOrderState from '../initialStates/order'
import { actionsListOrder } from '../actions/actionsList'




const reducerOrder = (state:IOrderState = initialOrderState, action: IAction<any>): IOrderState => {
    switch (action.type) {
        case actionsListOrder.SET_SEND_DATA_STATUS_ORDER: 
            return {
                ...state, 
                dataSending: action.payload
            }
        case actionsListOrder.SET_ORDER_NAME: 
            return {
                ...state, 
                name: action.payload
            }
        case actionsListOrder.SET_ORDER_PHONE: 
            return {
                ...state, 
                phone: action.payload
            }
        case actionsListOrder.SET_ORDER_EMAIL: 
            return {
                ...state, 
                email: action.payload
            }
        case actionsListOrder.SET_ORDER_MESSAGE: 
            return {
                ...state, 
                message: action.payload
            }
        case actionsListOrder.CLEAR_ORDER_FORM: 
            return {
                ...state, 
                message: '',
            }
        case actionsListOrder.CLEAR_ORDER_FILES: 
            return {
                ...state, 
                files: [],
            }
        case actionsListOrder.ADD_ORDER_FILES: 
            return {
                ...state, 
                files: state.files.concat(action.payload),
            }


        default: return {...state}
    }
}

export default reducerOrder