import { IBaseState, TTheme } from "../../interfaces"
import initialBaseState from '../initialStates/base'
import { actionsListBase } from '../actions/actionsList'
import { IModalFunctions } from "src/components/Modal/Modal";

type TActionListKeys = keyof typeof actionsListBase;

const reducerBase = (state:IBaseState = initialBaseState, action: {type: TActionListKeys, payload: unknown}): IBaseState => {
    switch (action.type) {
        case actionsListBase.SET_LANG_EN as 'SET_LANG_EN': 
            return {
                ...state, lang: 'en'
            }
        case actionsListBase.SET_LANG_RU as 'SET_LANG_RU': 
            return {
                ...state, lang: 'ru'
            }
        case actionsListBase.SET_THEME as 'SET_THEME': 
            return {
                ...state, theme: action.payload as TTheme
            }
        case actionsListBase.SET_THEME_LIGHT as 'SET_THEME_LIGHT': 
            return {
                ...state, theme: 'light'
            }
        case actionsListBase.SET_THEME_DARK as 'SET_THEME_DARK': 
            return {
                ...state, theme: 'dark'
            }
        case actionsListBase.SET_MODAL as 'SET_MODAL':
            return {
                ...state,
                modal: action.payload as {current: IModalFunctions}
            }
        default: {
			const missedSomeActions:never = action.type;
			return {...state};
        }
    }
}

export default reducerBase