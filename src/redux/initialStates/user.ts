import { IUserState } from "src/interfaces"

const initialUserState = {
    name: '',
    email: '',
    phone: '',
    token: '',
    auth: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    orders: []
} satisfies IUserState

export default initialUserState