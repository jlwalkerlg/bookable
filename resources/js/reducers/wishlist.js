import {
  WISHLIST_ADD,
  WISHLIST_REMOVE,
  WISHLIST_HYDRATE
} from '../actions/types';

function wishlistReducer(wishlist = [], action) {
  switch (action.type) {
    case WISHLIST_ADD:
      return [...wishlist, action.item];
    case WISHLIST_REMOVE:
      return wishlist.filter(item => item.id !== action.id);
    case WISHLIST_HYDRATE:
      return action.items;
    default:
      return wishlist;
  }
}

export default wishlistReducer;
