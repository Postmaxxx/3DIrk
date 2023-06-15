import { IAction, IUserState } from "src/interfaces"
import initialUserState from '../initialStates/user'
import { actionsListUser } from '../actions/actionsList'

const reducerUser = (state:IUserState = initialUserState, action: IAction<any>): IUserState => {
    switch (action.type) {
        case actionsListUser.SET_USER: 
        const newProps: Partial<IUserState> = action.payload
            const newUser: IUserState = {...state}
            Object.keys(newProps).forEach(key => {
                newUser[key as keyof IUserState] = newProps[key as keyof IUserState] as never;
              });
            return newUser
        default: return state
    }
}

export default reducerUser