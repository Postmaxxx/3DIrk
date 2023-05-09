import { IAction, ICategoriesList, IDataLoading, IDispatch, TId } from "src/interfaces"
import mockCatalog from '../mocks/catalogFull'
import { actionsListCatalog } from './actionsList'



export const setLoadDataStatusCategoriesList = <T extends IDataLoading>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORIES_LIST,
    payload: payload
});

export const setSelectedCategory = <T extends TId>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_SELECTED_CATEGORY,
    payload: payload
});

export const setSelectedProduct = <T extends TId>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_SELECTED_PRODUCT,
    payload: payload
});

export const setSelectedImage = <T extends number>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_SELECTED_IMAGE,
    payload: payload
});

export const setLoadDataStatusCategoriey = <T extends IDataLoading>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_LOAD_DATA_STATUS_CATEGORY,
    payload: payload
});


export const setCategoriesList = <T extends ICategoriesList[]>(payload: T):IAction<T> => ({
    type: actionsListCatalog.SET_DATA_CATEGORIES_LIST,
    payload: payload
});


export const loadCategoriesList = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusCategoriesList({status: 'loading', message: `Loading categories list`}))
        try {
            const data: ICategoriesList[] = await new Promise((res, rej) => {
                setTimeout(() => {

                    const categoriesList = mockCatalog.map(category => {
                        return {
                            name: category.name,
                            id: category.id
                        }
                    })

                    res(categoriesList)
                    console.log('loaded');
                }, 2000)
            })

            dispatch(setLoadDataStatusCategoriesList({status: 'success', message: `Categories list loaded`}))
            dispatch(setCategoriesList(data))
        } catch (e) {
            dispatch(setLoadDataStatusCategoriesList({status: 'error', message: `ERROR while loading categories list: ${e}`}))
        }
    }
}