import { IOrderState } from "src/interfaces"

const initialOrder = {
    id: '',
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
    files: []
} satisfies IOrderState

export default initialOrder