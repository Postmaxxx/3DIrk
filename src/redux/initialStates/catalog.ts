import { ICatalogState } from "src/interfaces"

const initialCatalog = {
    catalog: {
        load: {
            status: 'idle',
            message: {en: '', ru: ''},
            errors: []
        },
        send: {
            status: 'idle',
            message: {en: '', ru: ''},
            errors: []
        },
        list: []
    },
    category: {
        _id: '',
        name: {en: '', ru: ''},
        loadCategory: {
            status: 'idle',
            message: {en: '', ru: ''},
            errors: []
        },
        loadProduct: {
            status: 'idle',
            message: {en: '', ru: ''},
            errors: []
        },
        products: [],
        product: {
            _id: '',
            price: {en: '', ru: ''},
            name: {en: '', ru: ''},
            text: {en: '', ru: ''},
            imgs: [],
            fibers: [],
            features: [],
            mods: [],
        }, 
        total: 0,
        page: 0
    }
} satisfies ICatalogState

export default initialCatalog