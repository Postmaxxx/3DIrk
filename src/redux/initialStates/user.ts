import { IUserState } from "src/interfaces"

const initialUserState = {
    name: '',
    email: '',
    phone: '',
    token: '',
    message: '',
    auth: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    isAdmin: false,
    sendOrder: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
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
    //orders: []
} satisfies IUserState

export default initialUserState