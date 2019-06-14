import { WISHLIST_ADD, WISHLIST_REMOVE, WISHLIST_HYDRATE } from './types';

export const addToWishlist = book => ({
  type: WISHLIST_ADD,
  book
});

export const removeFromWishlist = id => ({
  type: WISHLIST_REMOVE,
  id
});

export const hydrateWishlist = books => ({
  type: WISHLIST_HYDRATE,
  books
});
