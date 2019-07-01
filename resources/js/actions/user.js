import { USER_ADD, USER_REMOVE } from './types';
import { hydrateWishlist } from './wishlist';
import { hydrateCart } from './cart';
import axios from 'axios';

export const addUser = user => ({
  type: USER_ADD,
  user
});

const removeUser = {
  type: USER_REMOVE
};

export const register = credentials => dispatch =>
  axios.post('/api/register', credentials).then(() => dispatch(oauthLogin()));

export const login = credentials => dispatch =>
  axios.post('/api/login', credentials).then(() => dispatch(oauthLogin()));

export const logout = () => dispatch =>
  axios.post('/api/logout').then(response => {
    dispatch(removeUser);
    return response;
  });

export const oauthLogin = () => dispatch =>
  axios
    .get('/api/user', {
      params: { with: 'wishlist.items,cart.items,quotes' }
    })
    .then(response => {
      const { wishlist, cart, quotes, ...user } = response.data;
      dispatch(addUser(user));
      dispatch(hydrateWishlist(wishlist));
      dispatch(hydrateCart(cart));
    })
    .catch(error => error);
