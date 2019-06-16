import axios from 'axios';
import { SHELVES_ADD, SHELVES_REMOVE, SHELVES_HYDRATE } from './types';

const addItem = (shelf, item) => ({
  type: SHELVES_ADD,
  shelf,
  item
});

const removeItem = (shelf, item) => ({
  type: SHELVES_REMOVE,
  shelf,
  item
});

export const hydrateShelves = shelves => ({
  type: SHELVES_HYDRATE,
  shelves
});

export const addToShelf = (shelf, book) => dispatch =>
  axios
    .post(`/api/shelves/${shelf.id}/shelf-items`, {
      book_id: book.id
    })
    .then(response => dispatch(addItem(shelf, response.data)))
    .catch(err => console.log(err));

export const removeFromShelf = (shelf, item) => dispatch =>
  axios
    .delete(`/api/shelves/${shelf.id}/shelf-items/${item.id}`)
    .then(() => dispatch(removeItem(shelf, item)))
    .catch(err => console.log(err));
