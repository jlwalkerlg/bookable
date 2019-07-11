import { combineReducers } from 'redux';
import loading from './loading';
import user from './user';
import wishlist from './wishlist';
import cart from './cart';
import categories from './categories';
import home from './home';
import notifications from './notifications';

const rootReducer = combineReducers({
  loading,
  user,
  wishlist,
  cart,
  categories,
  home,
  notifications
});

export default rootReducer;
