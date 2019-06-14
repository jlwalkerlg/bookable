import {
  WISHLIST_ADD,
  WISHLIST_REMOVE,
  WISHLIST_HYDRATE
} from '../actions/types';

function wishlistReducer(state = [], action) {
  switch (action.type) {
    case WISHLIST_ADD:
      return [...state, action.book];
    case WISHLIST_REMOVE:
      return state.filter(book => book.id !== action.id);
    case WISHLIST_HYDRATE:
      return [...state, ...action.books];
    default:
      return state;
  }
}

export default wishlistReducer;
