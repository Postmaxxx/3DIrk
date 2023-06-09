import { resetFetch } from "../../assets/js/consts"
import { IUserState } from "../../interfaces"

const initialUserState = {
    name: '',
    email: '',
    phone: '',
    token: '',
    message: '',
    auth: resetFetch,
    isAdmin: false,
    sendOrder: resetFetch,
    cart: {
        load: resetFetch,
        send: resetFetch,
        items: [],
        shouldUpdate: false
    }
    //orders: []
} satisfies IUserState

export default initialUserState