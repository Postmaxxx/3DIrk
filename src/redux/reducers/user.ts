import { IAction, ICartItem, ICartState, IFetch, IUserState } from "../../interfaces"
import initialUserState from '../initialStates/user'
import { actionsListUser } from '../actions/actionsList'

const reducerUser = (state:IUserState = initialUserState, action: IAction<any>): IUserState => {
    switch (action.type) {
        case actionsListUser.SET_USER: 
        const newProps: Partial<IUserState> = action.payload
            const newUser: IUserState = {...state}
            Object.keys(newProps).forEach(key => {
                newUser[key as keyof IUserState] = newProps[key as keyof IUserState] as never;
            })
            return newUser

        case actionsListUser.SET_USER_AUTH: 
        const newAuth: IFetch = action.payload
            const newUserAuth: IUserState = {
                ...state,
                auth: newAuth
            }
            return newUserAuth

        case actionsListUser.SET_SEND_STATUS_ORDER: 
            return {
                ...state, 
                sendOrder: action.payload
            }

        case actionsListUser.SET_SEND_STATUS_CART: 
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    send:  action.payload
                }

            }
        case actionsListUser.SET_LOAD_STATUS_CART: 
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    load:  action.payload
                }

            }



        case actionsListUser.SET_CART:
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    ...action.payload as Partial<ICartState>
                }
            }


        case actionsListUser.ADD_ITEM_CART: 
            const newItem = action.payload as ICartItem
            let itemInCart: boolean = false;
            const newItems: ICartItem[] = state.cart.items.map(item => {
                let itemTheSame = true
                if (item.color !== newItem.color) {itemTheSame = false}
                if (item.fiber !== newItem.fiber) {itemTheSame = false}
                if (item.product._id !== newItem.product._id) {itemTheSame = false}
                if (item.type.en !== newItem.type.en) {itemTheSame = false}

                if (!itemTheSame) return item
                itemInCart = true
                
                return {...item, amount: item.amount + newItem.amount }
            })
            !itemInCart && newItems.push(newItem)
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    shouldUpdate: true,
                    items:  newItems
                }
            } 

        case actionsListUser.CHANGE_AMOUNT_CART:
            const itemToChange = action.payload as ICartItem;
            const changedItems = state.cart.items.map(item =>  
                itemToChange.product._id === item.product._id && 
                itemToChange.fiber === item.fiber &&
                itemToChange.color === item.color &&
                itemToChange.type.en === item.type.en &&
                itemToChange.type.ru === item.type.ru ? itemToChange : item
            )
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    shouldUpdate: true,
                    items:  changedItems
                }
                
            } 

        case actionsListUser.REMOVE_ITEM_CART:
            const itemId = action.payload as ICartItem
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    shouldUpdate: true,
                    items:  state.cart.items.filter(item => itemId !== item)
                }
            } 

        default: return state
    }
}

export default reducerUser