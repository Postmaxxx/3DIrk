import { ICatalogState } from "src/interfaces"

const initialCatalog = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    categoriesList: [],
    categories: [],
    selectedCategory: ''
} satisfies ICatalogState

export default initialCatalog