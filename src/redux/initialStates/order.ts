import { IOrderState } from "src/interfaces"

const initialOrder = {
    dataSending: {
        status: 'idle',
        message: ""
    },
    name: '',
    phone: '',
    email: '',
    message: '',
    files: []
} satisfies IOrderState

export default initialOrder