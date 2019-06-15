import axios from 'axios';
import { WISHLIST_ADD, WISHLIST_REMOVE, WISHLIST_HYDRATE } from './types';

const addBook = item => ({
  type: WISHLIST_ADD,
  item
});

const removeBook = bookId => ({
  type: WISHLIST_REMOVE,
  bookId
});

export const hydrateWishlist = items => ({
  type: WISHLIST_HYDRATE,
  items
});

export const addToWishlist = book => dispatch =>
  axios
    .post('/api/wishlist-item', {
      book_id: book.id
    })
    .then(response => dispatch(addBook(response.data)))
    .catch(err => console.log(err));

export const removeFromWishlist = bookId => dispatch =>
  axios
    .delete(`/api/wishlist-item/${bookId}`)
    .then(() => dispatch(removeBook(bookId)))
    .catch(err => console.log(err));
