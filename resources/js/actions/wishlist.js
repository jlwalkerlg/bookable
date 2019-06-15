import axios from 'axios';
import { WISHLIST_ADD, WISHLIST_REMOVE, WISHLIST_HYDRATE } from './types';

const addBook = book => ({
  type: WISHLIST_ADD,
  book
});

const removeBook = id => ({
  type: WISHLIST_REMOVE,
  id
});

export const hydrateWishlist = books => ({
  type: WISHLIST_HYDRATE,
  books
});

export const addToWishlist = book => dispatch =>
  axios
    .post('/api/wishlist', {
      book_id: book.id
    })
    .then(() => dispatch(addBook(book)))
    .catch(err => console.log(err));

export const removeFromWishlist = id => dispatch =>
  axios
    .delete(`/api/wishlist/${id}`)
    .then(() => dispatch(removeBook(id)))
    .catch(err => console.log(err));
