import { IAction, ICartItem, ICartState, IFetch } from "src/interfaces"
import initialCartState from '../initialStates/cart'
import { actionsListCart } from '../actions/actionsList'


const reducerCart  = (state: ICartState = initialCartState, action: IAction<unknown>): ICartState => {
    switch (action.type) {
        case actionsListCart.SET_LOAD_DATA_STATUS_CART:
            const categoriesCartLoadStatus = action.payload as IFetch
            return {
                ...state, 
                load: categoriesCartLoadStatus
            }

        case actionsListCart.SET_SEND_DATA_STATUS_CART:
            const categoriesCartSendStatus = action.payload as IFetch
            return {
                ...state, 
                load: categoriesCartSendStatus
            }

        case actionsListCart.CLEAR_CART:
            return {
                ...state, 
                items: []
            }

        case actionsListCart.SET_CART:
            return {
                ...state, 
                items: action.payload as ICartItem[]
                
            }

        case actionsListCart.ADD_ITEM: 
            const newItem = action.payload as ICartItem
            let itemExist: boolean = false;
            const newItems: ICartItem[] = state.items.map(item => {
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
                items: newItems
            } 

        case actionsListCart.CHANGE_AMOUNT:
            const itemToChange = action.payload as ICartItem;
            const changedItems = state.items.map(item => {
                return (itemToChange.product === item.product && 
                        itemToChange.fiber === item.fiber &&
                        itemToChange.color === item.color &&
                        JSON.stringify(itemToChange.type.en) !== JSON.stringify(itemToChange.type.en)) ? itemToChange : item
            })
            return {
                ...state, 
                items: changedItems
            } 

        case actionsListCart.REMOVE_ITEM:
            const itemId = action.payload as ICartItem
            return {
                ...state, 
                items: state.items.filter(item => itemId !== item)
            } 

        default: return state
    }
}

export default reducerCart