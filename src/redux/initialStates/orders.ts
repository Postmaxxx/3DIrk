import { resetFetch } from "src/assets/js/consts"
import { IOrdersState } from "src/interfaces"

const initialOrders = {
    load: {...resetFetch},
    send: {...resetFetch},
    users: [],
    userList: {
        load: {...resetFetch},
        list: []
    }
} satisfies IOrdersState

export default initialOrders