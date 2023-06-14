import { IAction, ICatalogItem, ICatalogState, ICategory, IDispatch, IFetch, IFullState, IProduct, TId, TLangText } from "../../interfaces"
import mockProducts from '../mocks/catalogFull'
import mockFibers from '../mocks/fibers'
import { actionsListCatalog } from './actionsList'
import mockCategoriesList from "../mocks/categoriesList"

export const setFetchCatalog = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORIES_LIST,
    payload
});


export const setCatalog = <T extends ICatalogItem[]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_CATEGORIES_LIST,
    payload
});


export const loadCatalog = () => {
    return async function(dispatch: IDispatch, getState: () => IFullState) {
        const {catalog} = getState()
        dispatch(setFetchCatalog({status: 'fetching', message: {en: `Loading catalog`, ru: 'Загрузка каталога'}, errors: []}))
        try {
            new Promise((res, rej) => {
                setTimeout(() => {
                    const categoriesList: ICatalogItem[] = mockCategoriesList;
                    if (categoriesList) {
                        res(categoriesList)
                    } else (
                        rej({mesasage: `CategoriesList not found`})
                    )
                }, 200)
            }).then((data) => {
                dispatch(setCatalog(data as ICatalogItem[]))
                dispatch(setFetchCatalog({status: 'success', message: {en: `Catalog has been loaded`, ru: 'Каталог загружен'}, errors: []}))
                loadCategory((data as ICatalogItem[])[0].id)(dispatch)
            }).catch(err => {
                dispatch(setFetchCatalog({status: 'error', message: {en:`Error while loading catalog: ${err}`, ru: `Ошибка при загрузке каталога: ${err}`}, errors: []}))
            })

        } catch (e) {
            dispatch(setFetchCatalog({status: 'error', message: {en:`Error while loading catalog: ${e}`, ru: `Ошибка при загрузке каталога: ${e}`}, errors: []}))
        }
    }
}



export const setFetchCategory = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORY,
    payload
});


export const setCategory = <T extends Omit<ICategory, "loadCategory" | "loadProduct" | "product" | "page">>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_CATEGORY,
    payload
});




export const loadCategory = (id: TId) => {    
    return async function(dispatch: IDispatch) {
        dispatch(setFetchCategory({status: 'fetching', message: {en: `Loading category`, ru: 'Загрузка категории'}, errors: []}))
        try {
            const receivedProducts: IProduct[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    const products: IProduct[] = mockProducts.filter(product => 
                        product.categoryId === id)
                    products? res(products) : rej(`Category ${id} is empty`)
                    //console.log(`category ${id} loaded`);
                }, 200)
            })
            
            const categoryName: TLangText = mockCategoriesList.find(category => category.id === id)?.name || {en: 'Other', ru: 'Другое'}
            const data: Omit<ICategory, "loadCategory" | "loadProduct" | "product"> = {
                id,
                name: categoryName,
                products: receivedProducts,
                total: receivedProducts.length, //get all products
                page: 0,
            }              
            dispatch(setCategory(data))
            dispatch(setFetchCategory({status: 'success', message: {en: `Category ${id} has been loaded`, ru: `Категория ${id} была загружена`}, errors: []}))

        } catch(err) {
            dispatch(setFetchCategory({status: 'error', message: {en: `Error occured while loading category: ${id}`, ru: `Произошла ошибка при загрузке категории: ${id}`}, errors: []}))
        }

    }
}



export const setPage = <T extends ICategory["page"]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_PAGE,
    payload
});









////////////////////////////////////////////////////////////////////////////////////////////




export const setFetchProduct = <T extends IFetch>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_DATA_STATUS_PRODUCT,
    payload
});


export const setProduct = <T extends IProduct>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_PRODUCT,
    payload
});


export const loadProduct = (id: IProduct["id"]) => {
    return async function(dispatch: IDispatch) {
        dispatch(setFetchProduct({status: 'fetching', message: {en: `Loading product ${id}`, ru: `Загрузка продукта ${id}`}, errors: []}))
        try {
            new Promise((res, rej) => {
                setTimeout(() => {
                    const product = mockProducts.find(product => product.id === id)
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
