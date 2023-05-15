import { IProductState } from "src/interfaces"

const initialProduct = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    id:'',
    price: {
        en: '',
        ru: ''
    },
    name: {
        en: '',
        ru: ''
    },
    text: {
        en: [],
        ru: []
    },
    imgs: [],
    fibers: [],
    colors: [],
    features: [],
    mods: {
        en: [],
        ru: []
    }
} satisfies IProductState

export default initialProduct