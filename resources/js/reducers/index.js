import { combineReducers } from 'redux';
import loading from './loading';
import user from './user';
import books from './books';

const rootReducer = combineReducers({
  loading,
  user,
  books
});

export default rootReducer;
