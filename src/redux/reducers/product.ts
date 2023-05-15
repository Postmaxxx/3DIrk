import { IAction, IProductState } from "src/interfaces"
import initialProductState from '../initialStates/product'
import { actionsListProduct } from '../actions/actionsList'


const reducerOrder = (state:IProductState = initialProductState, action: IAction<any>): IProductState => {
    switch (action.type) {
        case actionsListProduct.SET_LOAD_DATA_STATUS_PRODUCT: 
            return {
                ...state, 
                dataLoading: action.payload
            }
        case actionsListProduct.SET_DATA_PRODUCT: 
            return {
                ...state, 
                ...action.payload
            }
        case actionsListProduct.SET_SELECTED_IMAGE: 
            const selectedImage = action.payload as IProductState["selectedImage"]
            return {
                ...state, 
                selectedImage: selectedImage
            }

        default: return {...state}
    }
}

export default reducerOrder