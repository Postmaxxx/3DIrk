import { IAction, IProductState, ICategoriesListItem, ICategory, ICategoryReceived, IColors, IDispatch, IProduct } from "src/interfaces"
import mockFibers from '../mocks/fibers'
import catalogFull from "../mocks/catalogFull";
import { actionsListProduct } from './actionsList'


export const setLoadDataStatusProduct = <T extends IProductState["dataLoading"]>(payload: T):IAction<T> => ({
    type: actionsListProduct.SET_LOAD_DATA_STATUS_PRODUCT,
    payload
});


export const setProduct = <T extends Omit<IProductState, "dataLoading">>(payload: T):IAction<T> => ({
    type: actionsListProduct.SET_DATA_PRODUCT,
    payload
});


export const loadProduct = (id: IProduct["id"]) => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusProduct({status: 'loading', message: `Loading product ${id}`}))
        try {
            new Promise((res, rej) => {
                setTimeout(() => {
                    let product = {} as Omit<IProductState, "dataLoading">
                    Object.keys(catalogFull).forEach(catalog => {
                        
                    })

                    const categoriesList: ICategoriesListItem[] = mockCatalog.map(category => {
                        return {
                            name: category.name,
                            id: category.id
                        }
                    })
                    if (categoriesList) {
                        console.log('list loaded');
                        res(categoriesList)
                    } else (
                        rej({mesasage: `CategoriesList not found`})
                    )
                }, 1000)
            }).then((data) => {
                dispatch(setProduct(data as ICategoriesListItem[]))
                dispatch(setLoadDataStatusProduct({status: 'success', message: `Product id=${id} loaded`}))
            }).catch(err => {
                dispatch(setLoadDataStatusProduct({status: 'error', message: `ERROR while loading product id=${id}: ${err}`}))
            })

        } catch (e) {
            dispatch(setLoadDataStatusProduct({status: 'error', message: `ERROR while loading product id=${id}: ${e}`}))
        }
    }
}

