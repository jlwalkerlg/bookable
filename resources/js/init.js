import axios from 'axios';
import store from './store';
import { finishLoading } from './actions/loading';
import { oauthLogin } from './actions/user';

const setupAxios = () => {
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  axios.defaults.headers.common['X-CSRF-TOKEN'] = document.head
    .querySelector('meta[name="csrf-token"]')
    .getAttribute('content');
};

const initLogin = async () => {
  if (localStorage.getItem('access_token')) {
    const token = localStorage.getItem('access_token');
    await store.dispatch(oauthLogin(token));
  }
};

const init = async () => {
  setupAxios();
  await initLogin();
  store.dispatch(finishLoading);
};

export default init;
