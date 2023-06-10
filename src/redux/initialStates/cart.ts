import { ICartState } from "src/interfaces"

const cartState = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    dataSending: {
        status: 'idle',
        message: {
            en: '',
            ru: ''
        }
    },
    items: [],
    //newItems: 0
} satisfies ICartState

export default cartState