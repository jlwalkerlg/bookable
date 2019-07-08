import axios from 'axios';
import { CART_ADD, CART_REMOVE, CART_HYDRATE } from './types';
import store from '../store';

const addItem = item => ({
  type: CART_ADD,
  item
});

const removeItem = id => ({
  type: CART_REMOVE,
  id
});

export const hydrateCart = cart => ({
  type: CART_HYDRATE,
  cart
});

export const addToCart = (bookId, quantity = 1) => dispatch => {
  const cart = store.getState().cart;
  return axios
    .post(`/api/carts/${cart.id}/items`, {
      book_id: bookId,
      quantity
    })
    .then(response => dispatch(addItem(response.data)));
};

export const removeFromCart = bookId => dispatch => {
  const cart = store.getState().cart;
  const item = cart.items.filter(item => item.book_id === bookId)[0];
  return axios
    .delete(`/api/carts/${cart.id}/items/${item.id}`)
    .then(() => dispatch(removeItem(item.id)));
};
