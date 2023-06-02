import { IAction, ICatalogState, ICategory } from "src/interfaces"
import initialCatalogState from '../initialStates/catalog'
import { actionsListCatalog } from '../actions/actionsList'




const reducerCatalog = (state: ICatalogState = initialCatalogState, action: IAction<unknown>): ICatalogState => {
    switch (action.type) {
        case actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORIES_LIST:
            const categoriesListStatus = action.payload as ICatalogState["categoriesListLoading"]
            return {
                ...state, 
                categoriesListLoading: categoriesListStatus
            }
        case actionsListCatalog.SET_DATA_CATEGORIES_LIST: 
            const categoriesList = action.payload as ICatalogState["categoriesList"]
            return {
                ...state, 
                categoriesList: categoriesList
            }
        case actionsListCatalog.SET_SELECTED_CATEGORY: 
            const selectedCategory = action.payload as ICatalogState["selectedCategory"]
            return {
                ...state, 
                selectedCategory: selectedCategory
            }
        case actionsListCatalog.SET_SELECTED_PRODUCT: 
            const selectedProduct = action.payload as ICatalogState["selectedProduct"]
            return {
                ...state, 
                selectedProduct: selectedProduct
            }
        case actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORY: 
            const dataLoadingCategory = action.payload as Pick<ICategory, "dataLoading" | "id">
            return {
                ...state, 
                categories: {
                    ...state.categories,
                    [dataLoadingCategory.id]: {
                        ...state.categories[dataLoadingCategory.id],
                        dataLoading: dataLoadingCategory.dataLoading
                    }
                }
            }
        case actionsListCatalog.SET_DATA_CATEGORY: 
            const dataCategory = action.payload as Omit<ICategory, "dataLoading">
            return {
                ...state, 
                categories: {
                    ...state.categories,
                    [dataCategory.id]: {
                        ...state.categories[dataCategory.id],
                        id: dataCategory.id,
                        name: dataCategory.name,
                        products: dataCategory.products,
                        page: dataCategory.page
                    }
                }
            }
        case actionsListCatalog.SET_PAGE: 
            const selectedPage = action.payload as ICategory["page"]
            return {
                ...state, 
                categories: {
                    ...state.categories,
                    [state.selectedCategory]: {
                        ...state.categories[state.selectedCategory],
                        page: selectedPage
                    }
                }
            }

        default: return state
    }
}

export default reducerCatalog