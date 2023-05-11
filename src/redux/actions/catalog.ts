import { IAction, ICatalogState, ICategoriesListItem, ICategory, ICategoryReceived, IColors, IDispatch } from "src/interfaces"
import mockCatalog from '../mocks/catalogFull'
import mockFibers from '../mocks/fibers'
import { actionsListCatalog } from './actionsList'



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

export const setSelectedImage = <T extends ICatalogState["selectedProductImage"]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_SELECTED_IMAGE,
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
                dispatch(setLoadDataStatusCategoriesList({status: 'success', message: `Categories list loaded`}))
                dispatch(setCategoriesList(data as ICategoriesListItem[]))
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
        try {
            try{
                const receivedData: ICategoryReceived = await new Promise((res, rej) => {
                    setTimeout(() => {
                        const categoryData = mockCatalog.find((category) => {
                            return category.id === id
                        })
                        if (categoryData) {
                            res(categoryData)
                        } else {
                            rej(`Category ${id} not found`)
                        }
                        console.log(`category ${id} loaded`);
                    }, 1000)
                })
                
                dispatch(setLoadDataStatusCategory({ dataLoading: {status: 'success', message: `Loaded category id: ${id}`}, id: id}))

                //create array of unique colors
                const productsWithColors = receivedData.products.map(product => {
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

                const data: Omit<ICategory, "dataLoading"> = {
                    ...receivedData,
                    products: productsWithColors
                }




                dispatch(setCategory(data))
            } catch(err) {
                dispatch(setLoadDataStatusCategory({ dataLoading: {status: 'error', message: `ERROR while loading category id=${id}: error:${err}`}, id: id}))
            }
        } catch (e) {
            dispatch(setLoadDataStatusCategory({ dataLoading: {status: 'error', message: `ERROR while loading category id=${id}: error:${e}`}, id: id}))
        }
    }
}
