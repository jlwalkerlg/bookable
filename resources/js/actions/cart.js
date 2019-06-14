import { CART_ADD, CART_HYDRATE } from './types';

export const addToCart = book => ({
  type: CART_ADD,
  book
});

export const hydrateCart = books => ({
  type: CART_HYDRATE,
  books
});
