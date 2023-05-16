import { IColorsState } from "src/interfaces"

const initialColors = {
    dataLoading: {
        status: 'idle',
        message: ""
    },
    colors: []
} satisfies IColorsState

export default initialColors