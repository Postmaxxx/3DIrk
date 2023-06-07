import { IAction, IUserState } from "src/interfaces"
import initialUserState from '../initialStates/user'
import { actionsListUser } from '../actions/actionsList'

const reducerBase = (state:IUserState = initialUserState, action: IAction<any>): IUserState => {
    switch (action.type) {
        case actionsListUser.SET_USER: 
            const newData: IUserState = {...state}
            for (let key in action.payload) {
                newData[key as keyof IUserState] = action.payload[key]
            }           
            return newData
        default: return state
    }
}

export default reducerBase