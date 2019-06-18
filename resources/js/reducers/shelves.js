import { SHELVES_HYDRATE } from '../actions/types';

function shelvesReducer(shelves = [], action) {
  switch (action.type) {
    case SHELVES_HYDRATE:
      return action.shelves;
    default:
      return shelves;
  }
}

export default shelvesReducer;
