import {
  WISHLIST_ADD,
  WISHLIST_REMOVE,
  WISHLIST_HYDRATE
} from '../actions/types';

function wishlistReducer(state = [], action) {
  switch (action.type) {
    case WISHLIST_ADD:
      return [...state, action.item];
    case WISHLIST_REMOVE:
      return state.filter(item => item.id !== action.id);
    case WISHLIST_HYDRATE:
      return action.items;
    default:
      return state;
  }
}

export default wishlistReducer;
