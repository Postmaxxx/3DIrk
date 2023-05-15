import { ICatalogState } from "src/interfaces"

const initialCatalog = {
    categoriesListLoading: {
        status: 'idle',
        message: ""
    },
    categoriesList: [],
    categories: {},
    selectedCategory: '',
    selectedProduct: ''
} satisfies ICatalogState

export default initialCatalog