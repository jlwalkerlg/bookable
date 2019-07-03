import {
  HOME_BEST_SELLER_ADD,
  HOME_NEW_BOOKS_ADD,
  HOME_FEATURED_BOOKS_ADD,
  HOME_PENGUIN_BOOKS_ADD,
  HOME_TRENDING_BOOK_ADD
} from './types';

export const addBestSeller = book => ({
  type: HOME_BEST_SELLER_ADD,
  book
});

export const addNewBooks = books => ({
  type: HOME_NEW_BOOKS_ADD,
  books
});

export const addFeaturedBooks = books => ({
  type: HOME_FEATURED_BOOKS_ADD,
  books
});

export const addPenguinBooks = books => ({
  type: HOME_PENGUIN_BOOKS_ADD,
  books
});

export const addTrendingBook = book => ({
  type: HOME_TRENDING_BOOK_ADD,
  book
});
