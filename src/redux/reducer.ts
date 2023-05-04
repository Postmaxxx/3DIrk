import initialState from "./initialState"
import { IState, IAction, IDataLoading } from "src/interfaces"
import * as actions from './actionsList'


const reducer = (state:IState = initialState, action: IAction<any>): IState => {
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
                nav: {
                    ...state.nav,
                    mobOpened: true
                }
            }
        case actions.SET_NAV_CLOSE_MOB: 
            return {
                ...state, 
                nav: {
                    ...state.nav,
                    mobOpened: false
                }
            }
        case actions.SET_NAV_OPEN_DT: 
            return {
                ...state, 
                nav: {
                    ...state.nav,
                    desktopOpened: true
                }
            }
        case actions.SET_NAV_CLOSE_DT: 
            return {
                ...state, 
                nav: {
                    ...state.nav,
                    desktopOpened: false
                }
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
                components: {
                    ...state.components,
                    fibersBlock: {
                        ...state.components.fibersBlock,
                        dataLoading: {
                            status: sf.status,
                            message: sf.message,
                        }
                    }
                }
            }    



        case actions.SET_DATA_FIBERS:
            return {
                ...state, 
                components: {
                    ...state.components,
                    fibersBlock: {
                        ...state.components.fibersBlock,
                        fibersList: [...action.payload]
                    }
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