import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducerBase from "./reducers/base";
import reducerNews from "./reducers/news";
import reducerFibers from './reducers/fibers';
import reducerOrder from './reducers/order';
import reducerCatalog from './reducers/catalog';
import reducerColors from './reducers/colors';
import reducerUser from './reducers/user';
import { composeWithDevTools } from '@redux-devtools/extension';

const rootReducer = combineReducers({
    base: reducerBase,
    news: reducerNews,
    fibers: reducerFibers,
    order: reducerOrder,
    catalog: reducerCatalog,
    colors: reducerColors,
    user: reducerUser
});


const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
 
export default store; 