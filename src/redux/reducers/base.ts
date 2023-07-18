import { IAction, IBaseState } from "../../interfaces"
import initialBaseState from '../initialStates/base'
import { actionsListBase } from '../actions/actionsList'

const reducerBase = (state:IBaseState = initialBaseState, action: IAction<any>): IBaseState => {
    switch (action.type) {
        case actionsListBase.SET_LANG_EN: 
            return {
                ...state, lang: 'en'
            }
        case actionsListBase.SET_LANG_RU: 
            return {
                ...state, lang: 'ru'
            }
        case actionsListBase.SET_THEME_LIGHT: 
            return {
                ...state, theme: 'light'
            }
        case actionsListBase.SET_THEME_DARK: 
            return {
                ...state, theme: 'dark'
            }
        case actionsListBase.SET_THEME_TOGGLE: 
            const newTheme = state.theme === 'light' ? 'dark' : 'light'
            return {
                ...state, theme: newTheme
            }
        case actionsListBase.SET_NAV_MOB_OPEN: 
            return {
                ...state, 
                mobOpened: true
            }
        case actionsListBase.SET_NAV_MOB_CLOSE: 
            return {
                ...state, 
                mobOpened: false
            }
        case actionsListBase.SET_NAV_MOB_TOGGLE: 
            return {
                ...state, 
                mobOpened: !state.mobOpened
            }
        case actionsListBase.SET_NAV_DT_OPEN: 
            return {
                ...state,
                desktopOpened: true
            }
        case actionsListBase.SET_NAV_DT_CLOSE: 
            return {
                ...state,
                desktopOpened: false
            }
        case actionsListBase.SET_NAV_DT_TOGGLE: 
            return {
                ...state,
                desktopOpened: !state.desktopOpened
            }

        default: return state
    }
}

export default reducerBase