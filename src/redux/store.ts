import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducerBase from "./reducers/base";
import reducerNews from "./reducers/news";


const rootReducer = combineReducers({
    base: reducerBase,
    news: reducerNews
});


const store = createStore(rootReducer, applyMiddleware(thunk));
 
export default store; 