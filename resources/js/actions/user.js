import { USER_LOGIN, USER_LOGOUT } from './types';
import axios from 'axios';

const loginUser = user => ({
  type: USER_LOGIN,
  user
});

const logoutUser = {
  type: USER_LOGOUT
};

export const register = credentials => dispatch =>
  axios.post('/api/register', credentials).then(response => {
    const user = response.data;
    dispatch(loginUser(user));
    return user;
  });

export const login = credentials => dispatch =>
  axios.post('/api/login', credentials).then(response => {
    const user = response.data;
    dispatch(loginUser(user));
    return user;
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
      const user = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email
      };
      dispatch(loginUser(user));
      return user;
    })
    .catch(error => error);
