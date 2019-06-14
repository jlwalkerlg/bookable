import { CART_ADD, CART_HYDRATE } from '../actions/types';

function cartReducer(state = [], action) {
  switch (action.type) {
    case CART_ADD:
      return [...state, action.book];
    case CART_HYDRATE:
      return [...state, ...action.books];
    default:
      return state;
  }
}

export default cartReducer;
