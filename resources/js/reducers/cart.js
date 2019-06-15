import { CART_ADD, CART_HYDRATE, CART_REMOVE } from '../actions/types';

function cartReducer(state = [], action) {
  switch (action.type) {
    case CART_ADD:
      return [...state, action.book];
    case CART_REMOVE:
      return state.filter(book => book.id !== action.id);
    case CART_HYDRATE:
      return action.cart;
    default:
      return state;
  }
}

export default cartReducer;
