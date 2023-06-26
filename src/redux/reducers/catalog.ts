import { IAction, ICatalogItem, ICatalogState, ICategory, IFetch, IProduct } from "src/interfaces"
import initialCatalogState from '../initialStates/catalog'
import { actionsListCatalog } from '../actions/actionsList'




const reducerCatalog = (state: ICatalogState = initialCatalogState, action: IAction<unknown>): ICatalogState => {
    switch (action.type) {
        case actionsListCatalog.SET_LOAD_STATUS_CATEGORIES_LIST:
            return {
                ...state, 
                catalog: {
                    ...state.catalog,
                    load: action.payload as IFetch
                }
            }
        case actionsListCatalog.SET_SEND_STATUS_CATEGORIES_LIST:
            return {
                ...state, 
                catalog: {
                    ...state.catalog,
                    send: action.payload as IFetch
                }
            }
        case actionsListCatalog.SET_DATA_CATEGORIES_LIST: 
            const categoriesList = action.payload as ICatalogItem[]
            return {
                ...state, 
                catalog: {
                    ...state.catalog,
                    list: categoriesList
                }
            }

        case actionsListCatalog.SET_LOAD_STATUS_CATEGORY: 
            const dataLoadingCategory = action.payload as IFetch
            return {
                ...state, 
                category: {
                    ...state.category,
                    loadCategory: dataLoadingCategory
                }
            }
        case actionsListCatalog.SET_DATA_CATEGORY: 
            const dataCategory = action.payload as Omit<ICategory, "loadCategory" | 'page' | 'product' | "loadProduct">
            return {
                ...state, 
                category: {
                    ...state.category,
                    ...dataCategory
                }
            }
        case actionsListCatalog.SET_PAGE: 
            const selectedPage = action.payload as ICategory["page"]
            return {
                ...state, 
                category: {
                    ...state.category,
                    page: selectedPage
                }
            }






        case actionsListCatalog.SET_LOAD_STATUS_PRODUCT: 
            const loadProductStatus = action.payload as IFetch
            return {
                ...state, 
                category: {
                    ...state.category,
                    loadProduct: loadProductStatus
                }
            }
        case actionsListCatalog.SET_DATA_PRODUCT: 
            const product = action.payload as IProduct
            return {
                ...state, 
                category: {
                    ...state.category,
                    product: product
                }
            }

        default: return state
    }
}

export default reducerCatalog