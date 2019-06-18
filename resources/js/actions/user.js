import { USER_LOGIN, USER_LOGOUT } from './types';
import { hydrateWishlist } from './wishlist';
import { hydrateCart } from './cart';
import axios from 'axios';

const loginUser = user => ({
  type: USER_LOGIN,
  user
});

const logoutUser = {
  type: USER_LOGOUT
};

export const register = credentials => dispatch =>
  axios.post('/api/register', credentials).then(() => dispatch(oauthLogin()));

export const login = credentials => dispatch =>
  axios.post('/api/login', credentials).then(() => dispatch(oauthLogin()));

export const logout = () => dispatch =>
  axios.post('/api/logout').then(response => {
    dispatch(logoutUser);
    return response;
  });

export const oauthLogin = () => dispatch =>
  axios
    .get('/api/user')
    .then(response => {
      const { user, wishlist, cart } = response.data;
      dispatch(loginUser(user));
      dispatch(hydrateWishlist(wishlist));
      dispatch(hydrateCart(cart));
    })
    .catch(error => error);
