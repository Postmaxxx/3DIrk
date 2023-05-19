import { IAction, ICartItem, ICartState, IProduct } from "src/interfaces"
import initialCartState from '../initialStates/cart'
import { actionsListCart } from '../actions/actionsList'


const reducerCart  = (state: ICartState = initialCartState, action: IAction<unknown>): ICartState => {
    switch (action.type) {
        case actionsListCart.SET_LOAD_DATA_STATUS_CART:
            const categoriesCartLoadStatus = action.payload as ICartState["dataLoading"]
            return {
                ...state, 
                dataLoading: categoriesCartLoadStatus
            }

        case actionsListCart.SET_SEND_DATA_STATUS_CART:
            const categoriesCartSendStatus = action.payload as ICartState["dataSending"]
            return {
                ...state, 
                dataSending: categoriesCartSendStatus
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
            const checklist: (keyof ICartItem)[] = ['color', 'fiber', 'type']
            let itemExist: boolean = false;
            const newItems: ICartItem[] = state.items.map(item => {
                let itemTheSame: boolean = checklist.reduce((acc, checkItem) => newItem[checkItem] === item[checkItem] ? acc : false, true)
                console.log('itemTheSame', itemTheSame);
                
                if (newItem.product.id !== item.product.id) {itemTheSame = false}
                if (!itemTheSame) return item
                itemExist = true
                return {...item, amount: item.amount + newItem.amount }
            })
            itemExist || newItems.push(newItem)
            return {
                ...state, 
                items: newItems
            } 

        case actionsListCart.CHANGE_ITEM:
            const itemToChange = action.payload as ICartItem
            return {
                ...state, 
                items: state.items.map(item => itemToChange.product.id === item.product.id ? itemToChange : item)
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