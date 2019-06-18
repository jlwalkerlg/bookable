import {
  WISHLIST_ADD,
  WISHLIST_REMOVE,
  WISHLIST_HYDRATE
} from '../actions/types';

function wishlistReducer(wishlist = {}, action) {
  switch (action.type) {
    case WISHLIST_ADD:
      return { ...wishlist, items: [...wishlist.items, action.item] };
    case WISHLIST_REMOVE:
      return {
        ...wishlist,
        items: wishlist.items.filter(item => item.id !== action.id)
      };
    case WISHLIST_HYDRATE:
      return action.wishlist;
    default:
      return wishlist;
  }
}

export default wishlistReducer;
