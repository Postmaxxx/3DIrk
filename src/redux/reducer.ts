import initialState from "./initialState"
import { IState, IAction } from "src/interfaces"
import * as actions from './actionsList'
import Portfolio from "src/pages/Portfolio/Portfolio"


const reducer = (state:IState = initialState, action: IAction<any>): IState => {
    switch (action.type) {
        case actions.SET_LANG_EN: 
            return {
                ...state, lang: 'En'
            }
        case actions.SET_LANG_RU: 
            return {
                ...state, lang: 'Ru'
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

        case actions.LOAD_PORTFOLIOS: 
            return {
                ...state, 
				portfolios: {
					...state.portfolios,
					list: [...action.payload]
				}
            }
		case actions.SET_PORTFOLIOS_STATUS_IDLE: 
            return {
                ...state, 
				portfolios: {
					...state.portfolios,
					status: "idle"
				}
            }
		case actions.SET_PORTFOLIOS_STATUS_LOADING: 
            return {
                ...state, 
				portfolios: {
					...state.portfolios,
					status: "loading"
				}
            }
		case actions.SET_PORTFOLIOS_STATUS_ERROR: 
			alert('Error while receiving portfolios data: '+ action.payload);
            return {
                ...state, 
				portfolios: {
					...state.portfolios,
					status: "error"
				}
            }
		case actions.SET_PORTFOLIOS_STATUS_SUCCESS: 
			return {
					...state, 
					portfolios: {
						...state.portfolios,
						status: "success",
					}
				}



        default: return {...state}
    }
}

export default reducer