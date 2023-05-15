import { IAction, IProductState, ICategoriesListItem, ICategory, ICategoryReceived, IColors, IDispatch, IProduct } from "src/interfaces"
import mockFibers from '../mocks/fibers'
import catalogFull from "../mocks/catalogFull";
import { actionsListProduct } from './actionsList'
import mockProducts from "../mocks/catalogFull";


export const setLoadDataStatusProduct = <T extends IProductState["dataLoading"]>(payload: T):IAction<T> => ({
    type: actionsListProduct.SET_LOAD_DATA_STATUS_PRODUCT,
    payload
});


export const setProduct = <T extends Omit<IProductState, "dataLoading" | "selectedImage">>(payload: T):IAction<T> => ({
    type: actionsListProduct.SET_DATA_PRODUCT,
    payload
});

export const setSelectedImage = <T extends IProductState["selectedImage"]>(payload: T):IAction<T> => ({
    type: actionsListProduct.SET_SELECTED_IMAGE,
    payload
});



export const loadProduct = (id: IProduct["id"]) => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusProduct({status: 'loading', message: `Loading product ${id}`}))
        try {
            new Promise((res, rej) => {
                setTimeout(() => {
                    const product = mockProducts.find(product => product.id === id)
                    if (product) {
                        console.log(`product ${id} loaded`);
                        res(product)
                    } else (
                        rej({mesasage: `product ${id} not found`})
                    )
                }, 1000)
            }).then((data) => {
                dispatch(setProduct(data as IProduct))
                dispatch(setLoadDataStatusProduct({status: 'success', message: `Product id=${id} loaded`}))
            }).catch(err => {
                dispatch(setLoadDataStatusProduct({status: 'error', message: `ERROR while loading product id=${id}: ${err}`}))
            })

        } catch (e) {
            dispatch(setLoadDataStatusProduct({status: 'error', message: `ERROR while loading product id=${id}: ${e}`}))
        }
    }
}

