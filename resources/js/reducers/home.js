import {
  HOME_BEST_SELLER_ADD,
  HOME_NEW_BOOKS_ADD,
  HOME_FEATURED_BOOKS_ADD,
  HOME_PENGUIN_BOOKS_ADD,
  HOME_TRENDING_BOOK_ADD
} from '../actions/types';

const initialState = {
  bestSeller: {},
  newBooks: [],
  featuredBooks: [],
  penguinBooks: [],
  trendingBook: {}
};

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case HOME_BEST_SELLER_ADD:
      return { ...state, bestSeller: action.book };
    case HOME_NEW_BOOKS_ADD:
      return { ...state, newBooks: action.books };
    case HOME_FEATURED_BOOKS_ADD:
      return { ...state, featuredBooks: action.books };
    case HOME_PENGUIN_BOOKS_ADD:
      return { ...state, penguinBooks: action.books };
    case HOME_TRENDING_BOOK_ADD:
      return { ...state, trendingBook: action.book };
    default:
      return state;
  }
}

export default homeReducer;
