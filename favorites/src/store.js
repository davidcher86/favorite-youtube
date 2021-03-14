import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './Reducers/rootReducer';
// import {favorites} from './Reducers/favoritesReducers';
export default function configureStore() {
 return createStore(
    rootReducer,
   applyMiddleware(thunk)
 );
}