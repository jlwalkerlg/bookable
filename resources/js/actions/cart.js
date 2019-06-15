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

export const addToCart = (book, quantity = 1) => dispatch => {
  const cartId = store.getState().cart.id;
  axios
    .post(`/api/carts/${cartId}/cart-items`, {
      book_id: book.id,
      quantity
    })
    .then(response => dispatch(addItem(response.data)))
    .catch(err => console.log(err));
};

export const removeFromCart = bookId => dispatch => {
  const item = store
    .getState()
    .cart.cart_items.filter(item => item.book_id === bookId)[0];
  return axios
    .delete(`/api/carts/${item.cart_id}/cart-items/${item.id}`)
    .then(() => dispatch(removeItem(item.id)))
    .catch(err => console.log(err));
};
