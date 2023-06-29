import { IAction, ICatalogItem, ICategory, IDispatch, IErrRes, IFetch, IFullState, IImgWithThumb, IMsgRes, IProduct, ISendProduct, TId, TLangText } from "../../interfaces"
import { actionsListCatalog } from './actionsList'

import { empty, errorFetch, fetchingFetch, resetFetch, successFetch } from "src/assets/js/consts";
import {  imagesUploader } from "src/assets/js/imageUploader";

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
    return async function(dispatch: IDispatch, getState: () => IFullState)  {
        const load = getState().catalog.catalog.load
        if (load.status === 'fetching') return
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
                    message: (result as IErrRes).message || {...empty}, 
                    errors: result.errors || []
                }
                ))
            }
            const result = await response.json() //message, errors
            dispatch(setCatalog(result.allCatalog || []))
            dispatch(setLoadCatalog(successFetch))
            
            //loadCategory((data as ICatalogItem[])[0]._id)(dispatch) //load default category
        } catch (e) {
            dispatch(setLoadCatalog({status: 'error', message: {en:`Error while loading catalog: ${e}`, ru: `Ошибка при загрузке каталога: ${e}`}}))
        }
    }
}



export const sendCatalog = (newCatalog: ICatalogItem[]) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const send = getState().catalog.catalog.send
        if (send.status === 'fetching') return

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
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors || []
                    }
                ))
            }
            const result = await response.json() //message, errors
            dispatch(setSendCatalog({status: 'success', message: result.message || {...empty}}))
        } catch (e) {
            dispatch(setSendCatalog({status: 'error', message: {en:`Error while sending catalog: ${e}`, ru: `Ошибка при загрузке каталога: ${e}`}}))
        }
    }
}









////////////////////////////////////////////////////////////////////////////////////////////


export const setLoadCategory = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_STATUS_CATEGORY,
    payload
});


export const setCategory = <T extends Omit<ICategory, "loadCategory" | "sendProduct" | "loadProduct" | "product">>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_CATEGORY,
    payload
});

interface ILoadCategory {
    _id: string,
    from: number,
    to: number
}

export const loadCategory = ({_id, from, to}: ILoadCategory) => {    
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const load = getState().catalog.category.loadCategory
        if (load.status === 'fetching') return

        dispatch(setLoadCategory(fetchingFetch))
        try {
            const response = await fetch(`/api/catalog/category?_id=${_id}&_from=${_id}&_to=${_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                }
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendProduct({
                        status: 'error', 
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors || []
                    }
                ))
            }

            const result = await response.json()
            
            dispatch(setCategory(result))
            dispatch(setLoadCategory(successFetch))

        } catch(err) {
            dispatch(setLoadCategory({status: 'error', message: {en: `Error occured while loading category: ${_id}`, ru: `Произошла ошибка при загрузке категории: ${_id}`}}))
        }

    }
}









////////////////////////////////////////////////////////////////////////////////////////////




export const setLoadProduct = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_STATUS_PRODUCT,
    payload
});

export const setSendProduct = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_SEND_STATUS_PRODUCT,
    payload
});


export const setProduct = <T extends IProduct>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_PRODUCT,
    payload
});




export const sendProduct = (product: ISendProduct) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const { token } = getState().user
        const send = getState().catalog.category.sendProduct
        if (send.status === 'fetching') return
        dispatch(setSendProduct(fetchingFetch))

        const imageUrls = await imagesUploader({files: product.files, dispatch, errorHandler: setSendProduct})
        if (imageUrls.err.en) {
           return dispatch(setSendProduct({...errorFetch, message: imageUrls.err || {...empty}}))
        }
        
        try {
            const productToDb: Omit<IProduct, "_id"> = {
                ...product,
                images: imageUrls.urls
            }

            const response: Response = await fetch('/api/catalog/product', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({product: productToDb})
            })
            

            if (response.status !== 201) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendProduct({
                        status: 'error', 
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors || []
                    }
                ))
            }

            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendProduct({status: 'success', message: result.message || {...empty}}))

        } catch (e) {
            dispatch(setSendProduct({status: 'error', message: {en: `ERROR while sending product: ${e}`, ru: `Ошибка при сохранении продукта: ${e}`}}))
        }
    }
}




export const loadProduct = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const load = getState().catalog.category.loadProduct
        if (load.status === 'fetching') return
        dispatch(setSendProduct(fetchingFetch))
        
        try {
            const response: Response = await fetch(`/api/catalog/product?_id=${_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendProduct({
                        status: 'error', 
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors || []
                    }
                ))
            }

            const result = await response.json() //message, errors

            if (!result.product) {
                return dispatch(setSendProduct({status: 'error', message: {en: `ERROR while loading product, result.product undefined`, ru: `Ошибка при загрузке продукта, result.product undefined`}}))
            }
            dispatch(setProduct(result.product))
            dispatch(setSendProduct(successFetch))

        } catch (e) {
            dispatch(setSendProduct({status: 'error', message: {en: `ERROR while loading product: ${e}`, ru: `Ошибка при загрузке продукта: ${e}`}}))
        }
    }
}

