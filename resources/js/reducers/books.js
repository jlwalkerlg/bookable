import { BOOKS_FETCH } from '../actions/types';

function booksReducer(state = [], action) {
  switch (action.type) {
    case BOOKS_FETCH:
      return action.books;
    default:
      return state;
  }
}

export default booksReducer;
