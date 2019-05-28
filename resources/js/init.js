import axios from 'axios';
import store from './store';
import { finishLoading } from './actions/loading';
import { oauthLogin } from './actions/user';

const setupAxios = () => {
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
};

const initLogin = () => store.dispatch(oauthLogin());

const init = async () => {
  setupAxios();
  await initLogin();
  store.dispatch(finishLoading);
};

export default init;
