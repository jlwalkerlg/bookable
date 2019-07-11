import axios from 'axios';
import { CATEGORIES_HYDRATE } from './types';

const hydrateCategories = categories => ({
  type: CATEGORIES_HYDRATE,
  categories
});

export const fetchCategories = () => dispatch =>
  axios
    .get('/api/categories', {
      params: {
        limit: 5,
        order_by: 'random'
      }
    })
    .then(response => dispatch(hydrateCategories(response.data.categories)));
