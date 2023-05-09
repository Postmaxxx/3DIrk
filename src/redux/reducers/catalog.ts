import { IAction, ICatalogState, INewsState } from "src/interfaces"
import initialCatalogState from '../initialStates/catalog'
import { actionsListCatalog } from '../actions/actionsList'




const reducerCatalog = (state: ICatalogState = initialCatalogState, action: IAction<any>): ICatalogState => {
    switch (action.type) {
        case actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORIES_LIST: 
            return {
                ...state, 
                categoriesListLoading: action.payload
            }
        case actionsListCatalog.SET_DATA_CATEGORIES_LIST: 
            return {
                ...state, 
                categoriesList: action.payload
            }
        case actionsListCatalog.SET_SELECTED_CATEGORY: 
            return {
                ...state, 
                selectedCategory: action.payload
            }
        case actionsListCatalog.SET_SELECTED_PRODUCT: 
            return {
                ...state, 
                selectedProduct: action.payload
            }
        case actionsListCatalog.SET_SELECTED_IMAGE: 
            return {
                ...state, 
                selectedProductImage: action.payload
            }

        case actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORY: 
            return {
                ...state, 
                categories: {
                    ...state.categories,
                    [state.selectedCategory]: action.payload
                }
            }

        default: return {...state}
    }
}

export default reducerCatalog