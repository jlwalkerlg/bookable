import { CART_ADD, CART_REMOVE, CART_HYDRATE } from './types';

export const addToCart = book => {
  const quantity = book.quantity || 1;
  return {
    type: CART_ADD,
    book: { ...book, quantity }
  };
};

export const removeFromCart = id => ({
  type: CART_REMOVE,
  id
});

export const hydrateCart = books => ({
  type: CART_HYDRATE,
  books
});
