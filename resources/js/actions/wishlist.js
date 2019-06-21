import axios from 'axios';
import store from '../store';
import { WISHLIST_ADD, WISHLIST_REMOVE, WISHLIST_HYDRATE } from './types';

const addItem = item => ({
  type: WISHLIST_ADD,
  item
});

const removeItem = id => ({
  type: WISHLIST_REMOVE,
  id
});

export const hydrateWishlist = wishlist => ({
  type: WISHLIST_HYDRATE,
  wishlist
});

export const addToWishlist = book => dispatch => {
  const wishlist = store.getState().wishlist;
  axios
    .post(`/api/wishlists/${wishlist.id}/items`, {
      book_id: book.id
    })
    .then(response => dispatch(addItem(response.data)))
    .catch(err => console.log(err));
};

export const removeFromWishlist = book => dispatch => {
  const wishlist = store.getState().wishlist;
  const item = wishlist.items.filter(item => item.book_id === book.id)[0];
  return axios
    .delete(`/api/wishlists/${wishlist.id}/items/${item.id}`)
    .then(() => dispatch(removeItem(item.id)))
    .catch(err => console.log(err));
};
