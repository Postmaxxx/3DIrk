import { IAction, ICatalogItem, ICategory, IDispatch, IErrRes, IFetch, IFullState, IMsgRes, IProduct, ISendProduct, TId, TTypeRequest } from "../../interfaces"
import { actionsListCatalog } from './actionsList'
import { APIList, DOMExceptions, fetchingFetch, successFetch } from "../../assets/js/consts";
import { fetchError, resErrorFiller } from "../../assets/js/processors";

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
        const isAdmin = getState().user.isAdmin
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.catalog.get.timeout) //set time limit for fetch
        dispatch(setLoadCatalog({...fetchingFetch, controller}))  
        try {
            const response: Response = await fetch(APIList.catalog.get.url, {
                signal: controller.signal,
                method: APIList.catalog.get.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getState().user.token}`
                },
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadCatalog(resErrorFiller(result)))
            }
            const result = await response.json() //message
            dispatch(setCatalog(result.allCatalog || []))
            dispatch(setLoadCatalog({...successFetch}))
            return
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setLoadCatalog,
                controller,
                comp: {en: 'loading catalog', ru: 'загрузки каталога'}
            })
        }
    }
}



export const sendCatalog = (newCatalog: (Omit<ICatalogItem, "total" | "active">)[]) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.catalog.update.timeout) //set time limit for fetch
        dispatch(setSendCatalog({...fetchingFetch, controller}))  
        try {
            const response: Response = await fetch(APIList.catalog.update.url, {
                signal: controller.signal,
                method: APIList.catalog.update.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getState().user.token}`
                },
                body: JSON.stringify({newCatalog})
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendCatalog(resErrorFiller(result)))
            }
            const result: IMsgRes = await response.json() //message
            dispatch(setSendCatalog({...successFetch, ...result}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setSendCatalog,
                controller,
                comp: {en: 'sending catalog', ru: 'выгрузки каталога'}
            })
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
    from?: number,
    to?: number //-1 till the end
}




export const loadCategory = ({_id, from=0, to=-1}: ILoadCategory) => {    
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.category.getSome.timeout) //set time limit for fetch
        dispatch(setLoadCategory({...fetchingFetch, controller}))  
        try {
            const response = await fetch(`${APIList.category.getSome.url}?_id=${_id}&from=${from}&to=${to}`, {
                signal: controller.signal,
                method: APIList.category.getSome.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getState().user.token}`
                }
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadCategory(resErrorFiller(result)))
            }

            const result: (Pick<ICategory, "_id" | "products" >) & {__v: string} = await response.json()
            
            dispatch(setCategory({
                products: result.products,
                _id,
            }))
            dispatch(setLoadCategory({...successFetch}))
        } catch(e) {
            fetchError({ 
                e,
                dispatch,
                setter: setLoadCategory,
                controller,
                comp: {en: 'loading category', ru: 'загрузке категории'}
            })
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
        const typeOfRequest: TTypeRequest = product._id ? 'update' : 'create'
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.product[typeOfRequest].timeout) //set time limit for fetch
        dispatch(setSendProduct({...fetchingFetch, controller})) 

        const sendForm = new FormData()   

        const {files, ...productToSend}  = product //except files from data
        sendForm.append('data', JSON.stringify(productToSend))
        product.files.forEach(item => {sendForm.append('files', item, item.name) })
        
        try {
            const response: Response = await fetch(APIList.product[typeOfRequest].url, {
                signal: controller.signal,
                method: APIList.product[typeOfRequest].method,
                headers: {
                    "enctype": 'multipart/form-data',
                    'Authorization': `Bearer ${getState().user.token}`
                },
                body: sendForm
            })
            clearTimeout(fetchTimeout)
            if (!response.ok) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendProduct(resErrorFiller(result)))
            }
            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendProduct({...successFetch, ...result}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setSendProduct,
                controller,
                comp: {en: 'sending product', ru: 'сохранении продукта'}
            })
        }
    }
}



export const editProduct = (product: ISendProduct, changeImages: boolean) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.product.update.timeout) //set time limit for fetch
        dispatch(setSendProduct({...fetchingFetch, controller})) 

        const sendForm = new FormData()   
        const {files, ...productToSend} = product //exclude files from data
        sendForm.append('data', JSON.stringify({...productToSend, changeImages}))
        if (changeImages) {
            product.files.forEach(item => {
                sendForm.append('files', item, item.name)
            })
        }
        try {
            const response: Response = await fetch(APIList.product.update.url, {
                signal: controller.signal,
                method: APIList.product.update.method,
                headers: {
                    "enctype": 'multipart/form-data',
                    'Authorization': `Bearer ${getState().user.token}`
                },
                body: sendForm
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendProduct(resErrorFiller(result)))
            }

            const result: IMsgRes = await response.json() //message, errors
            dispatch(setSendProduct({...successFetch, ...result}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setSendProduct,
                controller,
                comp: {en: 'updating product', ru: 'обновлении продукта'}
            })
        }
    }
}



export const loadProduct = (_id: string) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.product.get.timeout) //set time limit for fetch
        dispatch(setLoadProduct({...fetchingFetch, controller}))
        try {
            const response: Response = await fetch(`${APIList.product.get.url}?_id=${_id}`, {
                signal: controller.signal,
                method: APIList.product.get.method,
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setLoadProduct(resErrorFiller(result)))
            }
            const result = await response.json() //message, errors
            dispatch(setProduct(result.product))
            dispatch(setLoadProduct({...successFetch}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setLoadProduct,
                controller,
                comp: {en: 'loading product', ru: 'загрузке продукта'}
            })
        }
    }
}



export const deleteProduct = (_id: TId) => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller?.abort(DOMExceptions.byTimeout), APIList.product.delete.timeout) //set time limit for fetch
        dispatch(setSendProduct({...fetchingFetch, controller}))
        try {
            const response: Response = await fetch(APIList.product.delete.url, {
                signal: controller.signal,
                method: APIList.product.delete.method,
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getState().user.token}`
                },
                body: JSON.stringify({_id})
            })
            clearTimeout(fetchTimeout)
            if (response.status !== 200) {
                const result: IErrRes = await response.json() //message, errors
                return dispatch(setSendProduct(resErrorFiller(result)))
            }
            const result: IMsgRes = await response.json() //message
            dispatch(setSendProduct({...successFetch, ...result}))
        } catch (e) {
            fetchError({ 
                e,
                dispatch,
                setter: setSendProduct,
                controller,
                comp: {en: 'deleting product', ru: 'удалении продукта'}
            })
        }
    }
}
