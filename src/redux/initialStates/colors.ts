import { IColorsState } from "src/interfaces"

const initialColors = {
    load: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    send: {
        status: 'idle',
        message: {en: '', ru: ''},
        errors: []
    },
    colors: []
} satisfies IColorsState

export default initialColors