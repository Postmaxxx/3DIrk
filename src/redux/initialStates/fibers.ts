import { resetFetch } from "src/assets/js/consts"
import { IFibersState } from "src/interfaces"

const initialFibers = {
    load: resetFetch,
    send: resetFetch,
    fibersList: [],
    selected: '',
    showList: []
} satisfies IFibersState

export default initialFibers