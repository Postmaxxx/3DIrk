import { IModalFunctions } from "src/components/Modal/Modal"
import { IAction, TTheme } from "../../interfaces"
import { actionsListBase } from './actionsList'

export const setLangEn = <T>(): IAction<T> => ({
    type: actionsListBase.SET_LANG_EN,
})
export const setLangRu = <T>(): IAction<T> => ({
    type: actionsListBase.SET_LANG_RU,
})



export const setThemeLight = <T>(): IAction<T> => ({
    type: actionsListBase.SET_THEME_LIGHT,
})
export const setThemeDark = <T>(): IAction<T> => ({
    type: actionsListBase.SET_THEME_DARK,
})

export const setTheme = <T extends TTheme>(payload: T): IAction<T> => ({
    type: actionsListBase.SET_THEME,
    payload
})



export const setModal = <T extends React.RefObject<IModalFunctions>>(payload: T):IAction<T> => ({
    type: actionsListBase.SET_MODAL,
    payload
});