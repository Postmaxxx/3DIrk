import { ICartState } from "src/interfaces"

const cartState = {
    load: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    send: {
        status: 'idle',
        message: {
            en: '',
            ru: ''
        },
        errors: []
    },
    items: [],
    //newItems: 0
} satisfies ICartState

export default cartState