import { IAction, INewsState } from "src/interfaces"
import initialNewsState from '../initialStates/news'
import * as actions from '../actions/news'




const reducerNews = (state:INewsState = initialNewsState, action: IAction<any>): INewsState => {
    switch (action.type) {
        case actions.SET_LOAD_DATA_STATUS_NEWS: 
            return {
                ...state, 
                dataLoading: action.payload
            }
        case actions.SET_DATA_NEWS: 
            return {
                ...state, 
                news: [...action.payload]
            }

        default: return {...state}
    }
}

export default reducerNews