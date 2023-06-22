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






        case actionsListOrder.SET_LOAD_STATUS_CART:
            const categoriesCartLoadStatus = action.payload as IFetch
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    load: categoriesCartLoadStatus
                }
            }

        case actionsListOrder.SET_SEND_STATUS_CART:
            const categoriesCartSendStatus = action.payload as IFetch
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    send: categoriesCartSendStatus
                }
            }

        case actionsListOrder.CLEAR_CART:
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    items: []
                }
            }

        case actionsListOrder.SET_CART:
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    items:  action.payload as ICartItem[]
                }
                
            }

        case actionsListOrder.ADD_ITEM: 
            const newItem = action.payload as ICartItem
            let itemExist: boolean = false;
            const newItems: ICartItem[] = state.cart.items.map(item => {
                let itemTheSame = true
                if (item.color !== newItem.color) {itemTheSame = false}
                if (item.fiber !== newItem.fiber) {itemTheSame = false}
                if (item.product !== newItem.product) {itemTheSame = false}
                if (JSON.stringify(item.type.en) !== JSON.stringify(newItem.type.en)) {itemTheSame = false}


                if (!itemTheSame) return item
                itemExist = true
                return {...item, amount: item.amount + newItem.amount }
            })
            !itemExist && newItems.push(newItem)
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    items:  newItems
                }
            } 

        case actionsListOrder.CHANGE_AMOUNT:
            const itemToChange = action.payload as ICartItem;
            const changedItems = state.cart.items.map(item => {
                return (itemToChange.product === item.product && 
                        itemToChange.fiber === item.fiber &&
                        itemToChange.color === item.color &&
                        JSON.stringify(itemToChange.type.en) !== JSON.stringify(itemToChange.type.en)) ? itemToChange : item
            })
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    items:  changedItems
                }
                
            } 

        case actionsListOrder.REMOVE_ITEM:
            const itemId = action.payload as ICartItem
            return {
                ...state, 
                cart: {
                    ...state.cart,
                    items:  state.cart.items.filter(item => itemId !== item)
                }
            } 



        default: return state
    }
}

export default reducerOrder