import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducerBase from "./reducers/base";
import reducerNews from "./reducers/news";
import reducerFibers from './reducers/fibers';
import reducerOrder from './reducers/order';
import reducerCatalog from './reducers/catalog';


const rootReducer = combineReducers({
    base: reducerBase,
    news: reducerNews,
    fibers: reducerFibers,
    order: reducerOrder,
    catalog: reducerCatalog
});


const store = createStore(rootReducer, applyMiddleware(thunk));
 
export default store; 