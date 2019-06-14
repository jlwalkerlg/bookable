import { CART_ADD, CART_REMOVE, CART_HYDRATE } from './types';

export const addToCart = book => ({
  type: CART_ADD,
  book: { ...book, quantity: 1 }
});

export const removeFromCart = id => ({
  type: CART_REMOVE,
  id
});

export const hydrateCart = books => ({
  type: CART_HYDRATE,
  books
});
