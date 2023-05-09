import { IFibersState } from "src/interfaces"

const initialFibers = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    fibersList: []
} satisfies IFibersState

export default initialFibers