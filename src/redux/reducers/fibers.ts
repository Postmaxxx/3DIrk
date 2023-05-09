import { IAction, IFibersState } from "src/interfaces"
import initialFibersState from '../initialStates/fibers'
import { actionsListFibers } from '../actions/actionsList'




const reducerFibers = (state:IFibersState = initialFibersState, action: IAction<any>): IFibersState => {
    switch (action.type) {
        case actionsListFibers.SET_LOAD_DATA_STATUS_FIBERS: 
            return {
                ...state, 
                dataLoading: action.payload
            }
        case actionsListFibers.SET_DATA_FIBERS: 
            return {
                ...state, 
                fibersList: [...action.payload]
            }

        default: return {...state}
    }
}

export default reducerFibers