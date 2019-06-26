import { Component } from 'react';
import axios from 'axios';
import store from './store';
import { finishLoading } from './actions/loading';
import { oauthLogin } from './actions/user';
import { fetchCategories } from './actions/categories';

Component.prototype.setStateAsync = function(state) {
  return new Promise(resolve => this.setState(state, resolve));
};

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
