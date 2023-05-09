import { ICatalogState } from "src/interfaces"

const initialCatalog = {
    categoriesListLoading: {
        status: 'idle',
        message: ""
    },
    categoriesList: [],
    categories: {},
    selectedCategory: '',
    selectedProduct: '',
    selectedProductImage: 0
} satisfies ICatalogState

export default initialCatalog