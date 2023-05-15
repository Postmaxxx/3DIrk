import { IAction, ICatalogState, ICategoriesListItem, ICategory, ICategoryReceived, IColors, IDispatch, IProduct, TLangText } from "src/interfaces"
import mockProducts from '../mocks/catalogFull'
import mockFibers from '../mocks/fibers'
import { actionsListCatalog } from './actionsList'
import mockCategoriesList from "../mocks/categoriesList"

export const setLoadDataStatusCategoriesList = <T extends ICatalogState["categoriesListLoading"]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORIES_LIST,
    payload
});


export const setSelectedCategory = <T extends ICatalogState["selectedCategory"]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_SELECTED_CATEGORY,
    payload
});

export const setSelectedProduct = <T extends ICatalogState["selectedProduct"]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_SELECTED_PRODUCT,
    payload
});


export const setCategoriesList = <T extends ICategoriesListItem[]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_CATEGORIES_LIST,
    payload
});


export const loadCategoriesList = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusCategoriesList({status: 'loading', message: `Loading categories list`}))
        try {
            new Promise((res, rej) => {
                setTimeout(() => {
                    const categoriesList: ICategoriesListItem[] = mockCategoriesList;
                    if (categoriesList) {
                        console.log('CategoriesList list loaded');
                        res(categoriesList)
                    } else (
                        rej({mesasage: `CategoriesList not found`})
                    )
                }, 200)
            }).then((data) => {
                dispatch(setCategoriesList(data as ICategoriesListItem[]))
                dispatch(setLoadDataStatusCategoriesList({status: 'success', message: `Categories list loaded`}))
            }).catch(err => {
                dispatch(setLoadDataStatusCategoriesList({status: 'error', message: `ERROR while loading categories list: ${err}`}))
            })

        } catch (e) {
            dispatch(setLoadDataStatusCategoriesList({status: 'error', message: `ERROR while loading categories list: ${e}`}))
        }
    }
}



export const setLoadDataStatusCategory = <T extends Pick<ICategory, "dataLoading" | "id">>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORY,
    payload
});


export const setCategory = <T extends Omit<ICategory, "dataLoading">>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_CATEGORY,
    payload
});


export const loadCategory = (id: ICategory["id"]) => {    
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusCategory({ dataLoading: {status: 'loading', message: `Loading category id: ${id}`}, id: id}))
        try{
            const receivedProducts: Omit<IProduct, "colors">[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    const products: Omit<IProduct, "colors">[] = mockProducts.filter(product => 
                        product.categoryId === id)
                    if (products) {
                        res(products)
                    } else {
                        rej(`Category ${id} is empty`)
                    }
                    console.log(`category ${id} loaded`);
                }, 200)
            })
            
            
            //create array of unique colors
            const productsWithColors = await receivedProducts.map(product => {
                const currentColors: IColors[] = [] 
                product.fibers.forEach(fiber => {
                    mockFibers.find(item => item.id === fiber)?.colors.forEach(color => {
                        if (!currentColors.find(existedColor => existedColor.value === color.value)) {
                            currentColors.push(color)
                        }
                    })
                })
                return {
                    ...product,
                    colors: currentColors
                }
            })
            const categoryName: TLangText = mockCategoriesList.find(category => category.id === id)?.name || {en: 'Other', ru: 'Другое'}
            const data: Omit<ICategory, "dataLoading"> = {
                id,
                name: categoryName,
                products: productsWithColors,
                page: 0,
            }              
            dispatch(setCategory(data))
            dispatch(setLoadDataStatusCategory({ dataLoading: {status: 'success', message: `Loaded category id: ${id}`}, id: id}))

        } catch(err) {
            dispatch(setLoadDataStatusCategory({ dataLoading: {status: 'error', message: `ERROR while loading category id=${id}: error:${err}`}, id: id}))
        }

    }
}

/*
export const loadCategory = (id: ICategory["id"]) => {    
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusCategory({ dataLoading: {status: 'loading', message: `Loading category id: ${id}`}, id: id}))
        try{
            const receivedProducts: IProductShort[] = await new Promise((res, rej) => {
                setTimeout(() => {
                    const products: IProductShort[] = mockProducts
                        .filter(product => product.categoryId === id)
                        .map(product => {
                            return {
                                id: product.id,
                                price: product.price,
                                name: product.name,
                                img: product.imgs[0]
                            }
                        })
                    if (products) {
                        res(products)
                    } else {
                        rej(`Category ${id} is empty`)
                    }
                    console.log(`category ${id} loaded`);
                }, 200)
            })
            

            const categoryName: TLangText = mockCategoriesList.find(category => category.id === id)?.name || {en: 'Other', ru: 'Другое'}
            const data: Omit<ICategory, "dataLoading"> = {
                id,
                name: categoryName,
                products: receivedProducts,
                page: 0,
            }              
            dispatch(setCategory(data))
            dispatch(setLoadDataStatusCategory({ dataLoading: {status: 'success', message: `Loaded category id: ${id}`}, id: id}))

        } catch(err) {
            dispatch(setLoadDataStatusCategory({ dataLoading: {status: 'error', message: `ERROR while loading category id=${id}: error:${err}`}, id: id}))
        }

    }
}
*/


export const setPage = <T extends ICategory["page"]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_PAGE,
    payload
});
