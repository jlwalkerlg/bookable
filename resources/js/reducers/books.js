import { BOOKS_FETCH } from '../actions/types';

function booksReducer(books = [], action) {
  switch (action.type) {
    case BOOKS_FETCH:
      return action.books;
    default:
      return books;
  }
}

export default booksReducer;
