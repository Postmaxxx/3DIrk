import { IAction, IFibersState } from "src/interfaces"
import initialFibersState from '../initialStates/fibers'
import { actionsListFibers } from '../actions/actionsList'




const reducerFibers = (state:IFibersState = initialFibersState, action: IAction<any>): IFibersState => {
    switch (action.type) {
        case actionsListFibers.SET_LOAD_STATUS_FIBERS: 
            return {
                ...state, 
                load: action.payload
            }
        case actionsListFibers.SET_SEND_STATUS_FIBERS: 
            return {
                ...state, 
                send: action.payload
            }
        case actionsListFibers.SET_DATA_FIBERS: 
            return {
                ...state, 
                fibersList: [...action.payload]
            }
        case actionsListFibers.SET_SELECTED_FIBER: 
            return {
                ...state, 
                selected: action.payload
            }
        default: return state
    }
}

export default reducerFibers