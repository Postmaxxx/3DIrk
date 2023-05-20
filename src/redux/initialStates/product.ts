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
    features: [],
    mods: []
} satisfies IProductState

export default initialProduct