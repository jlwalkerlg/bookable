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
    const token = user.token;
    localStorage.setItem('access_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    dispatch(loginUser(user));
    return user;
  });

export const login = credentials => dispatch =>
  axios.post('/api/login', credentials).then(response => {
    const user = response.data;
    const token = user.token;
    localStorage.setItem('access_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    dispatch(loginUser(user));
    return user;
  });

export const logout = () => dispatch =>
  axios.post('/api/logout').then(response => {
    localStorage.removeItem('access_token');
    dispatch(logoutUser);
    return response;
  });

export const oauthLogin = token => dispatch => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return axios
    .get('/api/user')
    .then(response => {
      const user = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        token
      };
      dispatch(loginUser(user));
      return user;
    })
    .catch(error => console.log(error));
};
