import { IAction, IBaseState } from "src/interfaces"
import initialBaseState from '../initialStates/base'
import * as actions from '../actions/base'

const reducerBase = (state:IBaseState = initialBaseState, action: IAction<any>): IBaseState => {
    switch (action.type) {
        case actions.SET_LANG_EN: 
            return {
                ...state, lang: 'en'
            }
        case actions.SET_LANG_RU: 
            return {
                ...state, lang: 'ru'
            }
        case actions.SET_THEME_LIGHT: 
            return {
                ...state, theme: 'light'
            }
        case actions.SET_THEME_DARK: 
            return {
                ...state, theme: 'dark'
            }
        case actions.SET_THEME_TOGGLE: 
            const newTheme = state.theme === 'light' ? 'dark' : 'light'
            return {
                ...state, theme: newTheme
            }
        case actions.SET_NAV_OPEN_MOB: 
            return {
                ...state, 
                mobOpened: true
            }
        case actions.SET_NAV_CLOSE_MOB: 
            return {
                ...state, 
                mobOpened: false
            }
        case actions.SET_NAV_OPEN_DT: 
            return {
                ...state,
                desktopOpened: true
            }
        case actions.SET_NAV_CLOSE_DT: 
            return {
                ...state,
                desktopOpened: false
            }

        default: return {...state}
    }
}

export default reducerBase