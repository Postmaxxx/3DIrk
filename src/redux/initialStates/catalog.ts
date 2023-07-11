import { empty, resetFetch } from '../../assets/js/consts';
import { ICatalogState } from "../../interfaces"

const initialCatalog = {
    catalog: {
        load: resetFetch,
        send: resetFetch,
        list: []
    },
    category: {
        _id: '',
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
            images: {
                paths: {
                    full: '',
                    small: '',
                    medium: '',
                    preview: '',
                },
                files: []
            },
            fibers: [],
            mods: [],
            category: ''
        }
    }
} satisfies ICatalogState

export default initialCatalog