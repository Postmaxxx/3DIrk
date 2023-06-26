import { empty, resetFetch } from 'src/assets/js/consts';
import { ICatalogState } from "src/interfaces"

const initialCatalog = {
    catalog: {
        load: resetFetch,
        send: resetFetch,
        list: []
    },
    category: {
        _id: '',
        name: empty,
        loadCategory: resetFetch,
        loadProduct: resetFetch,
        sendProduct: resetFetch,
        products: [],
        product: {
            _id: '',
            price: empty,
            name: empty,
            text: empty,
            text_short: empty,
            imgs: [],
            fibers: [],
            mods: [],
        }, 
        total: 0,
        page: 0
    }
} satisfies ICatalogState

export default initialCatalog