import { ICartState } from "src/interfaces"

const cartState = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    dataSending: {
        status: 'idle',
        message: ""
    },
    items: [],
    //newItems: 0
} satisfies ICartState

export default cartState