import { combineReducers } from 'redux';
import { favorites } from './favoritesReducers';
import { singleVideoCard } from './videoModalReducers';

export default combineReducers({
    favorites,
    singleVideoCard
});