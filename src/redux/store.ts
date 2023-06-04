import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducerBase from "./reducers/base";
import reducerNews from "./reducers/news";
import reducerFibers from './reducers/fibers';
import reducerOrder from './reducers/order';
import reducerCatalog from './reducers/catalog';
import reducerProduct from './reducers/product';
import reducerColors from './reducers/colors';
import reducerCart from './reducers/cart';
import reducerUser from './reducers/user';


const rootReducer = combineReducers({
    base: reducerBase,
    news: reducerNews,
    fibers: reducerFibers,
    order: reducerOrder,
    catalog: reducerCatalog,
    product: reducerProduct,
    colors: reducerColors,
    cart: reducerCart,
    user: reducerUser
});


const store = createStore(rootReducer, applyMiddleware(thunk));
 
export default store; 