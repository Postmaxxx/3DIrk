import { IFibersState } from "src/interfaces"

const initialFibers = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    fibersList: [],
    selected: '',
    compareList: []
} satisfies IFibersState

export default initialFibers