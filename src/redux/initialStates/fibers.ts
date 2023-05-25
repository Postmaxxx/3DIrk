import { IFibersState } from "src/interfaces"

const initialFibers = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    fibersList: [],
    selected: '',
    showList: []
} satisfies IFibersState

export default initialFibers