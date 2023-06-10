import { IAction, IColorsState } from "src/interfaces"
import initialColorsState from '../initialStates/colors'
import { actionsListColors } from '../actions/actionsList'


const reducerColors = (state:IColorsState = initialColorsState, action: IAction<any>): IColorsState => {
    switch (action.type) {
        case actionsListColors.SET_LOAD_DATA_STATUS_COLORS: 
            return {
                ...state, 
                load: action.payload
            }
        case actionsListColors.SET_DATA_COLORS: 
            return {
                ...state, 
                colors: action.payload
            }

        default: return state
    }
}

export default reducerColors