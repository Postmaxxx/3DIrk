import { IOrderState } from "src/interfaces"

const initialOrder = {
    _id: '',
    date: new Date(),
    send: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    name: '',
    phone: '',
    email: '',
    message: '',
    files: [],
    cart: {
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
    }
} satisfies IOrderState

export default initialOrder