import { IAction, ICatalogItem, ICategory, IDispatch, IErrRes, IFetch, IFullState, IMsgRes, IProduct, TId, TLangText } from "../../interfaces"
import mockProducts from '../mocks/catalogFull'
import { actionsListCatalog } from './actionsList'
import mockCategoriesList from "../mocks/categoriesList"
import { resetFetch, successFetch } from "src/assets/js/consts";

export const setLoadCatalog = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_STATUS_CATEGORIES_LIST,
    payload
});

export const setSendCatalog = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_SEND_STATUS_CATEGORIES_LIST,
    payload
});

export const setCatalog = <T extends ICatalogItem[]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_CATEGORIES_LIST,
    payload
});


export const loadCatalog = () => {
    return async function(dispatch: IDispatch) {
        //const {catalog} = getState()
        dispatch(setLoadCatalog(resetFetch))
        try {
            const response: Response = await fetch('/api/catalog/list', {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendCatalog({
                    status: 'error', 
                    message: (result as IErrRes).message, 
                    errors: result.errors
                }
                ))
            }
            const result = await response.json() //message, errors
            dispatch(setCatalog(result.list as ICatalogItem[]))
            dispatch(setLoadCatalog(successFetch))
            
            //loadCategory((data as ICatalogItem[])[0]._id)(dispatch) //load default category
        } catch (e) {
            dispatch(setLoadCatalog({status: 'error', message: {en:`Error while loading catalog: ${e}`, ru: `Ошибка при загрузке каталога: ${e}`}}))
        }
    }
}



export const sendCatalog = (newCatalog: ICatalogItem[]) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { token } = getState().user
        dispatch(setSendCatalog(resetFetch))
        
        try {
            const response: Response = await fetch('/api/catalog/list', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({newCatalog})
            })
            

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendCatalog({
                        status: 'error', 
                        message: (result as IErrRes).message, 
                        errors: result.errors
                    }
                ))
            }
            const result = await response.json() //message, errors
            dispatch(setSendCatalog({status: 'success', message: result.message}))
        } catch (e) {
            dispatch(setSendCatalog({status: 'error', message: {en:`Error while sending catalog: ${e}`, ru: `Ошибка при загрузке каталога: ${e}`}}))
        }
    }
}













export const setLoadCategory = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_STATUS_CATEGORY,
    payload
});


export const setCategory = <T extends Omit<ICategory, "loadCategory" | "loadProduct" | "product" | "page">>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_CATEGORY,
    payload
});




export const loadCategory = (_id: TId) => {    
    return async function(dispatch: IDispatch) {
        dispatch(setLoadCategory({status: 'fetching', message: {en: `Loading category`, ru: 'Загрузка категории'}, errors: []}))
        try {
            const receivedProducts: IProduct[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    const products: IProduct[] = mockProducts.filter(product => 
                        product.categoryId === _id)
                    products? res(products) : rej(`Category ${_id} is empty`)
                    //console.log(`category ${id} loaded`);
                }, 200)
            })
            
            const categoryName: TLangText = mockCategoriesList.find(category => category._id === _id)?.name || {en: 'Other', ru: 'Другое'}
            const data: Omit<ICategory, "loadCategory" | "loadProduct" | "product"> = {
                _id,
                name: categoryName,
                products: receivedProducts,
                total: receivedProducts.length, //get all products
                page: 0,
            }              
            dispatch(setCategory(data))
            dispatch(setLoadCategory({status: 'success', message: {en: `Category ${_id} has been loaded`, ru: `Категория ${_id} была загружена`}, errors: []}))

        } catch(err) {
            dispatch(setLoadCategory({status: 'error', message: {en: `Error occured while loading category: ${_id}`, ru: `Произошла ошибка при загрузке категории: ${_id}`}, errors: []}))
        }

    }
}



export const setPage = <T extends ICategory["page"]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_PAGE,
    payload
});









////////////////////////////////////////////////////////////////////////////////////////////




export const setFetchProduct = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_STATUS_PRODUCT,
    payload
});


export const setProduct = <T extends IProduct>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_PRODUCT,
    payload
});


export const loadProduct = (id: IProduct["_id"]) => {
    return async function(dispatch: IDispatch) {
        dispatch(setFetchProduct({status: 'fetching', message: {en: `Loading product ${id}`, ru: `Загрузка продукта ${id}`}, errors: []}))
        try {
            new Promise((res, rej) => {
                setTimeout(() => {
                    const product = mockProducts.find(product => product._id === id)
                    if (product) {
                        res(product)
                    } else (
                        rej({mesasage: `product ${id} not found`})
                    )
                }, 1000)
            }).then((data) => {
                dispatch(setProduct(data as IProduct))
                dispatch(setFetchProduct({status: 'success', message: {en: `Product ${id} has been loaded`, ru: `Продукт ${id} был загружен`}, errors: []}))
            }).catch(e => {
                dispatch(setFetchProduct({status: 'error', message: {en: `ERROR while loading product id=${id}: ${e}`, ru: `Ошибка при загрузке продукта ${id}: ${e}`}, errors: []}))
            })

        } catch (e) {
            dispatch(setFetchProduct({status: 'error', message: {en: `ERROR while loading product id=${id}: ${e}`, ru: `Ошибка при загрузке продукта ${id}: ${e}`}, errors: []}))
        }
    }
}
