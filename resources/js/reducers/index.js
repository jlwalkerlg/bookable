import { combineReducers } from 'redux';
import loading from './loading';
import user from './user';
import books from './books';
import wishlist from './wishlist';
import cart from './cart';
import categories from './categories';

const rootReducer = combineReducers({
  loading,
  user,
  books,
  wishlist,
  cart,
  categories
});

export default rootReducer;
