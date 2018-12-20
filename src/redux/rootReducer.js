import { combineReducers } from 'redux';

import shoppingCartReducer from './shoppingCart/reducer';


// here we can combine with other reducers
const rootReducer = combineReducers({ shoppingCartReducer });

export default rootReducer;