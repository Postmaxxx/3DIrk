import initialState from "./initialState"
import { IState, IAction, IDataLoading } from "src/interfaces"
import * as actions from './actionsList'


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
		/*case actions.SET_PORTFOLIOS_STATUS_IDLE: 
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

*/


        case actions.SET_LOAD_DATA_STATUS_FIBERS:
            const sf = action.payload as IDataLoading
            return {
                ...state, 
                fibers: {
                    ...state.fibers,
                    dataLoading: {
                        status: sf.status,
                        lang: sf.lang,
                        message: sf.message,
                    }
                }
            }    



        case actions.SET_DATA_FIBERS:
            return {
                ...state, 
                fibers: {
                    ...state.fibers,
                    list: [...action.payload]
                }
            }    


        case actions.SET_LOAD_DATA_STATUS_SLIDERMAX:
            const ss = action.payload as IDataLoading
            return {
                ...state, 
                sliderMax: {
                    ...state.sliderMax,
                    dataLoading: {
                        status: ss.status,
                        lang: ss.lang,
                        message: ss.message,
                    }
                }
            }    



        case actions.SET_DATA_SLIDERMAX:
            return {
                ...state, 
                sliderMax: {
                    ...state.sliderMax,
                    list: [...action.payload]
                }
            }    



        default: return {...state}
    }
}

export default reducer