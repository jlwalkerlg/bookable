import {
  USER_LOGIN,
  USER_LOGOUT,
  WISHLIST_ADD,
  WISHLIST_REMOVE
} from '../actions/types';

function userReducer(state = {}, action) {
  switch (action.type) {
    case USER_LOGIN:
      return action.user;
    case USER_LOGOUT:
      return {};
    case WISHLIST_ADD:
      return { ...state, wishlist: [...state.wishlist, { id: action.bookId }] };
    case WISHLIST_REMOVE:
      return {
        ...state,
        wishlist: state.wishlist.filter(book => book.id !== action.bookId)
      };
    default:
      return state;
  }
}

export default userReducer;
