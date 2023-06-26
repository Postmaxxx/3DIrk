import { resetFetch } from "src/assets/js/consts"
import { IColorsState } from "src/interfaces"

const initialColors = {
    load: resetFetch,
    send: resetFetch,
    colors: []
} satisfies IColorsState

export default initialColors