import { combineReducers } from 'redux';
import loading from './loading';
import user from './user';
import books from './books';
import wishlist from './wishlist';
import cart from './cart';

const rootReducer = combineReducers({
  loading,
  user,
  books,
  wishlist,
  cart
});

export default rootReducer;
