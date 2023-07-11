import { IAction, ICartItem, IFetch, IOrdersState } from "../../interfaces"
import initialOrderState from '../initialStates/orders'
import { actionsListOrders } from '../actions/actionsList'




const reducerOrders = (state:IOrdersState = initialOrderState, action: IAction<any>): IOrdersState => {
    switch (action.type) {
        case actionsListOrders.SET_SEND_STATUS_ORDERS: 
            return {
                ...state, 
                send: action.payload
            }
        case actionsListOrders.SET_LOAD_STATUS_ORDERS: 
            return {
                ...state, 
                load: action.payload
            }
        case actionsListOrders.SET_ORDERS: 
            return {
                ...state, 
                users: action.payload
            }


        case actionsListOrders.SET_LOAD_USERLIST: 
            return {
                ...state, 
                userList: {
                    ...state.userList,
                    load: action.payload
                }
            }
        case actionsListOrders.SET_USERLIST: 
            return {
                ...state, 
                userList: {
                    ...state.userList,
                    list: action.payload
                }
            }


        default: return state
    }
}

export default reducerOrders