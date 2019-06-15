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

export const hydrateWishlist = items => ({
  type: WISHLIST_HYDRATE,
  items
});

export const addToWishlist = book => dispatch =>
  axios
    .post('/api/wishlist-items', {
      book_id: book.id
    })
    .then(response => dispatch(addItem(response.data)))
    .catch(err => console.log(err));

export const removeFromWishlist = bookId => dispatch => {
  const item = store
    .getState()
    .wishlist.filter(item => item.book_id === bookId)[0];
  return axios
    .delete(`/api/wishlist-items/${item.id}`)
    .then(() => dispatch(removeItem(item.id)))
    .catch(err => console.log(err));
};
