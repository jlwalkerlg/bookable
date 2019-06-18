import { combineReducers } from 'redux';
import loading from './loading';
import user from './user';
import books from './books';
import wishlist from './wishlist';
import cart from './cart';
import shelves from './shelves';

const rootReducer = combineReducers({
  loading,
  user,
  books,
  wishlist,
  cart,
  shelves
});

export default rootReducer;
