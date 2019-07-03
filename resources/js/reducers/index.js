import { combineReducers } from 'redux';
import loading from './loading';
import user from './user';
import books from './books';
import wishlist from './wishlist';
import cart from './cart';
import categories from './categories';
import home from './home';

const rootReducer = combineReducers({
  loading,
  user,
  books,
  wishlist,
  cart,
  categories,
  home
});

export default rootReducer;
