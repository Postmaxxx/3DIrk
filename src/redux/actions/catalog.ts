import { IAction, ICatalogItem, ICategory, IDispatch, IErrRes, IFetch, IFullState, IImgWithThumb, IMsgRes, IProduct, ISendProduct, TId, TLangText } from "../../interfaces"
import { actionsListCatalog } from './actionsList'

import { empty, errorFetch, fetchingFetch, resetFetch, successFetch } from "src/assets/js/consts";

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
        if ( getState().catalog.catalog.load.status === 'fetching') return
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
                return dispatch(setLoadCatalog({
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



export const sendCatalog = (newCatalog: (Omit<ICatalogItem, "total">)[]) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        if (getState().catalog.catalog.send.status === 'fetching') return

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
        if (getState().catalog.category.loadCategory.status === 'fetching') return
        dispatch(setLoadCategory(fetchingFetch))
        try {
            const response = await fetch(`/api/catalog/category?_id=${_id}&from=${from}&to=${to}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                }
            })

            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadCategory({
                        status: 'error', 
                        message: (result as IErrRes).message || {...empty}, 
                        errors: result.errors || []
                    }
                ))
            }

            const result: (Pick<ICategory, "_id" | "products" >) & {__v: string} = await response.json()
            
            dispatch(setCategory({
                products: result.products,
                _id,
            }))
            
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
        if (getState().catalog.category.sendProduct.status === 'fetching') return
        const { token } = getState().user
        dispatch(setSendProduct(fetchingFetch))

        const sendForm = new FormData()   
        if (product.files && product.files.length > 0) {
            product.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        const {files, ...productToSend}  = product //except files from data
        sendForm.append('data', JSON.stringify(productToSend))
        
        try {
            const response: Response = await fetch('/api/catalog/product', {
                method: 'POST',
                headers: {
                    "enctype": 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
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




export const editProduct = (product: ISendProduct) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        if (getState().catalog.category.sendProduct.status === 'fetching') return
        const { token } = getState().user
        dispatch(setSendProduct(fetchingFetch))

        const sendForm = new FormData()   
        if (product.files && product.files.length > 0) {
            product.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        const {files, ...productToSend}  = product //except files from data
        sendForm.append('data', JSON.stringify(productToSend))

        try {

            const response: Response = await fetch('/api/catalog/product', {
                method: 'PUT',
                headers: {
                    "enctype": 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                body: sendForm
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

            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendProduct({status: 'success', message: result.message || {...empty}}))

        } catch (e) {
            dispatch(setSendProduct({status: 'error', message: {en: `ERROR while updating product: ${e}`, ru: `Ошибка при обновлении продукта: ${e}`}}))
        }
    }
}





export const loadProduct = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        if (getState().catalog.category.loadProduct.status === 'fetching') return
        dispatch(setLoadProduct(fetchingFetch))
        
        try {
            const response: Response = await fetch(`/api/catalog/product?_id=${_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            
            
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadProduct({
                    status: 'error', 
                    message: (result as IErrRes).message || {...empty}, 
                    errors: result.errors || []
                }
                ))
            }
            
            const result = await response.json() //message, errors
            if (!result.product) {
                return dispatch(setLoadProduct({status: 'error', message: {en: `ERROR while loading product, result.product undefined`, ru: `Ошибка при загрузке продукта, result.product undefined`}}))
            }

            dispatch(setProduct(result.product))
            dispatch(setLoadProduct(successFetch))
            
        } catch (e) {
            dispatch(setLoadProduct({status: 'error', message: {en: `ERROR while loading product: ${e}`, ru: `Ошибка при загрузке продукта: ${e}`}}))
        }
    }
}

export const deleteProduct = (_id: TId) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        if (getState().catalog.category.sendProduct.status === 'fetching') return
        const { token } = getState().user
        dispatch(setSendProduct(fetchingFetch))

        try {
            const response: Response = await fetch('/api/catalog/product', {
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({_id})
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

            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendProduct({status: 'success', message: result.message || {...empty}}))

        } catch (e) {
            dispatch(setSendProduct({status: 'error', message: {en: `ERROR while deleting product: ${e}`, ru: `Ошибка при удалении продукта: ${e}`}}))
        }
    }
}
