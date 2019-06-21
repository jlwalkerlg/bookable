import { CATEGORIES_HYDRATE } from '../actions/types';

function categoriesReducer(categories = [], action) {
  switch (action.type) {
    case CATEGORIES_HYDRATE:
      return action.categories;
    default:
      return categories;
  }
}

export default categoriesReducer;
