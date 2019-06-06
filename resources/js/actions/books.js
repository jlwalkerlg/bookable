import axios from 'axios';
import { BOOKS_FETCH } from './types';

const fetchBooks = books => ({
  type: BOOKS_FETCH,
  books
});

export const getBooks = () => dispatch => {
  axios
    .get('/api/books')
    .then(response => dispatch(fetchBooks(response.data)))
    .catch(error => console.log(error));
};
