import axios from 'axios';
import store from './store';
import { finishLoading } from './actions/loading';
import { oauthLogin } from './actions/user';
import { fetchCategories } from './actions/categories';

const setupAxios = () => {
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
};

const initLogin = () => store.dispatch(oauthLogin());

const initCategories = () => store.dispatch(fetchCategories());

const init = async () => {
  setupAxios();
  await Promise.all([initLogin(), initCategories()]);
  store.dispatch(finishLoading);
};

export default init;
