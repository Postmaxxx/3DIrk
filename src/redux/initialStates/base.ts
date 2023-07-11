import { IBaseState } from "../../interfaces"

const initialBase = {
    theme: 'light',
    lang: 'ru',
    mobOpened: false,
    desktopOpened: true,
} satisfies IBaseState

export default initialBase