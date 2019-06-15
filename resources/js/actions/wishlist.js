import axios from 'axios';
import { WISHLIST_ADD, WISHLIST_REMOVE, WISHLIST_HYDRATE } from './types';

const addBook = book => ({
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

export const addToWishlist = book => dispatch =>
  axios
    .post('/api/wishlist', {
      book_id: book.id
    })
    .then(() => dispatch(addBook(book)))
    .catch(err => console.log(err));
