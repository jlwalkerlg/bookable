import axios from 'axios';
import { SHELVES_ADD, SHELVES_HYDRATE } from './types';

const addItem = (shelf, item) => ({
  type: SHELVES_ADD,
  shelf,
  item
});

export const hydrateShelves = shelves => ({
  type: SHELVES_HYDRATE,
  shelves
});

export const addToShelf = (shelf, book) => dispatch => {
  axios
    .post(`/api/shelves/${shelf.id}/shelf-items`, {
      book_id: book.id
    })
    .then(response => dispatch(addItem(shelf, response.data)))
    .catch(err => console.log(err));
};
