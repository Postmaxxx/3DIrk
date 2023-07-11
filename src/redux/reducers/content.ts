import { IAction, IContentState } from "../../interfaces"
import initialContentState from '../initialStates/content'
import { actionsListContent } from '../actions/actionsList'


const reducerContent = (state:IContentState = initialContentState, action: IAction<any>): IContentState => {
    switch (action.type) {
        case actionsListContent.SET_SEND_STATUS_CONTENT: 
            return {
                ...state, 
                send: action.payload
            }
        case actionsListContent.SET_LOAD_STATUS_CONTENT: 
            return {
                ...state, 
                load: action.payload
            }
        case actionsListContent.SET_CONTENT: 
            return {
                ...state, 
                ...action.payload as IContentState
            }
        default: return state
    }
}

export default reducerContent