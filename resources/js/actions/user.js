import {
  USER_LOGIN,
  USER_LOGOUT,
  WISHLIST_ADD,
  WISHLIST_REMOVE
} from './types';
import axios from 'axios';

const loginUser = user => ({
  type: USER_LOGIN,
  user
});

const logoutUser = {
  type: USER_LOGOUT
};

export const register = credentials => dispatch =>
  axios.post('/api/register', credentials).then(() => {
    dispatch(oauthLogin()).then(user => dispatch(loginUser(user)));
  });

export const login = credentials => dispatch =>
  axios.post('/api/login', credentials).then(() => {
    dispatch(oauthLogin()).then(user => dispatch(loginUser(user)));
  });

export const logout = () => dispatch =>
  axios.post('/api/logout').then(response => {
    dispatch(logoutUser);
    return response;
  });

export const oauthLogin = () => dispatch =>
  axios
    .get('/api/user')
    .then(response => {
      const user = response.data;
      dispatch(loginUser(user));
      return user;
    })
    .catch(error => error);

export const addBookToWishlist = bookId => ({
  type: WISHLIST_ADD,
  bookId
});

export const removeBookFromWishlist = bookId => ({
  type: WISHLIST_REMOVE,
  bookId
});
