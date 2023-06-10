import { IFibersState } from "src/interfaces"

const initialFibers = {
    load: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    fibersList: [],
    selected: '',
    showList: []
} satisfies IFibersState

export default initialFibers