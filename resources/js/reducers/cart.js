import { CART_ADD, CART_HYDRATE, CART_REMOVE } from '../actions/types';

function cartReducer(cart = [], action) {
  switch (action.type) {
    case CART_ADD:
      return [...cart, action.book];
    case CART_REMOVE:
      return cart.filter(book => book.id !== action.id);
    case CART_HYDRATE:
      return action.books;
    default:
      return cart;
  }
}

export default cartReducer;
