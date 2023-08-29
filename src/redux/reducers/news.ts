import { IAction, INewsState } from "../../interfaces"
import initialNewsState from '../initialStates/news'
import { actionsListNews } from '../actions/actionsList'




const reducerNews = (state:INewsState = initialNewsState, action: IAction<any>): INewsState => {
    switch (action.type) {
        case actionsListNews.SET_LOAD_STATUS_NEWS: 
            return {
                ...state, 
                load: action.payload
            }
        case actionsListNews.SET_LOAD_STATUS_ONE_NEWS: 
            return {
                ...state, 
                loadOne: action.payload
            }
        case actionsListNews.SET_SEND_STATUS_NEWS: 
            return {
                ...state, 
                send: action.payload
            }
        case actionsListNews.SET_DATA_NEWS: 
            return {
                ...state, 
                newsList: [...action.payload]
            }
        case actionsListNews.SET_DATA_ONE_NEWS: 
            return {
                ...state, 
                newsOne: {...action.payload}
            }
        case actionsListNews.SET_TOTAL_NEWS: 
            return {
                ...state, 
                total: action.payload
            }

        default: return state
    }
}

export default reducerNews